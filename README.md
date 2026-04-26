# emoji-speak

**A stylized communication mode for Claude Code. Replies in 100% emoji. Fun-first, and in some cases fewer tokens.**

```
> Why does my useEffect run twice?
🤔 `React.StrictMode` → 🔁 dev-only double-invoke → 🎯 surface 🐛 in effects.
✅ prod: 1️⃣. ❌ not-bug.
```

## Quick start

From inside a Claude Code session:

```
/plugin marketplace add <path-to-this-repo>
/plugin install emoji-speak@emoji-speak
/reload-plugins
/emoji-speak:emoji on
```

Ask Claude anything. Replies come back in emoji.

## Commands

Claude Code namespaces plugin commands as `/<plugin>:<command>`:

- `/emoji-speak:emoji on` — activate for this session and persist as the default
- `/emoji-speak:emoji off` — deactivate

## Natural-language toggling

You don't have to type the slash command. Any of these phrases (in any
casing, anywhere in your message) flips the mode:

| Goal | Example phrases |
|------|-----------------|
| Activate | `"emoji on"`, `"use emoji"`, `"emoji mode"`, `"activate emoji"`, `"start emoji"` |
| Deactivate | `"stop emoji"`, `"emoji off"`, `"normal mode"`, `"disable emoji"` |

If both an on-phrase and an off-phrase appear in the same message,
deactivation wins (you were probably trying to exit).

Either path persists into the next session via the same XDG config file
the slash command writes.

## How it works

A SessionStart hook reads your config and, if the mode is `on`, emits the
SKILL rules as hidden context for every session. That re-anchors the
behavior across long conversations and context compaction so emoji-speak
doesn't drift back to English on its own.

**Config priority:**

1. `EMOJI_SPEAK_DEFAULT=on|off` environment variable
2. `$XDG_CONFIG_HOME/emoji-speak/config.json` if `XDG_CONFIG_HOME` is set
3. `~/.config/emoji-speak/config.json` (macOS / Linux)
4. `%APPDATA%\emoji-speak\config.json` (Windows)
5. default: `off`

## What's preserved verbatim

Code blocks, inline code, file paths, URLs, shell commands, error messages,
proper nouns, library names, and version numbers are never emoji-fied. Only
prose becomes emoji. Structure (headings, lists, tables) is preserved too.

## Safety

Emoji mode automatically suspends for:

- security warnings
- destructive or irreversible actions (e.g. `DROP TABLE`, `rm -rf`, force-push)
- multi-step procedures where fragment order could cause harm
- explicit "please clarify" / repeated questions

Normal English resumes for the risky part, then emoji mode picks up again.

## Development

Tests use the built-in `node:test` runner. From the plugin root:

```bash
node --test tests/*.mjs
```

(On Node 24+, pass the glob explicitly — `node --test tests/` doesn't recurse
into a directory in that version.)

## Roadmap

**Phase 1 (this release):**
- Core SKILL with the canonical emoji cheatsheet
- SessionStart hook + config resolver
- `/emoji on|off` slash command

**Future phases:**
- `UserPromptSubmit` tracker (instant toggle from natural-language messages)
- Statusline indicator
- `/emoji-commit` and `/emoji-help` commands
- `emoji-compress` companion CLI for converting `CLAUDE.md` files
- Evals harness with real LLM token measurements
- Multi-agent manifests (Cursor, Windsurf, Gemini, Codex, Cline, Copilot)

## License

MIT. See [`LICENSE`](LICENSE).

## Inspired by

[JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) — same
plugin scaffolding, opposite vibe.
