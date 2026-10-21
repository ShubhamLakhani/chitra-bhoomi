# Images

Each image slot in `src/content/site.ts` points at a file here. If the file
exists at build time it is shown; otherwise a drawing placeholder is rendered.

Files are web copies (sRGB JPEG, long edge ≤ 3200 px) exported from the
studio's originals; the originals are never edited. Next.js serves AVIF/WebP
variants at the right size automatically. Source references (CB-xxx) are kept
in the private review folder, not in this repository, because the source
paths contain client names.

| Slot | File | Type |
| --- | --- | --- |
| Hero; Contemporary Residence (gallery) | `hero-contemporary-residence.jpg` | Visualisation |
| Contemporary Residence — cover | `work/contemporary-residence-view-02.jpg` | Visualisation |
| Contemporary Residence — gallery | `work/contemporary-residence-view-03.jpg` | Visualisation |
| Apartment Balcony & Bath — cover | `work/apartment-balcony-bath-shower-room.jpg` | Visualisation |
| Apartment Balcony & Bath — gallery | `work/apartment-balcony-bath-balcony.jpg` | Visualisation |
| Refined Living Spaces — cover | `work/refined-living-spaces-living-room.jpg` | Visualisation |
| Contemporary Interiors — cover | `work/contemporary-interiors-bedroom.jpg` | Visualisation |
| Apartment Living & Dining — cover | `work/apartment-living-dining-living-room.jpg` | Visualisation |
| Apartment Living & Dining — gallery | `work/apartment-living-dining-kitchen-dining.jpg` | Visualisation |
| Studio section (pending approval) | `studio.jpg` | — |

Mark renders with `kind: "visualisation"` so the site labels them; use
`kind: "photograph"` only for real photographs of built work.

When an image is replaced, give the new file a new name: optimised images
and browser/CDN caches are keyed by URL, so reusing a name can show the old
image.
