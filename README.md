# jarvis-toggle

<img src="assets/icon.png" alt="Glowing cyan arc-reactor icon" width="120" align="right">

A Claude Code desktop mod: a glowing arc-reactor button above the prompt that turns spoken replies on or off. When on, the button glows cyan and the first sentence of each reply is spoken aloud with [Piper](https://pypi.org/project/piper-tts/), a free offline text-to-speech engine, in a British voice. When off, the button goes dark and nothing is spoken.

## Requirements

- **macOS only.** The mod plays audio with `afplay` and runs `zsh`.
- The Claude Code desktop app.
- [`uv`](https://docs.astral.sh/uv/) for the one-time Piper setup.

## Setup

Run once. It installs Piper and the British `en_GB-alan-medium` voice (about 63 MB) into `~/piper-voice`:

```
git clone https://github.com/anuj1392/jarvis-toggle && ./jarvis-toggle/scripts/setup.sh
```

## Install

At the prompt of a terminal session:

```
/plugin install jarvis-toggle --marketplace anuj1392/jarvis-toggle
```

From a shell:

```
claude plugin install jarvis-toggle --marketplace anuj1392/jarvis-toggle
```

In the desktop app, click + next to the prompt box, then Plugins, Add marketplace with `anuj1392/jarvis-toggle`, then Add plugin.

## Use

Press the button above the prompt to toggle. Off also stops any speech already playing. The first sentence of each reply is spoken as it streams in.

## Notes

- The voice is a generic British Piper voice. It is not the voice from any film, and this project is not affiliated with Marvel.
- Voice models have their own licenses. This repo does not include or redistribute any: `scripts/setup.sh` downloads `en_GB-alan-medium` from the Piper voices repository. Check that voice's license before use.
- Nothing leaves your machine: synthesis and playback are local.

## License

MIT, for this repository's code.
