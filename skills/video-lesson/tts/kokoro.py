"""Default narrator: Kokoro-82M (Apache 2.0), local, no account.

usage: python kokoro.py <lesson-dir> [voice]
reads <lesson-dir>/script.json, writes <lesson-dir>/voice.wav (the raw narration, one take).
Voice defaults by language: pt → pm_alex, en → am_michael. List: https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md
"""
import json, sys
from pathlib import Path
import numpy as np, soundfile as sf
from kokoro import KPipeline

LANG = {"pt": "p", "en": "a", "es": "e", "fr": "f", "it": "i", "ja": "j", "zh": "z", "hi": "h"}
VOICE = {"pt": "pm_alex", "en": "am_michael"}

d = Path(sys.argv[1]).resolve()
spec = json.loads((d / "script.json").read_text())
lang = spec.get("lang", "en")
voice = sys.argv[2] if len(sys.argv) > 2 and sys.argv[2] else VOICE.get(lang, "am_michael")
pipe = KPipeline(lang_code=LANG[lang], repo_id="hexgrad/Kokoro-82M")
# the whole script in one pass keeps intonation continuous; one line per paragraph
text = "\n".join(l["text"] for l in spec["lines"])
audio = np.concatenate([r.audio.numpy() for r in pipe(text, voice=voice, split_pattern=r"\n+")])
sf.write(d / "voice.wav", audio, 24000)
print(f"ok: voice.wav {len(audio) / 24000:.1f}s ({voice})")
