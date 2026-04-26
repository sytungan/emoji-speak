#!/usr/bin/env python3
"""Run each prompt through `claude -p` for each system-prompt arm and snapshot results."""

from __future__ import annotations

import json
import re
import subprocess
import sys
import time
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
EVAL_DIR = REPO / "evals"
SKILL_PATH = REPO / "skills" / "emoji-speak" / "SKILL.md"
PROMPTS_PATH = EVAL_DIR / "prompts.txt"
SNAPSHOT_DIR = EVAL_DIR / "snapshots"
RESULTS_PATH = SNAPSHOT_DIR / "results.json"

TERSE = "Answer concisely."


def skill_body() -> str:
    raw = SKILL_PATH.read_text(encoding="utf-8")
    return re.sub(r"^---[\s\S]*?---\s*", "", raw, count=1)


def arms() -> dict[str, str | None]:
    return {
        "baseline": None,
        "terse": TERSE,
        "emoji_speak": f"{TERSE}\n\n{skill_body()}",
    }


def run_one(prompt: str, system_prompt: str | None) -> dict:
    cmd = ["claude", "-p"]
    if system_prompt is not None:
        cmd += ["--system-prompt", system_prompt]
    cmd += [prompt]
    started = time.time()
    proc = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
    elapsed = time.time() - started
    return {
        "stdout": proc.stdout,
        "stderr": proc.stderr,
        "returncode": proc.returncode,
        "elapsed_s": round(elapsed, 2),
    }


def main() -> int:
    prompts = [line.strip() for line in PROMPTS_PATH.read_text().splitlines() if line.strip()]
    SNAPSHOT_DIR.mkdir(parents=True, exist_ok=True)
    arm_prompts = arms()
    results = {"prompts": prompts, "arms": list(arm_prompts.keys()), "runs": []}
    total = len(prompts) * len(arm_prompts)
    n = 0
    for prompt in prompts:
        for arm_name, sys_prompt in arm_prompts.items():
            n += 1
            print(f"[{n}/{total}] {arm_name}: {prompt[:60]}...", file=sys.stderr)
            run = run_one(prompt, sys_prompt)
            run.update({"prompt": prompt, "arm": arm_name})
            results["runs"].append(run)
    RESULTS_PATH.write_text(json.dumps(results, indent=2))
    print(f"wrote {RESULTS_PATH}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
