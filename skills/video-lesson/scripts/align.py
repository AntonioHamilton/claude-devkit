"""Forced alignment: gives every script word its time in voice.wav, whatever narrator made it.

usage: python align.py <lesson-dir>
in:  script.json, voice.wav
out: audio.mp3 (narration with concept pauses), anchors.json (start of each line + "end"), words.json (time of each word)

1. faster-whisper transcribes voice.wav with word timestamps.
2. Script words are matched to heard words in order (difflib); unmatched words get interpolated times.
3. After each line with "concept": true, the silence that already exists is stretched to ~1.2 s by inserting
   silence in the MIDDLE of the gap (12 ms fades). Never cuts on voice.
"""
import difflib, json, re, subprocess, sys, unicodedata
from pathlib import Path
import numpy as np, soundfile as sf
from faster_whisper import WhisperModel

TARGET, SR, LEAD, TAIL = 1.2, 24000, 0.4, 1.0
d = Path(sys.argv[1]).resolve()
spec = json.loads((d / "script.json").read_text())
lines = spec["lines"]
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(d / "voice.wav"), "-ac", "1", "-ar", str(SR), "-f", "f32le", str(d / "voice.f32")], check=True)
a = np.fromfile(d / "voice.f32", dtype=np.float32); (d / "voice.f32").unlink()
a16 = np.interp(np.arange(0, len(a), SR / 16000), np.arange(len(a)), a).astype(np.float32)

norm = lambda s: re.sub(r"[^a-z0-9]", "", unicodedata.normalize("NFD", s.lower()))
heard = []
segs, _ = WhisperModel("small", compute_type="int8").transcribe(a16, language=spec.get("lang", "en"), word_timestamps=True)
for s in segs:
    heard += [(norm(w.word), w.start, w.end) for w in s.words if norm(w.word)]

script = [(m.group(0), i) for i, l in enumerate(lines) for m in re.finditer(r"\S+", l["text"])]
sm = difflib.SequenceMatcher(None, [norm(w) for w, _ in script], [h[0] for h in heard], autojunk=False)
st, en = [None] * len(script), [None] * len(script)
for blk in sm.get_matching_blocks():
    for k in range(blk.size):
        st[blk.a + k], en[blk.a + k] = heard[blk.b + k][1], heard[blk.b + k][2]
known = [i for i, v in enumerate(st) if v is not None]
if len(known) < 0.6 * len(script):
    sys.exit(f"alignment failed: only {len(known)}/{len(script)} words heard. Check the narrator and the script language.")
for arr in (st, en):
    xs = [i for i, v in enumerate(arr) if v is not None]
    for i in range(len(arr)):
        if arr[i] is None: arr[i] = float(np.interp(i, xs, [arr[x] for x in xs]))

first = {li: min(i for i, (_, l) in enumerate(script) if l == li) for li in range(len(lines))}
last = {li: max(i for i, (_, l) in enumerate(script) if l == li) for li in range(len(lines))}
fade = int(0.012 * SR); out, cur, shift, shifts = [], 0, 0.0, []
for li, ln in enumerate(lines):
    shifts.append(shift)
    if li < len(lines) - 1 and ln.get("concept"):
        g0, g1 = en[last[li]], st[first[li + 1]]
        add = max(0.0, TARGET - max(0.0, g1 - g0))
        if add > 0.02:
            mid = int((g0 + g1) / 2 * SR)
            seg = a[cur:mid].copy(); seg[-fade:] *= np.linspace(1, 0, min(fade, len(seg)))
            out += [seg, np.zeros(int(add * SR), np.float32)]; cur = mid
            a[cur:cur + fade] *= np.linspace(0, 1, len(a[cur:cur + fade])); shift += add
out.append(a[cur:])
y = np.concatenate([np.zeros(int(LEAD * SR), np.float32), *out, np.zeros(int(TAIL * SR), np.float32)])
sf.write(d / "audio.wav", y, SR)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(d / "audio.wav"), "-b:a", "160k", str(d / "audio.mp3")], check=True)
words = [{"w": w, "t": round(st[i] + shifts[l] + LEAD, 3), "line": lines[l]["id"]} for i, (w, l) in enumerate(script)]
anchors = {ln["id"]: words[first[li]]["t"] for li, ln in enumerate(lines)}; anchors["end"] = round(len(y) / SR, 3)
(d / "words.json").write_text(json.dumps(words, ensure_ascii=False, indent=0))
(d / "anchors.json").write_text(json.dumps(anchors, indent=1))
print(f"ok: {len(known)}/{len(script)} words heard, {anchors['end']:.1f}s, +{shift:.1f}s of concept pauses")
