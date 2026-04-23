import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const configModulePath = path.resolve('hooks/emoji-config.js');

function freshRequire() {
  delete require.cache[configModulePath];
  return require(configModulePath);
}

function tmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'emoji-speak-test-'));
}

test('env var EMOJI_SPEAK_DEFAULT=on wins', () => {
  process.env.EMOJI_SPEAK_DEFAULT = 'on';
  delete process.env.XDG_CONFIG_HOME;
  const { getDefaultMode } = freshRequire();
  assert.equal(getDefaultMode(), 'on');
  delete process.env.EMOJI_SPEAK_DEFAULT;
});

test('env var invalid value is ignored, falls through', () => {
  process.env.EMOJI_SPEAK_DEFAULT = 'bogus';
  delete process.env.XDG_CONFIG_HOME;
  const { getDefaultMode } = freshRequire();
  // With no config file, default is 'off'
  assert.equal(getDefaultMode(), 'off');
  delete process.env.EMOJI_SPEAK_DEFAULT;
});

test('XDG_CONFIG_HOME config.json with defaultMode=on is honored', () => {
  delete process.env.EMOJI_SPEAK_DEFAULT;
  const dir = tmpDir();
  const confDir = path.join(dir, 'emoji-speak');
  fs.mkdirSync(confDir, { recursive: true });
  fs.writeFileSync(path.join(confDir, 'config.json'), JSON.stringify({ defaultMode: 'on' }));
  process.env.XDG_CONFIG_HOME = dir;
  const { getDefaultMode } = freshRequire();
  assert.equal(getDefaultMode(), 'on');
  delete process.env.XDG_CONFIG_HOME;
});

test('missing config file falls back to off', () => {
  delete process.env.EMOJI_SPEAK_DEFAULT;
  process.env.XDG_CONFIG_HOME = tmpDir();
  const { getDefaultMode } = freshRequire();
  assert.equal(getDefaultMode(), 'off');
  delete process.env.XDG_CONFIG_HOME;
});

test('safeWriteFlag writes the mode string', () => {
  const dir = tmpDir();
  const flag = path.join(dir, '.emoji-speak-active');
  const { safeWriteFlag } = freshRequire();
  safeWriteFlag(flag, 'on');
  assert.equal(fs.readFileSync(flag, 'utf8'), 'on');
});

test('safeWriteFlag refuses to follow a symlink', () => {
  const dir = tmpDir();
  const victim = path.join(dir, 'victim.txt');
  fs.writeFileSync(victim, 'untouched');
  const flag = path.join(dir, '.emoji-speak-active');
  fs.symlinkSync(victim, flag);
  const { safeWriteFlag } = freshRequire();
  assert.throws(() => safeWriteFlag(flag, 'on'));
  assert.equal(fs.readFileSync(victim, 'utf8'), 'untouched');
});
