// Review helper: 400px thumbnails of the raw cafe photos -> raw-images/_thumbs/, plus labelled contact sheets.
// Originals in raw-images/ are only read, never modified.
import sharp from 'sharp';
import { mkdirSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const RAW = join(ROOT, 'raw-images');
const OUT = join(RAW, '_thumbs');
const SHEETS = join(OUT, 'sheets');
mkdirSync(SHEETS, { recursive: true });

const files = [];
for (const dir of ['cafe', 'cafedonthng']) {
  for (const f of readdirSync(join(RAW, dir)).sort()) {
    if (!/\.(jpe?g|png)$/i.test(f)) { console.log('skip (not decodable by sharp):', dir, f); continue; }
    files.push({ dir, f });
  }
}

const thumbs = [];
for (const { dir, f } of files) {
  const name = `${dir === 'cafe' ? 'c' : 'd'}_${basename(f, extname(f)).replace(/\s+/g, '')}`;
  const out = join(OUT, `${name}.jpg`);
  const buf = await sharp(join(RAW, dir, f), { failOn: 'none' }).rotate().resize({ width: 400, height: 400, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 70 }).toBuffer();
  await sharp(buf).toFile(out);
  thumbs.push({ name, buf });
}

// 3x3 contact sheets, 400px cells with caption.
const CELL = 400, CAP = 28, COLS = 3, PER = 9;
for (let s = 0; s * PER < thumbs.length; s++) {
  const chunk = thumbs.slice(s * PER, s * PER + PER);
  const rows = Math.ceil(chunk.length / COLS);
  const comps = [];
  for (let i = 0; i < chunk.length; i++) {
    const x = (i % COLS) * CELL, y = Math.floor(i / COLS) * (CELL + CAP);
    const m = await sharp(chunk[i].buf).metadata();
    comps.push({ input: chunk[i].buf, left: x + Math.floor((CELL - m.width) / 2), top: y });
    comps.push({ input: Buffer.from(`<svg width="${CELL}" height="${CAP}"><rect width="100%" height="100%" fill="#000"/><text x="8" y="20" font-size="18" font-family="Arial" fill="#fff">${chunk[i].name}</text></svg>`), left: x, top: y + CELL });
  }
  await sharp({ create: { width: CELL * COLS, height: rows * (CELL + CAP), channels: 3, background: '#222' } }).composite(comps).jpeg({ quality: 75 }).toFile(join(SHEETS, `sheet-${String(s + 1).padStart(2, '0')}.jpg`));
}
console.log(`${thumbs.length} thumbs, ${Math.ceil(thumbs.length / PER)} sheets`);
