#!/usr/bin/env python3
"""Count output tokens per arm and write a markdown report.

Reports two deltas:
- emoji_speak vs baseline (no system prompt) — realistic user comparison.
- emoji_speak vs terse ("Answer concisely.") — apples-to-apples.

Re-runs against an existing snapshot are free (no API calls).
"""

from __future__ import annotations

import json
import statistics
import sys
from pathlib import Path

import tiktoken

EVAL_DIR = Path(__file__).resolve().parent
RESULTS = EVAL_DIR / "snapshots" / "results.json"
REPORT = EVAL_DIR / "snapshots" / "benchmark.md"

ENC = tiktoken.get_encoding("o200k_base")


def count(text: str) -> int:
    return len(ENC.encode(text))


def pct(a: float, b: float) -> float:
    return round((a - b) / b * 100, 1) if b else 0.0


def fmt_pct(p: float) -> str:
    sign = "+" if p > 0 else ""
    return f"{sign}{p}%"


def main() -> int:
    data = json.loads(RESULTS.read_text())
    arms = data["arms"]
    by_arm: dict[str, list[int]] = {a: [] for a in arms}
    for run in data["runs"]:
        by_arm[run["arm"]].append(count(run["stdout"]))

    def stat(xs: list[int]) -> dict:
        return {
            "n": len(xs),
            "mean": round(statistics.mean(xs), 1),
            "median": int(statistics.median(xs)),
            "min": min(xs),
            "max": max(xs),
            "stdev": round(statistics.stdev(xs), 1) if len(xs) > 1 else 0.0,
        }

    rows = {arm: stat(by_arm[arm]) for arm in arms}
    delta_vs_baseline = pct(rows["emoji_speak"]["mean"], rows["baseline"]["mean"])
    delta_vs_terse = pct(rows["emoji_speak"]["mean"], rows["terse"]["mean"])

    if delta_vs_baseline < 0:
        headline = f"**Saves {abs(delta_vs_baseline)}% output tokens vs unprompted Claude** (mean, {rows['baseline']['n']} dev questions)."
    else:
        headline = f"Costs **{fmt_pct(delta_vs_baseline)}** output tokens vs unprompted Claude (mean, {rows['baseline']['n']} dev questions)."

    per_prompt: list[tuple[str, int, int, int, float]] = []
    for prompt in data["prompts"]:
        bl = next(r for r in data["runs"] if r["arm"] == "baseline" and r["prompt"] == prompt)
        ts = next(r for r in data["runs"] if r["arm"] == "terse" and r["prompt"] == prompt)
        em = next(r for r in data["runs"] if r["arm"] == "emoji_speak" and r["prompt"] == prompt)
        bl_t, ts_t, em_t = count(bl["stdout"]), count(ts["stdout"]), count(em["stdout"])
        per_prompt.append((prompt, bl_t, ts_t, em_t, pct(em_t, bl_t)))
    per_prompt.sort(key=lambda r: r[4])

    lines = [
        "# emoji-speak benchmark",
        "",
        headline,
        "",
        f"Output tokens per reply, counted with `tiktoken o200k_base`. {rows['baseline']['n']} prompts per arm.",
        "",
        "## Aggregate",
        "",
        "| Arm | Mean | Median | Min | Max | Stdev |",
        "|-----|------|--------|-----|-----|-------|",
    ]
    for arm in arms:
        r = rows[arm]
        lines.append(f"| `{arm}` | {r['mean']} | {r['median']} | {r['min']} | {r['max']} | {r['stdev']} |")

    lines += [
        "",
        "**Two deltas, both honest:**",
        "",
        f"- `emoji_speak` vs `baseline` (no system prompt — what most casual users have): **{fmt_pct(delta_vs_baseline)}** output tokens. Realistic user-facing comparison.",
        f"- `emoji_speak` vs `terse` (`Answer concisely.` — apples-to-apples): **{fmt_pct(delta_vs_terse)}** output tokens. Isolates the emoji style from the generic concision ask.",
        "",
        "## Per-prompt (sorted: biggest savings first)",
        "",
        "| Prompt | baseline | terse | emoji_speak | Δ vs baseline |",
        "|--------|----------|-------|-------------|---------------|",
    ]
    for prompt, bl_t, ts_t, em_t, d in per_prompt:
        short = (prompt[:60] + "…") if len(prompt) > 60 else prompt
        lines.append(f"| {short} | {bl_t} | {ts_t} | {em_t} | {fmt_pct(d)} |")

    lines += [
        "",
        "Run with `python llm_run.py && python measure.py`.",
    ]

    report = "\n".join(lines) + "\n"
    REPORT.write_text(report)
    sys.stdout.write(report)
    return 0


if __name__ == "__main__":
    sys.exit(main())
