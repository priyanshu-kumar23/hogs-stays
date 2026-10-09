import * as THREE from 'three';

// Geometry and canvas-texture builders for the Cafe hero cup (CoffeeCup.tsx). Units: the cup is ~1.5 tall, the saucer ~1.8 in radius.

/** Which latte art is poured on the coffee. Change CoffeeCup's LATTE_ART to switch. */
export type LatteArt = 'rosetta' | 'mountains';

/** Smooth a rough (radius, height) outline into a lathe profile with no hard corners. */
function smoothProfile(points: [number, number][], samples: number) {
  const curve = new THREE.CatmullRomCurve3(points.map(([x, y]) => new THREE.Vector3(x, y, 0)), false, 'centripetal');
  return curve.getPoints(samples).map(p => new THREE.Vector2(Math.max(0, p.x), p.y));
}

// Cup: foot ring, gentle taper, ~0.07 wall, rounded lip, then the inside wall down to the well. Drawn outside-first so the lathe is one closed shell.
const cupOutline: [number, number][] = [
  [0, 0.04], [0.22, 0.04], [0.42, 0.035], [0.46, 0.006], [0.52, 0], [0.57, 0.012], [0.62, 0.07], [0.68, 0.18], [0.73, 0.38], [0.79, 0.65],
  [0.85, 0.95], [0.89, 1.22], [0.912, 1.40], [0.918, 1.445], [0.905, 1.472], [0.88, 1.486], [0.857, 1.476], [0.848, 1.45],
  [0.842, 1.38], [0.82, 1.22], [0.77, 0.98], [0.70, 0.74], [0.62, 0.52], [0.51, 0.35], [0.38, 0.25], [0.2, 0.2], [0, 0.19],
];
export const cupProfile = smoothProfile(cupOutline, 240);
export const CUP_RIM_Y = 1.486;
export const COFFEE_Y = 1.33; // a little below the rim
/** Inside radius of the cup at a given height (used to size the coffee disc so it meets the wall). */
export function cupInnerRadiusAt(y: number) {
  const top = cupProfile.reduce((best, p, i) => (p.y > cupProfile[best].y ? i : best), 0);
  for (let i = top; i < cupProfile.length - 1; i++) {
    const a = cupProfile[i], b = cupProfile[i + 1];
    if (a.y >= y && b.y <= y) return THREE.MathUtils.lerp(a.x, b.x, (a.y - y) / (a.y - b.y || 1));
  }
  return 0.83;
}
export const makeCupBody = () => new THREE.LatheGeometry(cupProfile, 128);

// Saucer: foot ring underneath, raised rim, shallow well where the cup sits.
export const SAUCER_WELL_Y = 0.082;
export const makeSaucer = () => new THREE.LatheGeometry(smoothProfile([
  [0, 0.035], [0.6, 0.035], [0.66, 0.004], [0.76, 0], [0.82, 0.02], [1.1, 0.075], [1.45, 0.15], [1.74, 0.245], [1.815, 0.285], [1.83, 0.31],
  [1.8, 0.328], [1.755, 0.322], [1.62, 0.27], [1.35, 0.185], [1.08, 0.118], [0.9, 0.095], [0.7, 0.083], [0, 0.082],
], 200), 128);

