# 🎭 emoji-speak

> Talk to Claude in **100% emoji**. Fun first.

```
> Why does my useEffect run twice?
🤔 `React.StrictMode` → 🔁 dev-only double-invoke → 🎯 surface 🐛 in effects.
✅ prod: 1️⃣. ❌ not-bug.
```

Code, paths, URLs, error messages, and version numbers stay verbatim. Everything else becomes emoji.

> 💾 **Sample:** for the question *"what's the difference between `let` and `const`?"*, emoji-speak's reply was **128 output tokens vs. 192 from unprompted Claude — a 33% saving**. Real per-question deltas vary wildly (some questions get longer; trivially-short ones can balloon). [See the methodology and run it yourself.](#-numbers)

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

A benchmark harness lives in [`evals/`](evals/). It runs each of 10 dev questions through three system-prompt conditions and counts output tokens with `tiktoken o200k_base`:

| Arm | System prompt |
|-----|--------------|
| `baseline` | none |
| `terse` | `Answer concisely.` |
| `emoji_speak` | `Answer concisely.` + the SKILL body |

The script reports two deltas, both honest:

- `emoji_speak` vs `baseline` — what casual users will actually feel (most run Claude with no system prompt).
- `emoji_speak` vs `terse` — apples-to-apples; isolates the emoji style itself.

**The honest framing:** emoji-speak isn't *uniformly* a token saver. For questions where Claude's natural answer is already terse (like *"how do I delete a remote git branch?"*), wrapping a one-line answer in emoji + code spans actually adds tokens. For questions where Claude's natural answer is verbose (explanations, comparisons), emoji-speak compresses meaningfully — like the 33% saving on the `let` vs `const` example above. Run the harness on your own questions to see how it does for *your* workload:

```bash
cd evals && python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python llm_run.py && python measure.py
```

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
