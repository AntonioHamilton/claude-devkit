"""Theater page: builds <lesson-dir>/video.html from page.json + words.json, and links it from lesson.html.

usage: python page.py <lesson-dir>
page.json (written by the agent; "at" = an exact phrase of the narration, like at() in scenes.tsx):
  {"resumo": "1–2 sentences",
   "chapters": [{"at": "phrase", "label": "Chapter"}],             # 4–6, the first one starts at 0
   "concepts": [{"at": "phrase", "term": "Term", "def": "One line."}],  # 4–8
   "quiz": [{"q": "", "opts": ["", "", ""], "ok": 0, "why": ""}]}    # the lesson's Check questions
"""
import json, re, sys, unicodedata
from pathlib import Path

d = Path(sys.argv[1]).resolve()
S = Path(__file__).resolve().parent.parent
words = json.loads((d / "words.json").read_text())
end = json.loads((d / "anchors.json").read_text())["end"]
spec = json.loads((d / "script.json").read_text())
page = json.loads((d / "page.json").read_text())
norm = lambda s: re.sub(r"[^a-z0-9]", "", unicodedata.normalize("NFD", s.lower()))

def at(phrase):
    ps = [norm(p) for p in phrase.split() if norm(p)]
    for i in range(len(words)):
        if all(i + j < len(words) and norm(words[i + j]["w"]) == p for j, p in enumerate(ps)):
            return round(words[i]["t"], 1)
    sys.exit(f'phrase not found in the narration: "{phrase}"')

chapters = [{"t": 0 if i == 0 else at(c["at"]), "label": c["label"]} for i, c in enumerate(page["chapters"])]
concepts = sorted(({"t": at(c["at"]), "term": c["term"], "def": c["def"]} for c in page["concepts"]), key=lambda c: c["t"])
lesson = {"title": spec["title"], "sub": spec.get("sub", ""), "durS": end, "resumo": page["resumo"],
          "chapters": chapters, "concepts": concepts, "quiz": page["quiz"]}
html = (S / "template" / "video.html").read_text()
esc = lambda s: s.replace("&", "&amp;").replace("<", "&lt;")
html = html.replace("/*TITLE*/", esc(spec["title"])).replace("/*LESSON*/{}", json.dumps(lesson, ensure_ascii=False).replace("</", "<\\/"))
(d / "video.html").write_text(html)

# poster link right under the map of lesson.html (once)
lp = d / "lesson.html"
if lp.exists() and 'href="video.html"' not in (h := lp.read_text()):
    css = (".vid{position:relative;display:block;border:1px solid #E3E8ED;border-radius:4px;overflow:hidden;background:#000}"
           ".vid img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover}"
           ".vid span{position:absolute;left:12px;bottom:12px;background:#fff;color:#1B2632;font-weight:500;font-size:14px;padding:6px 10px;border-radius:4px}"
           "@media print{.vid{display:none}}</style>")
    link = '\n<a class="vid" href="video.html"><img src="poster.jpg" alt=""><span>▶ Video</span></a>\n'
    h = h.replace("</style>", css, 1)
    m = re.search(r"</header>\s*<figure.*?</figure>", h, re.S) or re.search(r"</header>", h)
    h = h[:m.end()] + link + h[m.end():] if m else h
    lp.write_text(h)
print(f"ok: {d / 'video.html'} ({len(chapters)} chapters, {len(concepts)} concepts)")
