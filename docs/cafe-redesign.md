# Cafe DO NTHNG follow-up fixes

No dependencies were added. Existing cafe metadata and photographs are retained.

## Location

`panoramaLocation` in `lib/content.ts` is the single source for directions, address and map embed. Both Panorama and the cafe use `LocationMap`. All cafe directions links use https://maps.app.goo.gl/WT7Xnq1hsoJjRCs48. The cafe schema shares the Panorama address and links it through `containedInPlace`.

The checkout had no saved embed or coordinates. The shared embed currently searches the verified business address. Google Maps requests timed out during verification. Exact latitude/longitude and the original embed still need confirmation; `geo` stays null and is omitted from both schemas rather than inventing coordinates.

Audio stays hidden with `cafeAmbienceEnabled: false`. Add a licensed recording at `public/audio/cafe-ambience.mp3` before enabling that flag.

## Scene and assets

The cup, saucer, handle, spoon, latte art, steam and reflection environment are generated in code. No GLB or HDRI was added. Wood maps are derived from Poly Haven wood_table_001, licensed CC0: https://polyhaven.com/a/wood_table_001. Attribution is on /credits and in public/textures/cafe/LICENSE.md.

New image assets (512px WebP, approximately 44 KB total):
- public/textures/cafe/wood-color.webp
- public/textures/cafe/wood-normal.webp
- public/textures/cafe/wood-roughness.webp

The 3D module is imported without SSR near the viewport, pauses off-screen, and uses static rendering for reduced motion. Mobile, low CPU count, unsupported WebGL and rendering errors retain the existing latte photograph. Required lazy JavaScript chunks total 356,173 bytes gzipped (about 348 KiB), above the optional 250 KB target.

## Validation

- Final `npm run build` passed, including lint and type checking.
- Inspected the scene and terrace at 1920px and 1366px, and the swipe carousel at 375px.
- 1920px pinned section: full photo and caption within the viewport. At 1366px the photo height is 476px within a 768px section.
- At 375px: no document horizontal overflow, no 3D canvas, no pin spacer, 70vw cards and mandatory horizontal scroll snap.
- Cafe sounds button absent; directions URL verified in rendered markup.
- No browser console errors observed.
- Reduced-motion branches reviewed in code. Actual preference-on browser runs remain unverified because the browser automation viewport tool does not support media-preference emulation.
- External Google Maps embed loading remains unverified because of network timeouts.

## Files changed for this follow-up

- lib/content.ts
- app/cafe/page.tsx
- app/cafe/cafe-story.css
- app/stays/panorama/page.tsx
- app/pages.css
- app/credits/page.tsx
- components/pages/LocationMap.tsx (new)
- components/cafe/CafeStory.tsx
- components/cafe/CafeEffects.tsx
- components/cafe/CoffeeMoment.tsx
- components/cafe/CoffeeCup.tsx
- public/textures/cafe/wood-color.webp (new, CC0)
- public/textures/cafe/wood-normal.webp (new, CC0)
- public/textures/cafe/wood-roughness.webp (new, CC0)
- public/textures/cafe/LICENSE.md (new)
- docs/cafe-redesign.md
