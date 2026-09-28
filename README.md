# HOGS — Of Himalayan Homes

A single-page Himalayan stay experience built with **Next.js 15 App Router, TypeScript, Tailwind CSS, React Three Fiber / Drei, postprocessing, GSAP ScrollTrigger, Lenis, Framer Motion, React Hook Form, and Zod**. The scene is procedural: there is no heavyweight terrain model to download.

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

`lib/content.ts` is the central marketing copy, property data, image path, contact, and policy-link configuration. UI validation and delivery messages are in `lib/booking.ts`, the form component, and the API route. The supplied photographs are **illustrative placeholders**, not photographs of HOGS properties. The website labels them accordingly. Prices, room counts, and unconfirmed amenities are intentionally absent. Feature copy needs owner confirmation.

Replace files in `public/images/stays/` with licensed property photographs, or change the arrays in `lib/content.ts`. Keep descriptive alt text, update the gallery captions, and remove illustrative-photo notices only when real photographs have been substituted. `next/image` provides responsive resizing and AVIF/WebP delivery. The hero is prioritized; other photographs load lazily.

Photographic sources (downloaded and served locally):

- `mountains.jpg`: [Surya teja, Manali mountain range](https://unsplash.com/photos/a-view-of-a-mountain-range-from-a-distance-oIXJ839p55k)
- `valley.jpg`: [Aditya Chache, Old Manali](https://unsplash.com/photos/a-village-with-a-mountain-in-the-background-4OuUNgTGynk)
- `stays/panorama.jpg`: [Mithil Girish, mountain overlook](https://unsplash.com/photos/a-view-of-a-mountain-range-from-a-high-point-of-view-HZuq2OShCdI)
- `stays/retreat.jpg`: [Unsplash cabin image](https://images.unsplash.com/photo-1587061949409-02df41d5e562); exact photographer/location not verified. This is a mood image only and must be replaced before a real-property launch. Reused as the illustrative forest-retreat image; unrelated to Cafe Do Nthng.
- `cafe/cafe-01.svg`, `cafe/cafe-02.svg`: TODO(owner) placeholders for Cafe Do Nthng — generated vector mood graphics, not real photography. Replace before launch.

The first three images were sourced from pages displaying the [Unsplash License](https://unsplash.com/license). Confirm rights for final production assets. Fonts are self-hosted Cormorant Garamond and Manrope from Google Fonts; see `public/fonts/`. The cloud sprite is an original, mathematically generated radial alpha texture. Font license notices are included alongside the font files.

## Scene and motion

- `components/three/MountainScene.tsx`: ridged fractal terrain and snow/rock/pine shader, instanced trees, river, illuminated lodge markers, clouds, snow, stars, and the moving rider light.
- `lib/cameraPath.ts`: one camera keyframe per section/property. Positions and targets use Three.js world coordinates.
- `components/ui/Motion.tsx`: GSAP section transitions and reveals; Lenis uses the same GSAP ticker. The stays and photographic experience strips pin on wide screens. Mobile uses stacked stays and native horizontal experience scrolling. Reduced motion keeps every chapter available without pinning.
- The hero photograph dissolves into the persistent world as you scroll. A transparent valley interlude exposes the terrain; the pinned stay sequence guides the camera between the two lodges. No scene toggle is needed.
- Canvas is client-only and dynamically loaded. Page text is server-rendered and remains available without WebGL. A photo remains the hero fallback.
- Low-core / narrow devices and PerformanceMonitor reduce rendering cost. Reduced motion disables snow and postprocessing and uses demand rendering; hidden tabs stop rendering. Native scrolling is retained for reduced motion.

### Replace terrain with a real GLB

Place your licensed, Draco/Meshopt-compressed GLB in `public/models/`. Replace the `Terrain` component with `useGLTF('/models/terrain.glb')`. Match its origin and scale to the camera keyframes, river, and lodge coordinates. Self-host decoder files when using Draco. Use KTX2-compressed textures via a KTX2Loader configured with `detectSupport(gl)` and locally hosted transcoder files; retain a compatible fallback. Keep repeated trees instanced and avoid adding per-tree meshes. No compressed model or KTX2 decoder is required for the default procedural scene.

## Accessibility and SEO

Semantic sections, a skip link, visible focus rings, labeled form fields, announced validation errors, custom modal calendars with linked date constraints and disabled past dates, keyboard-operable sliders, native modal focus containment, and a mobile menu are included. Arrow keys navigate the gallery; Escape closes dialogs. Property preselection works from each stay card. Structured data includes two LodgingBusiness entries with the supplied Manali location, without invented street addresses or ratings.

The social image is generated locally by `app/opengraph-image.tsx`. `robots.ts` and `sitemap.ts` use your configured origin. The five requested policy/FAQ pages are explicitly marked as draft stubs and excluded from indexing. Replace their contents with approved policies before launch.

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
