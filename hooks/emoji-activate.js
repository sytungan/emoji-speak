#!/usr/bin/env node
// emoji-speak — Claude Code SessionStart activation hook.
// Reads SKILL.md and emits it as hidden context when mode is 'on'.

const fs = require('fs');
const path = require('path');
const os = require('os');
const { getDefaultMode, safeWriteFlag } = require('./emoji-config');

const claudeDir = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
const flagPath = path.join(claudeDir, '.emoji-speak-active');
const mode = getDefaultMode();

if (mode === 'off') {
  try { fs.unlinkSync(flagPath); } catch (_e) {}
  process.stdout.write('OK');
  process.exit(0);
}

// mode === 'on'
try { fs.mkdirSync(claudeDir, { recursive: true }); } catch (_e) {}
safeWriteFlag(flagPath, mode);

const FALLBACK = '🎭 emoji-speak active. All prose in emoji. Preserve code/paths/URLs verbatim. "stop emoji" or "normal mode" to exit.';

let output = FALLBACK;
try {
  const skillContent = fs.readFileSync(
    path.join(__dirname, '..', 'skills', 'emoji-speak', 'SKILL.md'),
    'utf8'
  );
  // Strip YAML frontmatter (first --- ... --- block)
  output = skillContent.replace(/^---[\s\S]*?---\s*/, '');
} catch (_e) { /* use fallback */ }

process.stdout.write(output);
process.exit(0);
