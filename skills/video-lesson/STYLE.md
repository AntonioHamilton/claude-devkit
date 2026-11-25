# Video style

This is the author's style, shipped as the default. Edit it (and the tokens in `engine/src/ds.tsx`) to make videos look like yours. Every rule here came from a real mistake.

## Morph
There are no screens. Every object lives the whole video and **morphs**: it moves, grows, changes its label, merges into another, but is never swapped out. The next moment is born from the last one (agent → context board → "Private data" → Notes).
- One object = ONE rendered element the whole time, with continuous geometry across phases. "Until t<X draw A, then draw B" blinks for a frame; morph the content inside the same `<Box>` instead.
- Never fade as a transition. Text morphs by rolling letter by letter (`Roll`), logos by flipping (`LogoFlip`), boxes merge one at a time sliding under the target (which widens to receive them), wires retract (`undraw`), captions leave letter by letter (`Glyphs out`). Entrances may go blur → sharp.
- Object by object: each element with its own delay (~0.08–0.1 s), never the whole block at once.
- The screen is never still. While a connection exists, there is traffic on it; anything that spins spins at constant speed.
- An object that waits parks in a free corner, never on top of another. A new phase that needs space makes the previous object compact and move.
- Calm easing, no bounce. Highlights rise and fall as an envelope (`env`), never switch on/off. Focus by dimming the rest (`dim`), not by hiding it.
- What sits inside a box is rendered after the box in JSX, or the box paints over it.
- Now and then, a 3D moment earns its place (`Corridor`: walking past a row of items).

## Time
- Every time comes from speech: `const at = makeAt(WORDS)`; `at('private data')`, `at('delete', at('write'))` (2nd argument = search after). If the phrase isn't in the audio, `makeAt` throws: fix the phrase.
- Drawing happens on the word: the box appears when its name is said, the signal leaves when the action is said.

## Boxes and text
- Box content = flex children of the `<Box>` itself (icon + text centered together, fixed 18 px gap). Never position them from outside.
- Text never overflows. Size boxes by **measured** text: `w = 2*padding + icon + 18 + measure(text, size, weight, family)`, padding ~56 px. A `Roll` box needs room for both sides of the swap (`max` of old and new `rollW`) and height ≥ 3× font size. `Glyphs` enters 14 px low: leave that room.
- Order: content enters after the box finished growing and leaves before it shrinks. A box changing label AND size finishes widening first. A box born from ~0 shows content only above 98% size. Don't render bordered elements below 0.02 size (they still paint 3 px).
- Labels go INSIDE their box, start with a capital ("Agent", "Private data"); only code, emails and quotes stay as they are. `Roll` inside a box is centered.
- Text only when it adds. If the drawing shows it, don't write it. Captions 1–3 words. Never a caption that repeats the drawing, a context note, or a crossed-out alternative.
- Sizes: boxes 34–40 px, captions 48–52 px, titles 52–64 px. `*word*` in `Glyphs` = blue.
- A list being explained lights each item when it is said; a queue that empties collapses into its destination.

## Wires and signals
- A signal = the wire fills with colour from source to destination and drains into the destination (`Wire sigs`). No travelling dots.
- Blue = request/data going, sand = result coming back, red = attack/error. A result's label travels with its signal.
- The signal matches the audio: it leaves whoever acts, reaches whoever receives, and the destination lights up (`env`) on arrival. Wires never change colour on their own or stay lit.
- Round trips on one wire: ≥ 1.1 s between cycles. Long talk with nothing happening: background traffic, one signal every ~2.4 s.
- An arrow needs ≥ 90 px of body, or only its head shows.
- Wires leave from the middle of the edge facing the other object (`CWire`) and never cross a box or another wire; go around with an L (`LWire`). Inserting something into a path removes the old direct wire.

## Composition
- The screen is one **composed** drawing: centered and balanced around the middle of the stage. Every object sits where its role puts it (a flow reads left → right on one row, a hierarchy top → bottom, a group as one centered block). Nothing floats in a corner without a reason.
- When something joins or leaves, the whole group re-centers (`lay`), so the drawing stays balanced.
- ≥ 120 px from screen edges, ≥ 60 px between objects, nothing overlapping.
- Every box carries an icon (small Lucide) or the product's real logo next to its label. A text-only box is the exception.
- A concept's title sits with its drawing. A numbered title at the top for a sequence of fixes ("1. No way out" → "2. …"), via `Roll`.

## Teaching
- Abstract = visual. Code only when the subject is code; real data (a log) can appear as mono text.
- For fixes: repeat the same scenario and show where each one stops the problem. If the problem has parts, a small indicator shows only the part this example breaks; on the next one it comes back and another breaks. Never accumulate.
- Something coming from outside carries a visible origin mark ("External" in red).
- `Reveal` (screen darkens, big term) only for the central concept, 1–2 per video.

## Look
- Pure black background, sand `#C9A96E` accent, blue `#7FA7E8`, red `#E5736B`, greys `G.g1–g6` for hierarchy (all in `ds.tsx` / `kit.tsx`).
- Corners 4–6 px, never pills, thin borders. Glow only on the active highlight (`env`), never decorative.
- No AI look: no eyebrows, no underline under titles, no decorative glow, no verbose labels (a small icon instead).
- Real brand logos (`engine/src/logos.ts`, Simple Icons path + desaturated colour). Small Lucide icons inside boxes are fine.
- Sound effects only on impact (reveal, the moment of an attack/error), and only if you add your own files (`SFX_AVAILABLE` in `ds.tsx`).

## Checklist (every strip, before render)
1. Anything visible **before** its word?
2. A box empty for more than ~0.5 s waiting for its label?
3. Text touching/leaving a box, a cut label, objects < 60 px apart or from the edge?
4. A wire over a box or another wire? An old wire left behind something new?
5. Signals leaving/arriving at the right place, in the right colour, matching the speech?
6. A moment with only text and no drawing? Text the drawing already shows?
7. A lowercase label? A logo with no contrast?
8. A still stretch (> 1 s) with no meaningful motion?
9. A fade, or an object that vanishes and reappears instead of morphing?
10. If there is a parts indicator, is only the current example's part marked?
11. Is every frame a centered, balanced composition, with no object off in a corner without a reason?
12. Does every box carry an icon or a logo?
