// emoji-speak — shared configuration resolver
const fs = require('fs');
const path = require('path');
const os = require('os');

const VALID_MODES = ['on', 'off'];

function getConfigDir() {
  if (process.env.XDG_CONFIG_HOME) {
    return path.join(process.env.XDG_CONFIG_HOME, 'emoji-speak');
  }
  if (process.platform === 'win32') {
    return path.join(
      process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'),
      'emoji-speak'
    );
  }
  return path.join(os.homedir(), '.config', 'emoji-speak');
}

function getConfigPath() {
  return path.join(getConfigDir(), 'config.json');
}

function getDefaultMode() {
  const envMode = process.env.EMOJI_SPEAK_DEFAULT;
  if (envMode && VALID_MODES.includes(envMode.toLowerCase())) {
    return envMode.toLowerCase();
  }
  try {
    const config = JSON.parse(fs.readFileSync(getConfigPath(), 'utf8'));
    if (config.defaultMode && VALID_MODES.includes(config.defaultMode.toLowerCase())) {
      return config.defaultMode.toLowerCase();
    }
  } catch (_e) { /* missing or invalid — fall through */ }
  return 'off';
}

function safeWriteFlag(flagPath, mode) {
  // Refuse to follow symlinks (matches caveman's safeWriteFlag).
  try {
    const stat = fs.lstatSync(flagPath);
    if (stat.isSymbolicLink()) {
      throw new Error(`refusing to write flag: ${flagPath} is a symlink`);
    }
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
  }
  fs.writeFileSync(flagPath, mode, { flag: 'w' });
}

const FLAG_MAX_BYTES = 16;

function readFlag(flagPath) {
  // Symlink-safe + size-capped + whitelist-validated.
  // The return value can be fed back into Claude's context as additionalContext,
  // so all three checks must pass before returning anything other than null.
  try {
    const stat = fs.lstatSync(flagPath);
    if (stat.isSymbolicLink()) return null;
    if (stat.size > FLAG_MAX_BYTES) return null;
  } catch (_e) {
    return null;
  }
  let value;
  try {
    value = fs.readFileSync(flagPath, 'utf8').trim().toLowerCase();
  } catch (_e) {
    return null;
  }
  return VALID_MODES.includes(value) ? value : null;
}

module.exports = { getConfigDir, getConfigPath, getDefaultMode, safeWriteFlag, readFlag, VALID_MODES };
