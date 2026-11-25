#!/usr/bin/env bash
# usage: voice.sh <lesson-dir> [--tts kokoro] [--voice <name>]  → voice.wav, then audio.mp3 + words.json + anchors.json
set -e
S="$(cd "$(dirname "$0")/.." && pwd)"; PY="${VIDEO_LESSON_VENV:-$HOME/.cache/video-lesson/venv}/bin/python"
dir="$1"; shift; tts=kokoro; voice=""
while [ $# -gt 0 ]; do case "$1" in --tts) tts="$2"; shift 2;; --voice) voice="$2"; shift 2;; *) shift;; esac; done
[ -f "$S/tts/$tts.py" ] || { echo "no narrator tts/$tts.py"; exit 1; }
"$PY" -I "$S/tts/$tts.py" "$dir" "$voice"
"$PY" -I "$S/scripts/align.py" "$dir"
