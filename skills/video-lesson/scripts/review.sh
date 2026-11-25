#!/usr/bin/env bash
# usage: review.sh <lesson-dir> — must exit 0 before render.
# Fails on type errors, text overflowing a box, or blinks. Also lists still stretches >1 s and writes frame strips to review/.
set -e
source "$(dirname "$0")/stage.sh" "$1"
R="$L/review"; rm -rf "$R"; mkdir -p "$R"; fail=0
if npx tsc --noEmit -p . 2>&1 | grep -v node_modules | grep error; then echo "✗ type error"; exit 1; fi
npx remotion render src/index.ts Stage "$R/preview.mp4" --scale=0.4 --gl=angle --port="$PORT" --log=verbose --muted > "$R/render.log" 2>&1 || true
[ -s "$R/preview.mp4" ] || { tail -20 "$R/render.log"; echo "✗ preview did not render (full log: $R/render.log)"; exit 1; }
grep -o "OVERFLOW t=[0-9.]* caixa=[^ ]* excesso=[0-9]*px" "$R/render.log" | sort -t= -k2 -n > "$R/overflow.txt" || true
echo "── text overflowing a box:"
if [ -s "$R/overflow.txt" ]; then head -5 "$R/overflow.txt"; fail=1; else echo "  none"; fi
echo "── blinks:"; "$PY" "$S/scripts/blink.py" "$R/preview.mp4" || fail=1
echo "── still stretches (>1 s):"
ffmpeg -hide_banner -i "$R/preview.mp4" -vf "freezedetect=n=-70dB:d=1.0" -an -f null - 2>&1 | grep -oE "freeze_(start|end): [0-9.]+" | paste - - || true
ffmpeg -v error -i "$R/preview.mp4" -vf "fps=2,scale=384:-1,tile=6x5" "$R/strip-%02d.png"
echo "── strips: $R/strip-*.png (15 s each)"
[ $fail = 1 ] && { echo "✗ REVIEW FAILED"; exit 1; }
echo "✓ automatic checks ok — now read every strip against the STYLE.md checklist"
