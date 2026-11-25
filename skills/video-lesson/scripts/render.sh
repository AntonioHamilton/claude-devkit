#!/usr/bin/env bash
# usage: render.sh <lesson-dir> → <lesson-dir>/video.mp4 and poster.jpg
set -e
source "$(dirname "$0")/stage.sh" "$1"
npx remotion render src/index.ts Stage "$L/video.mp4" --gl=angle --port="$PORT" --log=error
npx remotion still src/index.ts Poster "$L/poster.png" --gl=angle --port="$PORT" --log=error >/dev/null
ffmpeg -y -loglevel error -i "$L/poster.png" -q:v 4 "$L/poster.jpg" && rm "$L/poster.png"
echo "ok: $L/video.mp4"
