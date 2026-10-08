// Optimise the Cafe DO NTHNG photographs (+ the HOGS Panorama cover).  Usage: `npm run images:cafe`
//   raw-images/<folder>/<camera file>  ->  public/images/cafe-do-nthng/<category>/<seo-name>-<width>.webp
//   `panorama` entries                  ->  public/images/hogs-panorama/<category>/<seo-name>-<width>.webp
// Names, categories, alt text and captions come from scripts/cafe-images.json. Originals are only read, never modified.
// Every output is EXIF-rotated and stripped of ALL metadata (sharp drops it unless .withMetadata() is called), including GPS.
// Also writes lib/cafeImages.generated.ts (never hand-edit) and 1200x630 Open Graph JPEGs.
import sharp from 'sharp';
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const RAW = join(ROOT, 'raw-images');
const PUBLIC_IMAGES = join(ROOT, 'public', 'images');
const CAFE_DIR = 'cafe-do-nthng';
const PANORAMA_DIR = 'hogs-panorama';
const GENERATED = join(ROOT, 'lib', 'cafeImages.generated.ts');
const WIDTHS = [640, 1280, 1920];
const WEBP = { quality: 78, effort: 5 };
const OG = { w: 1200, h: 630 };
const MAX_KB = 250; // budget for the largest variant; quality steps down (min 62) until it fits
const MAX_HEIGHT = 2400; // portraits: skip widths that would make the image taller than this

const { images, panorama = [], ogSource, panoramaOgSource } = JSON.parse(readFileSync(join(ROOT, 'scripts', 'cafe-images.json'), 'utf8'));
const kb = n => `${(n / 1024).toFixed(0)} KB`;
const mb = n => `${(n / 1048576).toFixed(1)} MB`;
const resolveSource = s => (s.startsWith('@public/') ? join(ROOT, 'public', s.slice(8)) : join(RAW, s));

// Start clean so renamed/removed cafe images never linger in public/. (The panorama folder also holds other photos: never wiped.)
rmSync(join(PUBLIC_IMAGES, CAFE_DIR), { recursive: true, force: true });

// Decode once: auto-rotate from EXIF, optionally trim a baked-in white frame, return pixels (no metadata kept).
async function load(path, trim) {
  const rotated = await sharp(path, { failOn: 'none' }).rotate().toBuffer();
  return (trim ? sharp(rotated).trim({ background: '#ffffff', threshold: 40 }) : sharp(rotated)).toBuffer({ resolveWithObject: true });
}

let beforeBytes = 0;
let afterBytes = 0;
const rows = [];

async function optimise(item, siteDir) {
  const src = resolveSource(item.source);
  if (!existsSync(src)) throw new Error(`Missing source: ${src}`);
  const srcBytes = statSync(src).size;
  beforeBytes += srcBytes;
  const { data, info } = await load(src, item.trim);
  const base = sharp(data);
  // Widths: the manifest's own list, or the standard ones that fit the source (never upscaled), plus the native width when the
  // source is clearly narrower than the next standard one.
  let widths;
  if (item.widths) widths = item.widths.filter(w => w <= info.width);
  else {
    widths = WIDTHS.filter(w => w <= info.width && (w * info.height) / info.width <= MAX_HEIGHT);
    const widest = widths[widths.length - 1] || 0;
    if (info.width < WIDTHS[WIDTHS.length - 1] && widest < info.width * 0.9) widths.push(info.width);
    if (!widths.length) widths.push(Math.min(info.width, 640));
  }
  const dir = join(PUBLIC_IMAGES, siteDir, item.category);
  mkdirSync(dir, { recursive: true });
  const srcSet = [];
  for (const w of widths) {
    const resized = base.clone().resize({ width: w, withoutEnlargement: true });
    let quality = WEBP.quality;
    let buf = await resized.clone().webp({ ...WEBP, quality }).toBuffer();
    while (w === widths[widths.length - 1] && w >= 1280 && buf.length > MAX_KB * 1024 && quality > 62) { quality -= 4; buf = await resized.clone().webp({ ...WEBP, quality }).toBuffer(); }
    writeFileSync(join(dir, `${item.slug}-${w}.webp`), buf);
    afterBytes += buf.length;
    srcSet.push({ width: w, src: `/images/${siteDir}/${item.category}/${item.slug}-${w}.webp`, bytes: buf.length });
  }
  const blur = await base.clone().resize({ width: 24 }).webp({ quality: 40 }).toBuffer();
  const top = srcSet[srcSet.length - 1];
  rows.push(`${item.slug.padEnd(66)} ${`${info.width}x${info.height}`.padEnd(10)} ${kb(srcBytes).padStart(8)} -> ${srcSet.map(s => `${s.width}:${kb(s.bytes)}`).join(' ')}${top.bytes > MAX_KB * 1024 ? '  !! over 250 KB' : ''}`);
  return {
    id: item.slug, category: item.category, src: (srcSet.find(s => s.width === 1280) || top).src,
    srcSet: srcSet.map(({ width, src }) => ({ width, src })), width: info.width, height: info.height,
    alt: item.alt, caption: item.caption, position: item.position || 'center 50%', featured: !!item.featured,
    blurDataURL: `data:image/webp;base64,${blur.toString('base64')}`,
  };
}

