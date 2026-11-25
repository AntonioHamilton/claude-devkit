"""Example of a paid narrator: ElevenLabs. Needs ELEVENLABS_API_KEY.

usage: python elevenlabs.py <lesson-dir> [voice_id]
reads <lesson-dir>/script.json, writes <lesson-dir>/voice.wav. Model: ELEVEN_MODEL (default eleven_v3).
Any narrator works the same way: read script.json, write voice.wav. Save it as tts/<name>.py and pass --tts <name>.
"""
import json, os, subprocess, sys, urllib.request
from pathlib import Path

d = Path(sys.argv[1]).resolve()
spec = json.loads((d / "script.json").read_text())
voice = sys.argv[2] if len(sys.argv) > 2 and sys.argv[2] else os.environ.get("ELEVEN_VOICE", "")
if not voice:
    sys.exit("pass a voice id: --voice <id> or ELEVEN_VOICE")
body = {"text": "\n\n".join(l["text"] for l in spec["lines"]), "model_id": os.environ.get("ELEVEN_MODEL", "eleven_v3"),
        "language_code": spec.get("lang", "en")}
req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format=mp3_44100_128", data=json.dumps(body).encode(),
                             headers={"xi-api-key": os.environ["ELEVENLABS_API_KEY"], "Content-Type": "application/json"})
(d / "voice.mp3").write_bytes(urllib.request.urlopen(req).read())
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(d / "voice.mp3"), "-ac", "1", str(d / "voice.wav")], check=True)
print("ok: voice.wav")