/** Handle: a smooth oval-section tube swept along a curved path, thicker where it joins the cup (both ends are buried in the wall). */
export function makeHandle() {
  const path = new THREE.CatmullRomCurve3([
    [0.8, 1.15], [1.0, 1.225], [1.24, 1.16], [1.4, 0.98], [1.43, 0.76], [1.33, 0.56], [1.12, 0.45], [0.92, 0.42], [0.66, 0.4],
  ].map(([x, y]) => new THREE.Vector3(x, y, 0)), false, 'centripetal');
  const rings = 80, around = 36;
  const positions: number[] = [], indices: number[] = [];
  const normal = new THREE.Vector3();
  for (let i = 0; i <= rings; i++) {
    const t = i / rings;
    const p = path.getPointAt(t), tangent = path.getTangentAt(t);
    normal.set(-tangent.y, tangent.x, 0).normalize();
    const flare = Math.exp(-t * 5) + Math.exp(-(1 - t) * 5); // thicker at both joins
    const a = 0.085 + 0.085 * flare, b = 0.075 + 0.07 * flare; // in-plane and out-of-plane half widths
    for (let j = 0; j < around; j++) {
      const theta = (j / around) * Math.PI * 2;
      positions.push(p.x + normal.x * a * Math.cos(theta), p.y + normal.y * a * Math.cos(theta), p.z + b * Math.sin(theta));
    }
  }
  for (let i = 0; i < rings; i++) for (let j = 0; j < around; j++) {
    const a = i * around + j, b = i * around + ((j + 1) % around), c = (i + 1) * around + j, d = (i + 1) * around + ((j + 1) % around);
    indices.push(a, b, c, b, d, c);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals(); // vertices wrap around, so the tube is smooth with no seam
  return geometry;
}

/** Teaspoon, lying along +x with the bowl at the origin: a shallow oval bowl and a slim handle that widens a little at the end. */
export function makeSpoonBowl() {
  const bowl = new THREE.SphereGeometry(1, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2);
  bowl.rotateX(Math.PI); // open side up
  bowl.scale(0.2, 0.05, 0.115);
  return bowl;
}
export function makeSpoonHandle() {
  const handle = new THREE.LatheGeometry([[0, 0], [0.012, 0], [0.019, 0.06], [0.02, 0.3], [0.018, 0.5], [0.026, 0.66], [0.04, 0.74], [0.038, 0.78], [0, 0.8]].map(([r, y]) => new THREE.Vector2(r, y)), 32);
  handle.scale(0.4, 1, 1); // flattened: thin in y once laid on its side
  return handle;
}

// ---- canvas textures ----
const SIZE = 1024, R = SIZE / 2;
const softLayer = (ctx: CanvasRenderingContext2D, blur: number, alpha: number, draw: (g: CanvasRenderingContext2D) => void) => {
  const layer = document.createElement('canvas');
  layer.width = layer.height = SIZE;
  const g = layer.getContext('2d')!;
  g.translate(R, R);
  draw(g);
  ctx.save();
  ctx.globalAlpha = alpha;
  if (typeof ctx.filter === 'string') { ctx.filter = `blur(${blur}px)`; ctx.drawImage(layer, 0, 0); }
  else { // no canvas filter support (older Safari): blur by drawing through a small canvas
    const small = document.createElement('canvas'); const k = Math.max(1, blur);
    small.width = small.height = Math.round(SIZE / k);
    small.getContext('2d')!.drawImage(layer, 0, 0, small.width, small.height);
    ctx.imageSmoothingEnabled = true; ctx.drawImage(small, 0, 0, SIZE, SIZE);
  }
  ctx.restore();
};

function drawRosetta(g: CanvasRenderingContext2D) {
  // Layered fern leaves (wide at the bottom, smaller towards the top), a heart on top and a thin pull-through line.
  const leaves = 9;
  for (let k = 0; k < leaves; k++) {
    const t = k / (leaves - 1);
    const yc = 350 - t * 450, w = 380 - 190 * t, d = 52 - 18 * t, th = 38 - 14 * t, sway = Math.sin(t * 3.1) * 16;
    g.beginPath();
    g.moveTo(-w + sway, yc + d * 2.2);
    g.quadraticCurveTo(sway, yc - d * 3.2, w + sway, yc + d * 2.2);
    g.lineTo(w * 0.92 + sway, yc + d * 2.2 + th * 0.8);
    g.quadraticCurveTo(sway, yc - d * 3.2 + th * 1.5, -w * 0.92 + sway, yc + d * 2.2 + th * 0.8);
    g.closePath();
    g.fill();
  }
  const hx = Math.sin(3.1) * 16, hy = -215; // heart
  g.beginPath();
  g.moveTo(hx, hy + 70);
  g.bezierCurveTo(hx - 105, hy + 5, hx - 70, hy - 75, hx, hy - 28);
  g.bezierCurveTo(hx + 70, hy - 75, hx + 105, hy + 5, hx, hy + 70);
  g.fill();
  g.lineCap = 'round'; g.lineWidth = 6; // pull-through
  g.beginPath(); g.moveTo(hx, hy + 20); g.bezierCurveTo(hx + 18, 20, hx - 20, 240, hx + 4, 405); g.stroke();
}

function drawMountains(g: CanvasRenderingContext2D) {
  // Two or three Himalayan peaks and a little sun, in foam.
  g.lineJoin = 'round'; g.lineWidth = 22;
  const peak = (pts: [number, number][]) => { g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.fill(); g.stroke(); };
  peak([[-330, 200], [-205, -45], [-150, 40], [-95, -20], [-40, 200]]);
  peak([[40, 200], [185, -20], [230, 45], [275, -5], [345, 200]]);
  peak([[-190, 200], [-20, -190], [30, -100], [75, -155], [215, 200]]);
  g.beginPath(); g.arc(-200, -215, 42, 0, Math.PI * 2); g.fill();
  g.lineCap = 'round'; g.lineWidth = 10; // ground line
  g.beginPath(); g.moveTo(-300, 262); g.lineTo(300, 262); g.stroke();
}

/** Coffee surface: crema gradient (golden centre, dark edge), a thin dark ring where it meets the cup, foam speckle and the latte art. */
export function makeCoffeeTexture(art: LatteArt) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = SIZE;
  const ctx = canvas.getContext('2d')!;
  const crema = ctx.createRadialGradient(R - 14, R - 10, 20, R, R, R);
  crema.addColorStop(0, '#c68c4a'); crema.addColorStop(0.4, '#ad7036'); crema.addColorStop(0.8, '#7a4119'); crema.addColorStop(0.95, '#4a2410'); crema.addColorStop(1, '#2a130a');
  ctx.fillStyle = crema; ctx.fillRect(0, 0, SIZE, SIZE);
  let seed = 7; const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647); // deterministic speckle
  for (let i = 0; i < 2600; i++) { // foam noise
    const a = rand() * Math.PI * 2, r = Math.sqrt(rand()) * R * 0.97, size = 2 + rand() * 7;
    ctx.fillStyle = rand() > 0.45 ? `rgba(236,196,140,${0.03 + rand() * 0.06})` : `rgba(60,28,10,${0.04 + rand() * 0.07})`;
    ctx.beginPath(); ctx.arc(R + Math.cos(a) * r, R + Math.sin(a) * r, size, 0, Math.PI * 2); ctx.fill();
  }
  const rim = ctx.createRadialGradient(R, R, R * 0.9, R, R, R); // thin darker ring at the cup wall
  rim.addColorStop(0, 'rgba(25,10,4,0)'); rim.addColorStop(0.55, 'rgba(25,10,4,.55)'); rim.addColorStop(1, 'rgba(18,7,3,.95)');
  ctx.fillStyle = rim; ctx.fillRect(0, 0, SIZE, SIZE);

  const draw = art === 'mountains' ? drawMountains : drawRosetta;
  const rotated = (paint: (g: CanvasRenderingContext2D) => void) => (g: CanvasRenderingContext2D) => { g.rotate(-0.2); g.scale(1.08, 1.08); paint(g); };
  // soft shadow under the foam, a wide glow, then the crisper milk-foam layer
  softLayer(ctx, 9, 0.32, rotated(g => { g.translate(0, 6); g.fillStyle = g.strokeStyle = '#3a1a0a'; draw(g); }));
  softLayer(ctx, 14, 0.5, rotated(g => { g.fillStyle = g.strokeStyle = '#efdcba'; draw(g); }));
  softLayer(ctx, 2.6, 0.93, rotated(g => { g.fillStyle = g.strokeStyle = '#f6ead2'; draw(g); }));

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/** Faint warm blotches so the glaze isn't one flat colour. */
export function makeGlazeTextures() {
  const size = 256;
  const make = (paint: (ctx: CanvasRenderingContext2D) => void, srgb: boolean) => {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = size;
    paint(canvas.getContext('2d')!);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    return texture;
  };
  let seed = 11; const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const blotches = (ctx: CanvasRenderingContext2D, base: string, light: string, dark: string, strength: number) => {
    ctx.fillStyle = base; ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 90; i++) {
      const x = rand() * size, y = rand() * size, r = 18 + rand() * 50;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
      gradient.addColorStop(0, (rand() > 0.5 ? light : dark).replace('A', String(strength * (0.4 + rand() * 0.6)))); gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient; ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
  };
  const color = make(ctx => blotches(ctx, '#f3eee6', 'rgba(255,246,228,A)', 'rgba(222,208,184,A)', 0.55), true);
  const roughness = make(ctx => blotches(ctx, '#7a7a7a', 'rgba(150,150,150,A)', 'rgba(60,60,60,A)', 0.5), false); // ~0.25 base once multiplied
  return { color, roughness };
}
