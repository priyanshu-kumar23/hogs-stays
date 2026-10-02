// Optimise the HOGS Panorama photographs.  Usage: `npm run images` (add `-- --force` to rebuild everything).
//   source-images/<folder>/<camera file>  ->  public/images/hogs-panorama/<category>/<seo-name>[-md|-sm].{webp,avif}
// Names, categories and alt text come from scripts/gallery-manifest.json. Re-runnable: unchanged sources (by content hash)
// are skipped. Also writes lib/gallery.generated.ts (never hand-edit) and 1200x630 Open Graph crops for featured photos.
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'source-images');
const OUT = join(ROOT, 'public', 'images', 'hogs-panorama');
const URL_BASE = '/images/hogs-panorama';
const CACHE_FILE = join(SRC, '.optimize-cache.json');
const GENERATED = join(ROOT, 'lib', 'gallery.generated.ts');
const VERSION = 4; // bump when sizes/qualities below change
const FORCE = process.argv.includes('--force');
const SIZES = { full: 2000, md: 1000, sm: 400 }; // longest side, never upscaled
const WEBP = { quality: 78, effort: 5 };
const AVIF = { quality: 55, effort: 4 };
const OG = { w: 1200, h: 630 };
const MAX_FULL_KB = 250;

const manifest = JSON.parse(readFileSync(join(ROOT, 'scripts', 'gallery-manifest.json'), 'utf8')).images;
const cache = existsSync(CACHE_FILE) ? JSON.parse(readFileSync(CACHE_FILE, 'utf8')) : { version: VERSION, items: {} };
if (cache.version !== VERSION) { cache.version = VERSION; cache.items = {}; }

const kb = n => `${(n / 1024).toFixed(0)} KB`;
const mb = n => `${(n / 1048576).toFixed(2)} MB`;
const fileSize = p => (existsSync(p) ? statSync(p).size : 0);
const orientationOf = (w, h) => (w > h ? 'landscape' : h > w ? 'portrait' : 'square');
const pipeline = (input, size) => sharp(input, { failOn: 'none' }).rotate().resize({ width: size, height: size, fit: 'inside', withoutEnlargement: true });

// Assign -nn per category in manifest order.
const counters = {};
const entries = manifest.map(item => {
  const n = (counters[item.category] = (counters[item.category] || 0) + 1);
  const slug = `${item.subject}-hogs-panorama-manali-${String(n).padStart(2, '0')}`;
  return { ...item, slug, dir: item.category, n };
});

const skipped = [];
const rows = [];
const results = [];
const expected = new Set();

for (const entry of entries) {
  const srcPath = join(SRC, entry.source);
  const outDir = join(OUT, entry.dir);
  mkdirSync(outDir, { recursive: true });
  const files = {};
  for (const size of ['full', 'md', 'sm']) for (const ext of ['webp', 'avif']) {
    const name = `${entry.slug}${size === 'full' ? '' : `-${size}`}.${ext}`;
    files[`${size}.${ext}`] = join(outDir, name);
    expected.add(join(outDir, name));
  }
  const ogPath = join(OUT, 'og', `${entry.slug}-og.jpg`);
  if (entry.featured) expected.add(ogPath);

  let data;
  try {
    if (!existsSync(srcPath)) throw new Error('file not found');
    const stat = statSync(srcPath);
    if (stat.size === 0) throw new Error('0 bytes (cloud-only OneDrive placeholder?)');
    data = readFileSync(srcPath); // forces OneDrive to hydrate a placeholder; throws if it cannot
  } catch (error) {
    skipped.push(`${entry.source}: ${error.message}`);
    continue;
  }
  const hash = createHash('sha1').update(data).digest('hex');
  const cached = cache.items[entry.source];
  const upToDate = !FORCE && cached && cached.hash === hash && cached.slug === entry.slug && Object.values(files).every(existsSync) && (!entry.featured || existsSync(ogPath));
  let meta;
  if (upToDate) {
    meta = cached;
  } else {
    try {
      const sizes = {};
      for (const [size, px] of Object.entries(SIZES)) {
        let webp = await pipeline(data, px).webp(WEBP).toFile(files[`${size}.webp`]);
        // Busy photos can blow the budget at q78: step quality down (never below 46) until the full-size file fits.
        for (let q = WEBP.quality - 8; size === 'full' && webp.size > MAX_FULL_KB * 1024 && q >= 46; q -= 8) webp = await pipeline(data, px).webp({ ...WEBP, quality: q }).toFile(files[`${size}.webp`]);
        await pipeline(data, px).avif(AVIF).toFile(files[`${size}.avif`]);
        sizes[size] = { width: webp.width, height: webp.height };
      }
      const blurBuf = await pipeline(data, 24).webp({ quality: 40 }).toBuffer();
      if (entry.featured) {
        mkdirSync(dirname(ogPath), { recursive: true });
        await sharp(data, { failOn: 'none' }).rotate().resize(OG.w, OG.h, { fit: 'cover', position: sharp.strategy.attention }).jpeg({ quality: 80, mozjpeg: true }).toFile(ogPath);
      }
      meta = { hash, slug: entry.slug, width: sizes.full.width, height: sizes.full.height, blur: `data:image/webp;base64,${blurBuf.toString('base64')}` };
      cache.items[entry.source] = meta;
    } catch (error) {
      skipped.push(`${entry.source}: could not be processed (${error.message})`);
      continue;
    }
  }
  const orientation = orientationOf(meta.width, meta.height);
  const fullBytes = fileSize(files['full.webp']);
  rows.push({ file: `${entry.dir}/${entry.slug}.webp`, original: mb(statSync(srcPath).size), now: kb(fullBytes), dims: `${meta.width}x${meta.height}`, orientation, status: upToDate ? 'cached' : 'new', over: fullBytes > MAX_FULL_KB * 1024 });
  const url = name => `${URL_BASE}/${entry.dir}/${entry.slug}${name}`;
  results.push({
    id: entry.slug, src: url('.webp'), srcAvif: url('.avif'), srcMd: url('-md.webp'), srcSm: url('-sm.webp'), srcMdAvif: url('-md.avif'), srcSmAvif: url('-sm.avif'),
    width: meta.width, height: meta.height, orientation, category: entry.category, alt: entry.alt, blurDataURL: meta.blur, position: entry.focus || 'center',
    ...(entry.featured ? { featured: true, og: `${URL_BASE}/og/${entry.slug}-og.jpg` } : {}),
  });
}

