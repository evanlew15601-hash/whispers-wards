import fsp from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoRoot = path.resolve(__dirname, '..');

const LORESTROME_SHEET_URL =
  'https://upload.wikimedia.org/wikipedia/commons/3/3d/200_portraits_of_fictional_characters.png';

const CELL_SIZE = 300;
const COLS = 6;
const ROWS = 36;

const SIZES = [96, 140, 192, 640];
const FORMATS = ['jpg'];

const outDir = path.join(repoRoot, 'public', 'portraits', 'lorestrome');
const cacheDir = path.join(repoRoot, 'scripts', '.cache');
const sheetCachePath = path.join(cacheDir, 'lorestrome-sheet.png');

const exists = async (p) => {
  try {
    await fsp.access(p);
    return true;
  } catch {
    return false;
  }
};

const runPool = async (jobs, concurrency) => {
  let next = 0;
  const worker = async () => {
    for (;;) {
      const idx = next++;
      if (idx >= jobs.length) return;
      await jobs[idx]();
    }
  };

  const workers = Array.from({ length: Math.max(1, concurrency) }, worker);
  await Promise.all(workers);
};

await fsp.mkdir(outDir, { recursive: true });
await fsp.mkdir(cacheDir, { recursive: true });

const existing = await fsp.readdir(outDir).catch(() => []);
await Promise.all(
  existing
    .filter((f) => f.startsWith('idx-') && (f.endsWith('.webp') || f.endsWith('.jpg')))
    .map((f) => fsp.unlink(path.join(outDir, f))),
);

if (!(await exists(sheetCachePath))) {
  console.log(`[portraits] Downloading sheet: ${LORESTROME_SHEET_URL}`);
  const res = await fetch(LORESTROME_SHEET_URL, {
    headers: {
      // Wikimedia can be picky about missing/odd user agents.
      'User-Agent': 'CrownConcordPortraitBuilder/1.0',
      Accept: 'image/png,image/*;q=0.9,*/*;q=0.8',
    },
  });
  if (!res.ok) {
    throw new Error(`[portraits] Failed to download sheet: ${res.status} ${res.statusText}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await fsp.writeFile(sheetCachePath, buf);
}

const sheetBuf = await fsp.readFile(sheetCachePath);
const sheet = sharp(sheetBuf, { limitInputPixels: false });

let completed = 0;
const total = COLS * ROWS * SIZES.length * FORMATS.length;

const jobs = [];
for (let row = 0; row < ROWS; row++) {
  for (let col = 0; col < COLS; col++) {
    const idx = row * COLS + col;
    const padded = String(idx).padStart(3, '0');

    const left = col * CELL_SIZE;
    const top = row * CELL_SIZE;

    for (const size of SIZES) {
      for (const fmt of FORMATS) {
        const outPath = path.join(outDir, `idx-${padded}-${size}.${fmt}`);

        jobs.push(async () => {
          const img = sheet
            .clone()
            .extract({ left, top, width: CELL_SIZE, height: CELL_SIZE })
            .resize(size, size);

          await img.jpeg({ quality: 88, progressive: true }).toFile(outPath);

          completed++;
          if (completed % 120 === 0 || completed === total) {
            console.log(`[portraits] Generated ${completed}/${total}`);
          }
        });
      }
    }
  }
}

const concurrency = Number(process.env.PORTRAIT_JOBS ?? 8);
console.log(`[portraits] Generating ${total} thumbnails (concurrency=${concurrency}) -> ${path.relative(repoRoot, outDir)}`);
await runPool(jobs, concurrency);

const fingerprint = async (p) => {
  const buf = await fsp.readFile(p);
  return crypto.createHash('sha1').update(buf).digest('hex');
};

const validate = async () => {
  const samples = [
    { idx: 0, size: 96, fmt: 'jpg' },
    { idx: 1, size: 96, fmt: 'jpg' },
    { idx: 0, size: 140, fmt: 'jpg' },
  ];

  const hashes = [];
  for (const s of samples) {
    const padded = String(s.idx).padStart(3, '0');
    const p = path.join(outDir, `idx-${padded}-${s.size}.${s.fmt}`);
    const meta = await sharp(p).metadata();
    if (meta.width !== s.size || meta.height !== s.size) {
      throw new Error(`[portraits] Unexpected dimensions for ${path.basename(p)}: ${meta.width}x${meta.height}`);
    }
    hashes.push({ key: `${s.idx}-${s.size}.${s.fmt}`, hash: await fingerprint(p) });
  }

  const idx0 = hashes.find((h) => h.key === '0-96.jpg')?.hash;
  const idx1 = hashes.find((h) => h.key === '1-96.jpg')?.hash;
  if (idx0 && idx1 && idx0 === idx1) {
    throw new Error('[portraits] Validation failed: idx-000-96.jpg and idx-001-96.jpg are identical (cropping likely broken)');
  }
};

await validate();

console.log('[portraits] Done');
