---
name: video-lesson
description: Explain any concept or source as a narrated, animated ~4 min video.
disable-model-invocation: true
argument-hint: "<concept, link, file or lesson slug> [--tts kokoro] [--voice pm_alex]"
---

A **video lesson** is one continuous animated scene, synced word by word to one narrator, that explains one concept. The **source** can be anything: a topic, a link, a PDF, code, notes, or a `lesson.html` from the `lesson` skill. Everything is written to `./lessons/<slug>/` (an existing lesson keeps its folder). Scripts live in this skill's folder (`scripts/`, `tts/`); first run needs `scripts/setup.sh`.

## Steps

1. **Script** → `script.json`. Read the source. A bare topic, or a source too thin to explain from, means research first: 1–3 primary sources (official docs, the paper, the creator's post), every claim traced to one. One concept per video; if the source holds several, name the one you are filming. Then write a new text **for the ear**:
   ```json
   {"title": "...", "sub": "...", "lang": "pt", "lines": [{"id": "a1", "text": "One short sentence.", "concept": true}]}
   ```
   - Climb the ladder (real scenario → what breaks → concrete example step by step → why → only then the name → the fix, saying which part of the problem each fix removes), retold as speech.
   - One sentence per line, short (fragments are fine: "And it obeys."). `"concept": true` on the line that closes a concept adds a 1.2 s pause after it. Target rhythm ~154 words/min with pauses: a dense, breathless script sounds rushed even read slowly.
   - Compare with `example/durable-objects/script.json`, the approved bar.
   - Depth, not a timer: every idea gets one concrete example with names and values. ~3,500 characters ≈ 4 min; measure before generating audio.
   - End on a one-line summary.
   Done when the character count is in range and every idea has its example.

2. **Voice** → `scripts/voice.sh lessons/<slug> [--tts <name>] [--voice <name>]`. Runs the narrator (`tts/<name>.py`, default `kokoro`), then `scripts/align.py` (faster-whisper) for word times. Done when it prints `ok` with ≥ 90% of words heard.

3. **Scene** → `scenes.tsx`. First read `example/durable-objects/scenes.tsx` whole to calibrate how much happens on screen, how the drawing is composed and how objects morph; take the bar, not its subject or positions. Then copy `template/scenes.tsx` and build the animation by every rule in [`STYLE.md`](STYLE.md). Pieces are in `engine/src/kit.tsx` and `engine/src/ds.tsx`. Every time comes from speech: `at('phrase')`, never a fixed second.

4. **Review** → `scripts/review.sh lessons/<slug>`, as many rounds as it takes. Done when it exits 0 **and** you have written one line per item of the STYLE.md checklist naming the strip you checked it on. Fix and rerun on any miss.

5. **Render** → `scripts/render.sh lessons/<slug>` → `video.mp4` + `poster.jpg`.

6. **Present** → `video.html`, a **theater** page: the video large on the left with its own player, the essentials on the right. Write `page.json` (format at the top of `scripts/page.py`: summary, 4–6 chapters and 4–8 concepts each pinned to an exact narration phrase, 3 questions that make the viewer apply the concept to a new case), then run `python3 scripts/page.py lessons/<slug>`. It builds `video.html` from `template/video.html`, and links it from `lesson.html` when one exists. Open `video.html`. Done when it plays with chapters and concept stars in place; reply with what the video covers, in a few lines.

## Requirements and pitfalls

- Needs python3.10+, node 18+ and ffmpeg on the PATH. `scripts/setup.sh` installs `kokoro`, `faster-whisper`, `soundfile` and `numpy` into a venv and runs `npm install` in `engine/`: ask the user before running it the first time.
- The scripts are bash and expect a POSIX venv (`$VENV/bin/python`). On Windows, run them inside WSL; Git Bash fails because the venv there uses `Scripts\python.exe`.
- Call the scripts with `bash scripts/<name>.sh` if the copy lost the executable bit.
- Remotion (the engine) is free for individuals and companies up to 3 people; larger companies need a Remotion company license.

## Origin

Copy of https://github.com/YudiG12/ganeko-skills (`skills/beta/video-lesson`, commit `9b566b7`, MIT, Yudi Ganeko). Fonts in `engine/public/` are M PLUS (SIL OFL, see `OFL.txt`). Added: this section and "Requirements and pitfalls"; trailing spaces removed from `OFL.txt` and `scripts/blink.py`.
