#!/bin/zsh
# Installs Piper TTS and the British "Alan" voice into ~/piper-voice (macOS, Apple Silicon or Intel).
set -e
command -v uv >/dev/null || { echo "Install uv first: https://docs.astral.sh/uv/"; exit 1; }
mkdir -p ~/piper-voice && cd ~/piper-voice
uv venv --python 3.12 .venv
uv pip install --python .venv/bin/python piper-tts
.venv/bin/python -m piper.download_voices en_GB-alan-medium
cp "$(dirname "$0")/speak.sh" ~/piper-voice/speak.sh && chmod +x ~/piper-voice/speak.sh
~/piper-voice/speak.sh "Setup complete."
