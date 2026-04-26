import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const hookPath = path.resolve('hooks/emoji-mode-tracker.js');

function tmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'emoji-tracker-'));
}

function runTracker({ prompt, claudeDir, xdgHome }) {
  const env = {
    ...process.env,
    CLAUDE_CONFIG_DIR: claudeDir,
    XDG_CONFIG_HOME: xdgHome,
    EMOJI_SPEAK_DEFAULT: ''
  };
  return spawnSync('node', [hookPath], {
    env,
    input: JSON.stringify({ prompt }),
    encoding: 'utf8'
  });
}

function readConfig(xdgHome) {
  const p = path.join(xdgHome, 'emoji-speak', 'config.json');
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

test('plain prompt with no triggers and no active flag: exits 0, empty stdout, no flag, no config write', () => {
  const cdir = tmpDir();
  const xdg = tmpDir();
  const r = runTracker({ prompt: 'how do I sort a list in python', claudeDir: cdir, xdgHome: xdg });
  assert.equal(r.status, 0);
  assert.equal(r.stdout.trim(), '');
  assert.equal(fs.existsSync(path.join(cdir, '.emoji-speak-active')), false);
  assert.equal(readConfig(xdg), null);
});

test('"emoji on" turns it on: writes flag, persists config, emits additionalContext', () => {
  const cdir = tmpDir();
  const xdg = tmpDir();
  const r = runTracker({ prompt: 'please emoji on', claudeDir: cdir, xdgHome: xdg });
  assert.equal(r.status, 0);
  assert.equal(fs.readFileSync(path.join(cdir, '.emoji-speak-active'), 'utf8'), 'on');
  assert.deepEqual(readConfig(xdg), { defaultMode: 'on' });
  const out = JSON.parse(r.stdout);
  assert.equal(out.hookSpecificOutput.hookEventName, 'UserPromptSubmit');
  assert.match(out.hookSpecificOutput.additionalContext, /EMOJI-SPEAK MODE ACTIVE/);
});

test('"use emoji" also activates', () => {
  const cdir = tmpDir();
  const xdg = tmpDir();
  runTracker({ prompt: "let's use emoji from now on", claudeDir: cdir, xdgHome: xdg });
  assert.equal(fs.readFileSync(path.join(cdir, '.emoji-speak-active'), 'utf8'), 'on');
});

test('"stop emoji" turns it off: removes flag, persists config off, emits no additionalContext', () => {
  const cdir = tmpDir();
  const xdg = tmpDir();
  fs.writeFileSync(path.join(cdir, '.emoji-speak-active'), 'on');
  const r = runTracker({ prompt: 'ok stop emoji please', claudeDir: cdir, xdgHome: xdg });
  assert.equal(r.status, 0);
  assert.equal(fs.existsSync(path.join(cdir, '.emoji-speak-active')), false);
  assert.deepEqual(readConfig(xdg), { defaultMode: 'off' });
  assert.equal(r.stdout.trim(), '');
});

test('"normal mode" also deactivates', () => {
  const cdir = tmpDir();
  const xdg = tmpDir();
  fs.writeFileSync(path.join(cdir, '.emoji-speak-active'), 'on');
  runTracker({ prompt: 'switch to normal mode', claudeDir: cdir, xdgHome: xdg });
  assert.equal(fs.existsSync(path.join(cdir, '.emoji-speak-active')), false);
});

test('plain prompt while flag is active emits per-turn reinforcement', () => {
  const cdir = tmpDir();
  const xdg = tmpDir();
  fs.writeFileSync(path.join(cdir, '.emoji-speak-active'), 'on');
  const r = runTracker({ prompt: 'tell me about hash maps', claudeDir: cdir, xdgHome: xdg });
  assert.equal(r.status, 0);
  assert.equal(fs.readFileSync(path.join(cdir, '.emoji-speak-active'), 'utf8'), 'on');
  const out = JSON.parse(r.stdout);
  assert.match(out.hookSpecificOutput.additionalContext, /EMOJI-SPEAK MODE ACTIVE/);
});

test('OFF wins when both ON and OFF phrases appear', () => {
  const cdir = tmpDir();
  const xdg = tmpDir();
  fs.writeFileSync(path.join(cdir, '.emoji-speak-active'), 'on');
  runTracker({ prompt: "I had emoji on but please stop emoji", claudeDir: cdir, xdgHome: xdg });
  assert.equal(fs.existsSync(path.join(cdir, '.emoji-speak-active')), false);
  assert.deepEqual(readConfig(xdg), { defaultMode: 'off' });
});

test('symlink flag is ignored (treated as not-active, no reinforcement)', () => {
  const cdir = tmpDir();
  const xdg = tmpDir();
  const victim = path.join(cdir, 'victim.txt');
  fs.writeFileSync(victim, 'on');
  fs.symlinkSync(victim, path.join(cdir, '.emoji-speak-active'));
  const r = runTracker({ prompt: 'plain question', claudeDir: cdir, xdgHome: xdg });
  assert.equal(r.status, 0);
  assert.equal(r.stdout.trim(), '');
});

test('malformed JSON on stdin: exits 0, no output, no side effects', () => {
  const cdir = tmpDir();
  const xdg = tmpDir();
  const r = spawnSync('node', [hookPath], {
    env: { ...process.env, CLAUDE_CONFIG_DIR: cdir, XDG_CONFIG_HOME: xdg, EMOJI_SPEAK_DEFAULT: '' },
    input: 'not json at all',
    encoding: 'utf8'
  });
  assert.equal(r.status, 0);
  assert.equal(r.stdout.trim(), '');
  assert.equal(fs.existsSync(path.join(cdir, '.emoji-speak-active')), false);
});
