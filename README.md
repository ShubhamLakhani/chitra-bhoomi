# Chitra Bhoomi Architects — website (v1)

Single-page studio site: Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 ·
GSAP + ScrollTrigger + SplitText · Lenis · three.js via React Three Fiber / Drei · Lucide.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start

# Production build beside a running dev server (separate output folder):
NEXT_DIST_DIR=.next-prod npx next build && NEXT_DIST_DIR=.next-prod npx next start -p 3200
```

## Where to edit things

| What | Where |
| --- | --- |
| All copy, projects, services, process, contact details | `src/content/site.ts` |
| Photographs | `public/images/` — see `public/images/README.md` for file names |
| Verified testimonials | `testimonials` array in `src/content/site.ts` |
| Enquiry form endpoint | `NEXT_PUBLIC_ENQUIRY_ENDPOINT` env var (see below) |
| Site URL for canonical/SEO | `NEXT_PUBLIC_SITE_URL` env var |
| Colours, type, spacing tokens | `src/app/globals.css` (`@theme`) |
| 3D study model | `src/components/motion/HouseCanvas.tsx` |

Copy marked **PROPOSED** in `site.ts` is draft website copy, not verified
information about the firm. Review it with the owner before launch.

## Photographs and drawing placeholders

No project photography was supplied, so every image slot currently renders an
original architectural drawing (`src/components/ArchPlate.tsx`) labelled
"photograph to follow". Drop a correctly named file into `public/images/` and
the photo replaces the drawing automatically on the next build or dev reload.

## Enquiry form

The form validates input on the client. **It does not send anything until an
endpoint is configured.** Until then, a valid submission tells the visitor the
form is not connected yet and offers the phone number.

To connect it, create `.env.local` with a JSON-accepting form service URL
(for example Formspree or Web3Forms):

```
NEXT_PUBLIC_ENQUIRY_ENDPOINT=https://formspree.io/f/xxxxxxx
```

## Architecture in Motion (3D)

The section is a 560vh scroll track with a 100svh sticky stage. That length is
the scroll distance for the five stages; it is not empty space. Full-page
screenshot tools paint the sticky stage once and show the rest of the track as
plain background, so the section looks hollow in those captures only. Stage
timing lives in `KEYS` and the `windowed(...)` calls in `HouseCanvas.tsx`, with
caption timing in `CHAPTER_STARTS` in `HouseSection.tsx`. Keep them in step.

- Loaded lazily (dynamic import) when the visitor is ~1.5 screens away, with a
  drawing poster underneath while it loads. It never blocks the rest of the page.
- Rendering pauses when the section is off-screen.
- Lower resolution and a smaller shadow map on phones, touch devices and ≤4-core CPUs.
- Static fallback (drawings + chapter list) for `prefers-reduced-motion`,
  Save-Data, very low-memory devices, or no WebGL.

## Accessibility & motion

- Reveal animations and smooth scrolling are disabled under reduced motion; content
  is fully visible without JavaScript.
- Skip link, keyboard-operable menu (focus trap, Escape), native `<dialog>` for
  projects, labelled form fields with inline errors.
