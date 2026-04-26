# 🎭 emoji-speak

> Talk to Claude in **100% emoji**. Fun first.

```
> Why does my useEffect run twice?
🤔 `React.StrictMode` → 🔁 dev-only double-invoke → 🎯 surface 🐛 in effects.
✅ prod: 1️⃣. ❌ not-bug.
```

Code, paths, URLs, error messages, and version numbers stay verbatim. Everything else becomes emoji.

## 🔀 Before / After

<table>
<tr>
<td width="50%">

#### 🗣️ Normal Claude · `115 tokens`

> In JavaScript, the main difference between `let` and `const` is reassignment. Variables declared with `let` can be reassigned later in the same scope, while variables declared with `const` cannot be reassigned after their initial value is set. Both are block-scoped (only visible within the nearest enclosing `{ }`), unlike `var` which is function-scoped. Note that `const` only prevents reassignment of the binding itself — if the value is an object or array, you can still mutate its contents. Use `const` by default for safety, and reach for `let` only when you genuinely need to reassign.

</td>
<td width="50%">

#### 🎭 emoji-speak · `71 tokens` *(−38%)*

> ≡ `const` ≠ `let`:
> - `let`: ✏️ reassign ✅
> - `const`: ✏️ reassign ❌ (binding) — 🧭 mutate object/array ✅
> - both: block-scoped (`{ }`)
>
> ✅ `const` 1️⃣, `let` only when needed.

</td>
</tr>
<tr>
<td>

#### 🗣️ Normal Claude · `110 tokens`

> Your React component is re-rendering on every scroll event because the scroll handler is calling `setState` (or something that updates state) on each event. When state updates, React schedules a re-render. The fix is to either throttle/debounce the scroll handler so it fires less often, or move the scroll-tracked value out of state when you don't actually need to render with it. Wrap the handler in `useCallback` so its identity is stable, and consider passing the value via a ref instead of state if it's only used for layout calculations.

</td>
<td>

#### 🎭 emoji-speak · `47 tokens` *(−57%)*

> 🤔 scroll handler → setState every event → 🔁 rerender storm.
>
> 🔧 `useCallback` + `throttle(16ms)`, or 📐 layout-only value via `useRef` (❌ state).

</td>
</tr>
<tr>
<td>

#### 🗣️ Normal Claude · `49 tokens`

> Yes — but make sure all tests pass first, then push to main. The CI pipeline should pick up the commit and trigger the deploy. Watch the CI dashboard while it runs. If anything fails, roll back via `git revert` and redeploy.

</td>
<td>

#### 🎭 emoji-speak · `18 tokens` *(−63%)*

> 🧪 ✅ ? → 🚀 `git push origin main` → 🏁

</td>
</tr>
</table>

**Same answer. Fewer tokens. Brain still big.** Token counts from `tiktoken o200k_base`. Pairs are illustrative — your real savings depend on the question shape (verbose explanations compress well, one-line answers can get longer). [Run the benchmark](#-numbers) on your own questions.

---

## ⚡ Install (30 seconds)

In a Claude Code session:

```
/plugin marketplace add sytungan/emoji-speak
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

## 🎬 Real outputs (verbatim from a live session)

Not curated examples — these are unedited replies Claude actually produced with emoji-speak active.

**`who are you?`**

> 👋 🤖 = Claude, 🏗️ Anthropic — `claude-opus-4-7` `1M` 🪟. 🎭 🟢. ⏭️ ❓ ?

**`summary about history of apple til now`**

> | 🗓️ | 🌟 |
> |---|---|
> | `1976-04-01` | 🏗️ in 🅿️ — `Steve Jobs` + `Steve Wozniak` + `Ronald Wayne`. `Apple I` 📜. |
> | `1984` | 🚀 `Macintosh` → 🖱️ GUI 👥. 📺 `1984` ad 🔥. |
> | `1997` | `Jobs` ⤴️ via `NeXT` 🛒. 🍎 ⏳ near 💀 → 🔄. |
> | `2001` | 🚀 `iPod` 🎵 + `iTunes` + 🥇 `Apple Store` 🏬. |
> | `2007-06` | 🚀 `iPhone` → 📱 era 💥. |
> | `2011-10-05` | `Steve Jobs` 💀. `Tim Cook` 🪑 CEO. |
> | `2018-08` | 🥇 `$1T` 📊 cap. |
> | `2020-11` | 🚀 `Apple Silicon` `M1` → 🧠 🍎-🏗️ → ⚡🔋. |
> | `2024-06` | 🚀 `Apple Intelligence` 🤖. |
>
> 🧠 ⏮️ = `2026-01` → ⏳ post → ❓.

Notice: dates, proper nouns (`Steve Jobs`, `Macintosh`, `iPhone`), version-like names (`M1`), and currency (`$1T`) all stay verbatim. Everything else becomes emoji.

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
