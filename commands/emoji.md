---
description: Turn emoji-speak mode on or off (and persist as the default for future sessions).
---

The user invoked `/emoji-speak:emoji` with arguments: $ARGUMENTS

Parse the argument:

- `on` → switch to emoji-speak mode starting with this response.
- `off` (or no argument) → switch to normal English mode starting with this response.

Then run **one** of the following shell commands (using the Bash tool) to persist the choice so the next SessionStart hook honors it:

For **on**:
```bash
mkdir -p "${XDG_CONFIG_HOME:-$HOME/.config}/emoji-speak" && \
  printf '{"defaultMode":"on"}\n' > "${XDG_CONFIG_HOME:-$HOME/.config}/emoji-speak/config.json"
```

For **off**:
```bash
mkdir -p "${XDG_CONFIG_HOME:-$HOME/.config}/emoji-speak" && \
  printf '{"defaultMode":"off"}\n' > "${XDG_CONFIG_HOME:-$HOME/.config}/emoji-speak/config.json"
```

After running the command, acknowledge the mode change.

- If switching to **on**, the acknowledgement and all subsequent prose must be in 100% emoji per the emoji-speak SKILL (preserve code, paths, URLs, commands, and errors verbatim).
- If switching to **off**, the acknowledgement is plain English: `emoji-speak off.`
