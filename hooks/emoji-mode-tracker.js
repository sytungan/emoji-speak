#!/usr/bin/env node
// emoji-speak — UserPromptSubmit hook.
// Detects natural-language activation/deactivation phrases in the user prompt,
// updates the flag file + persisted XDG config, and emits per-turn reinforcement
// when emoji-speak mode is active.

const fs = require('fs');
const path = require('path');
const os = require('os');
const {
  getConfigDir, getConfigPath,
  safeWriteFlag, readFlag,
} = require('./emoji-config');

const claudeDir = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
const flagPath = path.join(claudeDir, '.emoji-speak-active');

const ON_RX_1 = /\b(activate|enable|turn on|start|use)\b[\s\S]{0,40}\bemoji\b/i;
const ON_RX_2 = /\bemoji\b[\s\S]{0,20}\b(on|mode|activate|enable)\b/i;
const OFF_RX_1 = /\b(stop|disable|turn off|deactivate)\b[\s\S]{0,40}\bemoji\b/i;
const OFF_RX_2 = /\bemoji\b[\s\S]{0,20}\b(off|stop|disable|deactivate)\b/i;
const NORMAL_MODE_RX = /\bnormal mode\b/i;
const SLASH_ON_RX = /^\/emoji-speak:emoji\s+on\b/i;
const SLASH_OFF_RX = /^\/emoji-speak:emoji\s+off\b/i;

const REINFORCEMENT =
  'EMOJI-SPEAK MODE ACTIVE. Reply in 100% emoji per the emoji-speak SKILL. ' +
  'Preserve code, paths, URLs, commands, and errors verbatim. ' +
  '"stop emoji" or "normal mode" to exit.';

function persistConfig(mode) {
  try {
    fs.mkdirSync(getConfigDir(), { recursive: true });
    fs.writeFileSync(getConfigPath(), JSON.stringify({ defaultMode: mode }) + '\n');
  } catch (_e) { /* best-effort */ }
}

function turnOn() {
  try { fs.mkdirSync(claudeDir, { recursive: true }); } catch (_e) {}
  safeWriteFlag(flagPath, 'on');
  persistConfig('on');
}

function turnOff() {
  try { fs.unlinkSync(flagPath); } catch (_e) {}
  persistConfig('off');
}

let input = '';
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
  let prompt = '';
  try {
    const data = JSON.parse(input);
    prompt = (data.prompt || '').trim();
  } catch (_e) {
    process.exit(0);
  }

  const lower = prompt.toLowerCase();

  const wantsOff =
    SLASH_OFF_RX.test(lower) ||
    OFF_RX_1.test(lower) ||
    OFF_RX_2.test(lower) ||
    NORMAL_MODE_RX.test(lower);

  const wantsOn =
    SLASH_ON_RX.test(lower) ||
    ON_RX_1.test(lower) ||
    ON_RX_2.test(lower);

  // OFF wins on conflict (user is more likely trying to exit).
  if (wantsOff) {
    turnOff();
  } else if (wantsOn) {
    turnOn();
  }

  // Per-turn reinforcement when active. Re-read flag *after* any toggle above
  // so a fresh ON gets reinforcement immediately and a fresh OFF gets nothing.
  const mode = readFlag(flagPath);
  if (mode === 'on') {
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'UserPromptSubmit',
        additionalContext: REINFORCEMENT
      }
    }));
  }
  process.exit(0);
});
