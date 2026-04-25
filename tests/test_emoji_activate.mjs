import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const hookPath = path.resolve('hooks/emoji-activate.js');
const skillPath = path.resolve('skills/emoji-speak/SKILL.md');

function tmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'emoji-speak-activate-'));
}

function runHook(env) {
  return spawnSync('node', [hookPath], {
    env: { ...process.env, ...env, EMOJI_SPEAK_DEFAULT: env.EMOJI_SPEAK_DEFAULT ?? '' },
    encoding: 'utf8'
  });
}

test('mode=off: exits 0, prints OK, no flag file', () => {
  const cdir = tmpDir();
  const { status, stdout } = runHook({ CLAUDE_CONFIG_DIR: cdir, EMOJI_SPEAK_DEFAULT: 'off' });
  assert.equal(status, 0);
  assert.match(stdout, /OK/);
  assert.equal(fs.existsSync(path.join(cdir, '.emoji-speak-active')), false);
});

test('mode=off removes stale flag file', () => {
  const cdir = tmpDir();
  const flag = path.join(cdir, '.emoji-speak-active');
  fs.writeFileSync(flag, 'on');
  runHook({ CLAUDE_CONFIG_DIR: cdir, EMOJI_SPEAK_DEFAULT: 'off' });
  assert.equal(fs.existsSync(flag), false);
});

test('mode=on: exits 0, writes flag, emits SKILL body (no frontmatter)', () => {
  const cdir = tmpDir();
  // Precondition: SKILL.md exists (built in Task 2).
  assert.ok(fs.existsSync(skillPath), 'SKILL.md must exist before this test runs');
  const { status, stdout } = runHook({ CLAUDE_CONFIG_DIR: cdir, EMOJI_SPEAK_DEFAULT: 'on' });
  assert.equal(status, 0);
  assert.equal(fs.readFileSync(path.join(cdir, '.emoji-speak-active'), 'utf8'), 'on');
  // Frontmatter stripped: output must not start with '---'
  assert.ok(!stdout.trimStart().startsWith('---'), 'frontmatter should be stripped');
  // Body sanity: the canonical cheatsheet's first emoji should appear
  assert.match(stdout, /✅/);
});
