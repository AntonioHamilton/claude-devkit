# Super README style

The tokens and the drawing language come from [`../lesson/STYLE.md`](../lesson/STYLE.md): a clean technical document, navy ink, sand as the one warm highlight. This file adapts them to what GitHub renders inside a README.

## What GitHub allows

- Markdown, Mermaid blocks and images by relative path. CSS, JS and HTML `style` attributes are stripped.
- An SVG in a README is served as an image: scripts, `<foreignObject>`, web fonts and external links inside it do not work.
- The README is seen in light and dark themes. Each SVG therefore paints its own white card (see SVG), and Mermaid keeps GitHub's theme.

## Files

- Images in `docs/readme/`: `map.svg`, `<feature-slug>.svg` or `.png`.
- Image alt text says what the picture shows ("Map: the CLI between the user and the Godot project").
- PNG screenshots at most 1600 px wide, cropped to what the feature shows.

## SVG

- `viewBox` only, no fixed `width`/`height`. Drawn at 880 px wide, height as needed.
- Card: first element `<rect width="100%" height="100%" rx="4" fill="#FFFFFF" stroke="#E3E8ED"/>`. It reads on both themes.
- Fonts: `font-family="-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif"`; code and values `ui-monospace, SFMono-Regular, Consolas, monospace`. Text at least 13 px; box labels 15 px, weight 500.
- Boxes: radius 4, 1 px border `#CBD3DB`, fill `#F5F7F9`, label inside, centred, starting with a capital. The highlighted piece (the project on the map, the feature in its block) uses sand: fill `#FCFAF7`, border `#E6D5C1`, text `#5B4630`.
- Arrows never cross a box. Blue `#3767A8` = request or data going out, sand `#C9A96E` = result coming back, red `#B83A31` = error or attack. The same meaning in every image.
- Real logos (Simple Icons path inline, brand colour) when a box is a product; otherwise a small Lucide icon or none.
- Ink: strong `#1B2632`, body `#263444`, muted `#4A5D72`.

## Mermaid

- `flowchart LR` for a flow, `flowchart TD` for a hierarchy (organogram). 4-9 nodes; above that, split into two diagrams.
- No `%%{init}%%` theme: GitHub picks light or dark. The only colour is the highlight: `classDef focus fill:#FCFAF7,stroke:#E6D5C1,color:#5B4630` applied to the node of the project or feature.
- Real names from the code in nodes and messages (`POST /notes`, `RepoWriter`), not "Service A".
- Mermaid for what changes with the code (architecture, flows), because it is text and updates in a diff. SVG for the map and for ideas that need a composed drawing.

## Text

- Conclusion first, short sentences, active voice. Concrete names, numbers and commands instead of adjectives.
- Text only where the picture cannot say it: no caption repeating the diagram.
- No badge wall, no emoji, no marketing ("blazing fast", "powerful"). Bold sparingly.
- Headings in sentence case. Code, commands and paths in backticks.
