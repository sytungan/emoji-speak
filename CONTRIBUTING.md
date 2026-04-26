# Contributing

Thanks for your interest in emoji-speak. This is a small, focused project — contributions that keep it small and focused are very welcome.

## Quick map of the repo

```
.claude-plugin/
  plugin.json          # plugin manifest (hooks registration)
  marketplace.json     # local marketplace entry
skills/emoji-speak/
  SKILL.md             # behavior rules + canonical emoji cheatsheet
hooks/
  emoji-config.js      # config resolver + safe flag read/write
  emoji-activate.js    # SessionStart hook (re-anchors SKILL each session)
  emoji-mode-tracker.js # UserPromptSubmit hook (natural-language toggle + per-turn drift protection)
commands/
  emoji.md             # /emoji-speak:emoji on|off slash command
tests/                 # node:test suites for the hooks (25 tests)
evals/                 # benchmark harness (Python, tiktoken o200k_base)
```

## Develop locally

Clone and link the repo as a Claude Code plugin via local marketplace:

```bash
git clone https://github.com/sytungan/emoji-speak
cd emoji-speak
```

Inside Claude Code:

```
/plugin marketplace add /absolute/path/to/emoji-speak
/plugin install emoji-speak@emoji-speak
/reload-plugins
```

Edits to the source directory don't auto-propagate to the install cache. After making changes:

```bash
rsync -a --delete \
  --exclude='.git' --exclude='.venv' --exclude='node_modules' --exclude='__pycache__' --exclude='snapshots' \
  ./ ~/.claude/plugins/cache/emoji-speak/emoji-speak/0.1.0/
```

Then `/reload-plugins` in Claude Code.

## Run the tests

```bash
node --test tests/*.mjs
```

Node 18+ required. The test suite is dependency-free (uses the built-in `node:test`).

The benchmark suite needs Python:

```bash
cd evals
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python llm_run.py    # spends real Claude API tokens
python measure.py    # free; runs against the snapshot
```

## What kinds of changes are welcome

- **Bug fixes** in the hooks (frontmatter stripping edge cases, Windows path handling, permission errors)
- **New emoji mappings** in `SKILL.md`'s canonical cheatsheet — but only ones that are universally readable. We don't want a sprawling dictionary.
- **Multi-agent manifests** (Cursor, Windsurf, Gemini, Codex, Cline, Copilot) — see [caveman](https://github.com/JuliusBrussee/caveman) for the layout.
- **Benchmark prompts** that surface interesting failure modes or cover question types that aren't in `evals/prompts.txt` yet.
- **Statusline scripts** for users who don't run claude-hud.
- **Real-world before/after measurements** to replace or augment the illustrative pairs in the README.

## What is *not* welcome

- Adding intensity levels (`lite`/`full`/`ultra`). The plugin is intentionally single-mode — emoji on, emoji off. If you want graded emoji density, fork it.
- Configuration knobs for "but what if I want emoji *and* English". The whole point is the strict 100%-emoji rule. Carve-outs already cover the cases that matter (security, destructive ops, clarification).
- Heavy dependencies. Hooks must run in `<3 seconds` on cold start; tests must work without `npm install`.

## Style

- **Hooks (JS):** CommonJS, no transpilation, no runtime deps. Wrap stdin handlers in try/catch and exit 0 on any failure — a misbehaving hook must never block a user's prompt.
- **Tests:** TDD. Write the failing test, run it, then make it pass. New behavior without a test will be asked for one.
- **Commits:** Conventional Commits style (`feat:`, `fix:`, `docs:`, `chore:`). Keep them small and focused.
- **PRs:** One conceptual change per PR. If the PR description has the word "and", it's probably two PRs.

## License

By contributing, you agree your changes are released under the MIT license (see `LICENSE`). No CLA.