// Prune generated files that no longer belong to the manifest (renames/removals).
const pruned = [];
const walk = dir => existsSync(dir) ? readdirSync(dir, { withFileTypes: true }).flatMap(d => (d.isDirectory() ? walk(join(dir, d.name)) : [join(dir, d.name)])) : [];
for (const file of walk(OUT)) if (!expected.has(file)) { rmSync(file); pruned.push(relative(ROOT, file)); }

writeFileSync(CACHE_FILE, JSON.stringify(cache));
const header = `// AUTO-GENERATED by scripts/optimize-images.mjs from scripts/gallery-manifest.json. Do not edit by hand; run \`npm run images\`.\n`;
const types = `export type GalleryCategory = 'common-area' | 'signature-view' | 'valley-view' | 'outdoor';
export type GalleryOrientation = 'landscape' | 'portrait' | 'square';
export type GalleryImage = {
  id: string; src: string; srcAvif: string; srcMd: string; srcSm: string; srcMdAvif: string; srcSmAvif: string;
  width: number; height: number; orientation: GalleryOrientation; category: GalleryCategory; alt: string; blurDataURL: string;
  /** CSS object-position for cropped (cover) uses, chosen from the photo's subject. */
  position: string; featured?: boolean; /** 1200x630 Open Graph crop (featured photos only). */ og?: string;
};
`;
writeFileSync(GENERATED, `${header}${types}export const galleryImages: GalleryImage[] = ${JSON.stringify(results, null, 2)};\n`);

// Report
const pad = (s, n) => String(s).padEnd(n);
console.log(`\n${pad('file', 96)}${pad('original', 11)}${pad('webp', 9)}${pad('dimensions', 12)}${pad('orientation', 12)}status`);
for (const r of rows) console.log(`${pad(r.file, 96)}${pad(r.original, 11)}${pad(r.now + (r.over ? ' !' : ''), 9)}${pad(r.dims, 12)}${pad(r.orientation, 12)}${r.status}`);
const all = walk(OUT).reduce((n, f) => n + fileSize(f), 0);
const fullWebp = results.reduce((n, r) => n + fileSize(join(ROOT, 'public', r.src)), 0);
const originals = rows.length ? entries.filter(e => existsSync(join(SRC, e.source))).reduce((n, e) => n + statSync(join(SRC, e.source)).size, 0) : 0;
console.log(`\n${results.length}/${entries.length} images | originals ${mb(originals)} | full-size WebP set ${mb(fullWebp)} | everything generated (all sizes, AVIF+WebP, OG) ${mb(all)}`);
const heavy = rows.filter(r => r.over);
if (heavy.length) console.log(`Over ${MAX_FULL_KB} KB (full WebP): ${heavy.map(r => r.file).join(', ')}`);
if (pruned.length) console.log(`Pruned ${pruned.length} stale file(s).`);
if (skipped.length) { console.log('\nSKIPPED (unreadable or empty):'); skipped.forEach(s => console.log(`  - ${s}`)); }
console.log(`Wrote ${relative(ROOT, GENERATED)}`);