const entries = [];
for (const item of images) entries.push(await optimise(item, CAFE_DIR));
const panoramaEntries = [];
for (const item of panorama) panoramaEntries.push(await optimise(item, PANORAMA_DIR));

// 1200x630 Open Graph crops (JPEG: widest scraper support). `position` is "<x>% <y>%": which part of the photo the crop keeps.
async function og(source) {
  const dir = join(PUBLIC_IMAGES, source.outDir);
  mkdirSync(dir, { recursive: true });
  const name = `${source.slug}-og-${OG.w}x${OG.h}.jpg`;
  const [px, py] = (source.position || '50% 50%').match(/[\d.]+/g).map(n => Number(n) / 100);
  const { data, info } = await load(resolveSource(source.source), false);
  const scale = Math.max(OG.w / info.width, OG.h / info.height);
  const cw = Math.max(OG.w, Math.round(info.width * scale));
  const ch = Math.max(OG.h, Math.round(info.height * scale));
  const bytes = await sharp(data).resize(cw, ch).extract({ left: Math.round((cw - OG.w) * px), top: Math.round((ch - OG.h) * py), width: OG.w, height: OG.h }).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  writeFileSync(join(dir, name), bytes);
  afterBytes += bytes.length;
  rows.push(`${name.padEnd(66)} OG ${kb(bytes.length)}`);
  return { src: `/images/${source.outDir}/${name}`, width: OG.w, height: OG.h };
}
const cafeOg = await og(ogSource);
const panoramaOg = await og(panoramaOgSource);

const categories = [...new Set(images.map(i => `'${i.category}'`))].join(' | ');
writeFileSync(GENERATED, `// AUTO-GENERATED by scripts/optimize-cafe-images.mjs from scripts/cafe-images.json. Do not edit by hand; run \`npm run images:cafe\`.
export type CafeCategory = ${categories};
export type CafeImage = {
  id: string; category: CafeCategory; /** 1280px WebP (or the widest available). */ src: string; srcSet: { width: number; src: string }[];
  width: number; height: number; alt: string; caption: string; /** CSS object-position for cropped (cover) uses. */ position: string; featured: boolean; blurDataURL: string;
};
export type PanoramaCoverImage = Omit<CafeImage, 'category'> & { category: string };
export const cafeOgImage = ${JSON.stringify(cafeOg)};
export const panoramaOgImage = ${JSON.stringify(panoramaOg)};
export const cafeImageList: CafeImage[] = ${JSON.stringify(entries, null, 2)};
export const panoramaCoverList: PanoramaCoverImage[] = ${JSON.stringify(panoramaEntries, null, 2)};
`);
console.log(rows.join('\n'));
console.log(`\n${entries.length + panoramaEntries.length} images + 2 OG | sources ${mb(beforeBytes)} -> outputs ${mb(afterBytes)}`);
