# HOGS — Of Himalayan Homes

A single-page Himalayan stay experience built with **Next.js 15 App Router, TypeScript, Tailwind CSS, React Three Fiber / Drei, postprocessing, GSAP ScrollTrigger, Lenis, Framer Motion, React Hook Form, and Zod**. The persistent landscape uses real Manali elevation data and matching Copernicus Sentinel satellite imagery, with lightweight atmospheric effects.

## Run locally

Node.js 22 or newer is recommended.

```sh
npm install
npm run dev
```

Open `http://localhost:3000`. If that port is occupied, use `npm run dev -- --port 3001`. The development preview uses port **3000**.

```sh
npm run typecheck
npm test
npm run build
npm start
```

## Booking email

Copy `.env.example` to `.env.local`. Set `NEXT_PUBLIC_SITE_URL` to the exact origin serving the website, including the local port during development. Set `RESEND_API_KEY`, `BOOKING_FROM_EMAIL` (a sender on your verified Resend domain), and `BOOKING_EMAIL` (legacy `BOOKING_TO_EMAIL` is also supported).

The route at `app/api/booking/route.ts` validates every field again on the server, rejects cross-origin browser submissions, bounds request size, and uses a honeypot. It sends a plain-text email to avoid user-supplied HTML. It returns an honest unavailable state when email credentials are missing; it never simulates success. No enquiry is stored in a database. The WhatsApp option validates the same details and prepares a message for the visitor to review and send. An enquiry is **not** a confirmed reservation.

Use your hosting provider’s persistent rate limiting / bot protection before launching a public booking endpoint. A memory-only limiter would not reliably protect a serverless deployment, so one is deliberately not presented as production protection here. Configure Resend account quotas and domain verification, and test actual delivery with credentials before launch.

## Editing content and photographs

`lib/content.ts` is the central marketing copy, property data, image path, contact, and policy-link configuration. UI validation and delivery messages are in `lib/booking.ts`, the form component, and the API route. Prices, room counts, and unconfirmed amenities are intentionally absent. Feature copy needs owner confirmation.

HOGS Panorama photography lives in `source-images/` (git-ignored originals, one folder per category: `common-area`, `signature-view`, `valley-view`, `outdoor`). Names, categories, focal points and alt text are in `scripts/gallery-manifest.json`. Run `npm run images` to generate the optimized WebP/AVIF files in `public/images/hogs-panorama/` (full 2000px, `-md` 1000px, `-sm` 400px, plus 1200x630 Open Graph crops for featured photos) and `lib/gallery.generated.ts` (never hand-edit). To add a photo, drop the original in `source-images/<category>/`, append an entry to the manifest, and re-run. `next/image` provides responsive resizing; the hero is prioritized and other photographs load lazily.

Photographic sources:

- HOGS Panorama photos: supplied by HOGS.
- `cafe/cafe-01.svg`, `cafe/cafe-02.svg`: TODO(owner) placeholders for Cafe DO NTHNG — generated vector mood graphics, not real photography. Replace before launch.

Fonts are self-hosted Cormorant Garamond and Manrope from Google Fonts; see `public/fonts/`. The cloud sprite is an original, mathematically generated radial alpha texture. Font license notices are included alongside the font files.

## Scene and motion

- `components/three/HimalayanScene.tsx`: one persistent canvas with real terrain, instanced forest, river, clouds, stars, and warm illustrative property markers.
- `Terrain.tsx` and `MountainTerrain.tsx`: a 513 × 513 elevation grid with satellite surface imagery and CC0 rock detail. Mobile uses reduced geometry and a 1024px texture.
- `lib/cameraPath.ts`: scroll camera positions in metres scaled at 100 metres per world unit, with no vertical exaggeration.
- `components/ui/Motion.tsx`: GSAP section transitions and Lenis scrolling. Reduced motion uses native scrolling and demand rendering; hidden tabs stop rendering.
- A photograph remains visible while WebGL loads or if rendering fails. Use `?scene=photo` to inspect the fallback.
- Sources and modifications are recorded in `public/terrain/ATTRIBUTION.md`, `satellite-source.json`, and `public/textures/LICENSE.md`. Additional trees, river and buildings are artistic interpretations, not surveyed property locations.
- `scripts/acquire-terrain.cjs` and `scripts/acquire-satellite.mjs` reproduce the geospatial assets. They require network access; normal builds use the checked-in assets.

### Optional terrain model

See `public/models/README.md` for the coordinate contract and `NEXT_PUBLIC_HIMALAYA_MODEL` override. The default real elevation mesh does not require a GLB download.

## Accessibility and SEO

Semantic sections, a skip link, visible focus rings, labeled form fields, announced validation errors, custom modal calendars with linked date constraints and disabled past dates, keyboard-operable sliders, native modal focus containment, and a mobile menu are included. Arrow keys navigate the gallery; Escape closes dialogs. Property preselection works from each stay card. Structured data describes the stay and cafe with the supplied Manali location, without invented street addresses or ratings.

Open Graph images are the 1200x630 crops generated by `npm run images` (featured photos). `robots.ts` and `sitemap.ts` use your configured origin. The five requested policy/FAQ pages are explicitly marked as draft stubs and excluded from indexing. Replace their contents with approved policies before launch.

## Deploy to Vercel

1. Push this folder to a Git repository and import it into Vercel as a Next.js project.
2. Add the four environment variables above. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin. Configure preview deployments with their own exact origin when testing submissions.
3. Use `npm run build` as the build command and the default Next.js output settings.
4. Verify the Resend sending domain, test one real enquiry, configure edge rate limiting, and replace the draft policies, sample photographs, and Instagram placeholder.
5. Run mobile Lighthouse against the production build/deployment. The requested Performance ≥85, Accessibility ≥95, and SEO 100 are targets, not scores guaranteed by source code or development-server testing.

No cloud deployment or external email has been performed as part of the local build. Optional ambient audio and device-orientation access are omitted; there is no unsolicited sound or sensor permission prompt.

## Redesign validation

The redesign adds an asymmetric hero, photographic masks, a valley interlude, full-bleed stay chapters, photographic experience rail, perspective gallery, scrubbed story typography, and a warm booking panel. Layout overrides are in `app/cinematic.css`; shared base and legal styles remain in `app/globals.css`.

Verified with a production build, TypeScript checks, booking tests, and browser checks at desktop and mobile widths. Gallery navigation, custom calendars, form errors, and WhatsApp message generation were exercised. No real booking email or WhatsApp message was sent. Lighthouse scores are not measured or guaranteed. Real property photographs, approved legal content, and Resend credentials remain launch inputs.

Development output uses `.next-cinema` and production output uses `.next-production` to avoid stale OneDrive cache files in the earlier build directories.
