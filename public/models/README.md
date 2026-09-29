# Himalayan landscape assets

The production default is a real elevation mesh, not procedural mountain shapes.

- public/terrain/manali-dem.bin: 513×513 little-endian uint16 elevations in metres.
- lib/terrain-data.json: geographic bounds, source, spacing, and normalization.
- Elevation source: Mapzen / Tilezen terrain tiles, SRTM data courtesy of USGS.
- public/textures: optimized rock PBR maps from Poly Haven (CC0), and locally prepared satellite imagery.
- Property markers and the illustrative river ribbon are art-directed, not surveyed locations.

## Optional production GLB

TODO(asset): place a licensed, Meshopt-compressed Himalayan terrain model at:
public/models/himalaya.glb

Then set:
NEXT_PUBLIC_HIMALAYA_MODEL=/models/himalaya.glb

components/three/Mountains.tsx loads that model through Drei useGLTF.
No nonexistent model is requested by default.

Coordinate contract:
- One Three.js unit = 100 metres.
- +X = east, -Z = north, +Y = up.
- Origin: longitude 77.24°, latitude 32.35°, elevation 1,500 metres.
- Align the model with the DEM bounds in lib/terrain-data.json.
- Include PBR materials; keep textures at 1K/2K and use Meshopt compression.
- For KTX2, configure and self-host the matching transcoder before enabling it.
- Update the DEM sampler alongside any model that changes surface elevations.

Failed asset loads or WebGL context loss reveal the real mountain photograph.
No abstract or low-poly fallback is used.

Regeneration:
node scripts/acquire-terrain.cjs
node scripts/acquire-satellite.mjs

These are development-time downloads. The browser makes no requests to providers.
See the included source manifests and attribution before redistributing.
