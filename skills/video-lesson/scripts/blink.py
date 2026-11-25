"""Blink detector: finds frames where something vanishes or appears for 1–2 frames.
usage: python blink.py video.mp4 → suspicious times (s)
Blink = frame n differs from n-1 AND n+k, while n-1 ≈ n+k (k=1..2)."""
import subprocess, sys, numpy as np
W, H = 192, 108
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", sys.argv[1], "-vf", f"scale={W}:{H},format=gray", "-f", "rawvideo", "-"], capture_output=True).stdout
f = np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32)
fps = float(subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v", "-show_entries", "stream=r_frame_rate", "-of", "csv=p=0", sys.argv[1]], capture_output=True, text=True).stdout.strip().split('/')[0]) / \
      float(subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v", "-show_entries", "stream=r_frame_rate", "-of", "csv=p=0", sys.argv[1]], capture_output=True, text=True).stdout.strip().split('/')[1])
d = lambda a, b: np.abs(f[a] - f[b]).max(axis=None) if False else np.mean(np.abs(f[a] - f[b]) > 6)
hits = []
for n in range(1, len(f) - 3):
    for k in (1, 2):
        if d(n, n - 1) > 0.0015 and d(n, n + k) > 0.0015 and d(n - 1, n + k) < 0.3 * d(n, n - 1):
            hits.append(round(n / fps, 2)); break
out = []
for h in hits:
    if not out or h - out[-1] > 0.2: out.append(h)
print("blinks:", out if out else "none")
sys.exit(1 if out else 0)
