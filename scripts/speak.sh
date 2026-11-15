#!/bin/zsh
# usage: speak.sh "text"
cd ~/piper-voice || exit 1
printf '%s' "$1" | .venv/bin/python -m piper -m en_GB-alan-medium -f /tmp/piper-out.wav >/dev/null 2>&1 && afplay /tmp/piper-out.wav
