# sourced by render.sh / review.sh: builds an isolated engine copy for one lesson in $E
S="$(cd "$(dirname "$0")/.." && pwd)"; L="$(cd "$1" && pwd)"; slug="$(basename "$L")"
PY="${VIDEO_LESSON_VENV:-$HOME/.cache/video-lesson/venv}/bin/python"
E="${TMPDIR:-/tmp}/video-lesson-$slug"; rm -rf "$E"; mkdir -p "$E"
cp -R "$S/engine/src" "$S/engine/public" "$S/engine/package.json" "$S/engine/tsconfig.json" "$E/"; ln -s "$S/engine/node_modules" "$E/node_modules"
mkdir -p "$E/src/eps"
cp "$L/scenes.tsx" "$E/src/eps/current.tsx"; cp "$L/anchors.json" "$E/src/eps/current.anchors.json"; cp "$L/words.json" "$E/src/eps/current.words.json"
cp "$L/audio.mp3" "$E/public/current.mp3"
cd "$E"
# a free port: Remotion's default 3000 is often taken by a dev server, which makes it load the wrong page
PORT="$("$PY" -I -c 'import socket; s=socket.socket(); s.bind(("",0)); print(s.getsockname()[1])')"
