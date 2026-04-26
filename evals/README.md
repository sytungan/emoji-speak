# emoji-speak evals

Measures real Claude output token counts under three system-prompt conditions:

| Arm | System prompt |
|-----|--------------|
| `baseline` | none |
| `terse` | `Answer concisely.` |
| `emoji_speak` | `Answer concisely.` + the body of `skills/emoji-speak/SKILL.md` |

Two deltas are reported, both honest:

- `emoji_speak` vs `baseline` — the realistic comparison for users running
  Claude with no system prompt. Headlines the report.
- `emoji_speak` vs `terse` — apples-to-apples (both told to be concise),
  isolates the emoji style itself.

## Re-run

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python llm_run.py     # writes snapshots/results.json (~30 `claude -p` calls)
python measure.py     # writes snapshots/benchmark.md and prints the report
```

Re-running spends real API tokens. The committed `snapshots/results.json`
makes runs deterministic — `measure.py` against the existing snapshot is free.

## Files

- `prompts.txt` — fixed prompts, one per line.
- `llm_run.py` — spawns `claude -p --system-prompt` per (prompt, arm).
- `measure.py` — counts tokens with `tiktoken o200k_base`, writes report.
- `snapshots/results.json` — raw outputs (committed).
- `snapshots/benchmark.md` — human-readable report (embedded in root README).
