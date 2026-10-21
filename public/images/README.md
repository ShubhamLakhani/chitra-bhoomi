# Photographs

Drop photographs here using the exact file names below. The site checks for
each file when it builds; if a file exists it is shown, otherwise a drawing
placeholder is rendered. No code changes are needed.

| Slot | File | Suggested shape |
| --- | --- | --- |
| Hero (strongest exterior, ideally dusk) | `hero.jpg` | landscape or square, ≥ 2400 px wide |
| Contemporary Residence — cover | `work/contemporary-residence-01.jpg` | landscape 4:3 |
| Contemporary Residence — detail | `work/contemporary-residence-02.jpg` | any |
| Refined Living Spaces — cover | `work/refined-living-01.jpg` | portrait 3:4 |
| Modern Residential Architecture — cover | `work/modern-residential-01.jpg` | portrait 4:5 |
| Contemporary Interiors — cover | `work/contemporary-interiors-01.jpg` | landscape 16:10 |

To add more images to a project, add entries to its `gallery` list in
`src/content/site.ts`. Use JPG at around 2400 px on the long edge; Next.js
generates the smaller responsive versions automatically.
