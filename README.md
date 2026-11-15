# jarvis-toggle

A Claude Code desktop mod: a glowing arc-reactor button above the prompt that turns spoken replies on or off. When on, the first sentence of each reply is spoken aloud with Piper, a free offline text-to-speech engine, in a British voice. When off, the button goes dark and nothing is spoken.

## Requirements

macOS, `uv`, and Piper with the `en_GB-alan-medium` voice. Run `scripts/setup.sh` once. It installs them into `~/piper-voice`. The voice files are about 63 MB.

## Install

At the prompt of a terminal session:

```
/plugin install jarvis-toggle --marketplace anuj1392/jarvis-toggle
```

In the desktop app, click + next to the prompt box, then Plugins, Add marketplace with `anuj1392/jarvis-toggle`, then Add plugin.

## Notes

The voice is a generic British Piper voice, not the film voice.
