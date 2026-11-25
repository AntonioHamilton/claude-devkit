#!/usr/bin/env bash
# One-time setup: Python env for narration + alignment, Node deps for the Remotion engine. Needs python3.10+, node 18+, ffmpeg.
set -e
S="$(cd "$(dirname "$0")/.." && pwd)"; PY="${VIDEO_LESSON_VENV:-$HOME/.cache/video-lesson/venv}"
[ -x "$PY/bin/python" ] || python3 -m venv "$PY"
"$PY/bin/python" -m pip --version >/dev/null 2>&1 || "$PY/bin/python" -m ensurepip >/dev/null
"$PY/bin/python" -m pip install -q kokoro faster-whisper soundfile numpy
(cd "$S/engine" && npm install --silent)
echo "ok: python at $PY, engine deps installed"
