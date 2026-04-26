# 🎭 emoji-speak

> Talk to Claude in **100% emoji**. Fun first.

```
> Why does my useEffect run twice?
🤔 `React.StrictMode` → 🔁 dev-only double-invoke → 🎯 surface 🐛 in effects.
✅ prod: 1️⃣. ❌ not-bug.
```

Code, paths, URLs, error messages, and version numbers stay verbatim. Everything else becomes emoji.

---

## ⚡ Install (30 seconds)

```bash
/plugin marketplace add <path-to-this-repo>
/plugin install emoji-speak@emoji-speak
/reload-plugins
```

---

## 🎮 Use it

| To do this | Type this |
|---|---|
| **Turn on** | `/emoji-speak:emoji on` &nbsp;or&nbsp; `"emoji on"` &nbsp;or&nbsp; `"use emoji"` |
| **Turn off** | `/emoji-speak:emoji off` &nbsp;or&nbsp; `"stop emoji"` &nbsp;or&nbsp; `"normal mode"` |

Your choice persists to the next session.

---

## 🌟 More demos

**`What does git rebase --onto do?`**

> 🌿 A → 🌿 B (base ⬅️) → 🌿 C ⤴️ → ✏️ replay commits onto 🌿 C.
> 🎯 surgical reparent.

**`Deploy to prod?`**

> 🧪 ✅ ? → 🚀 `git push origin main` → 🏁

**`drop the users table`** *(safety auto-engages)*

> ⚠️ **Warning:** this permanently deletes everything in the `users` table and cannot be undone. Verify you have a backup first.
>
> ```sql
> DROP TABLE users;
> ```
>
> 🎭 resume. 💾 ✅?

---

## 🛡️ When emoji *steps aside*

Plain English takes over for:

- 🚨 security warnings
- 🗑️ destructive / irreversible actions
- 1️⃣2️⃣3️⃣ multi-step procedures where wrong order = harm
- ❓ when you say *"wait, what?"* and need a clear answer

Once the dangerous part is over, emoji mode resumes automatically.

---

## 📊 Numbers

A benchmark harness lives in [`evals/`](evals/). Run it to see real token counts on your own machine:

```bash
cd evals && python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python llm_run.py && python measure.py
```

The script reports `emoji_speak` vs `baseline` (no system prompt — what most casual users have) and `emoji_speak` vs `terse` (apples-to-apples). Both numbers, no spin.

---

## 🗺️ Roadmap

| | |
|---|---|
| ✅ | Core SKILL + SessionStart hook |
| ✅ | `/emoji-speak:emoji on\|off` |
| ✅ | Natural-language toggling + per-turn drift protection |
| ✅ | Benchmark harness |
| 🚧 | `emoji-compress` — convert your `CLAUDE.md` to emoji |
| 💭 | Statusline indicator |
| 💭 | Multi-agent (Cursor, Windsurf, Gemini, Codex, Cline, Copilot) |

---

## 🧪 Develop

```bash
node --test tests/*.mjs    # run all 25 tests
```

(Node 24+ needs the explicit glob — `tests/` alone doesn't recurse.)

---

## 📜 Credits

- Inspired by [caveman](https://github.com/JuliusBrussee/caveman) — same plugin scaffolding, opposite vibe.
- MIT licensed. See [`LICENSE`](LICENSE).
