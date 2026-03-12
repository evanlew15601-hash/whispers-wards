import fsp from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoRoot = path.resolve(__dirname, '..');

const LORESTROME_SHEET_URL =
  'https://upload.wikimedia.org/wikipedia/commons/3/3d/200_portraits_of_fictional_characters.png';

const CELL_SIZE = 300;
const COLS = 6;
const ROWS = 36;

const SIZES = [96, 140, 192, 640];

const outDir = path.join(repoRoot, 'public', 'portraits', 'lorestrome');
const cacheDir = path.join(repoRoot, 'scripts', '.cache');
const sheetCachePath = path.join(cacheDir, 'lorestrome-sheet.png');

const availabilityTsPath = path.join(repoRoot, 'src', 'game', 'lorestromeThumbsAvailable.ts');

const writeAvailability = async (available) => {
  await fsp.writeFile(availabilityTsPath, `export const LORESTROME_THUMBS_AVAILABLE = ${available ? 'true' : 'false'};\n`, 'utf8');
};

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

async function main() {
  const lifecycle = process.env.npm_lifecycle_event;
  const strict = lifecycle === 'build:portraits';

  const skip = String(process.env.SKIP_LORESTROME_PORTRAITS ?? '').toLowerCase();
  if (skip === '1' || skip === 'true' || skip === 'yes') {
    console.log('[portraits] SKIP_LORESTROME_PORTRAITS set; skipping portrait generation');
    await writeAvailability(false);
    return;
  }

  let sharp;
  try {
    const mod = await import('sharp');
    sharp = mod.default ?? mod;
  } catch (err) {
    await writeAvailability(false);
    if (strict) throw err;

    console.warn('[portraits] optional portrait generation skipped (sharp unavailable)');
    console.warn(err instanceof Error ? err.message : String(err));
    return;
  }

  await fsp.mkdir(outDir, { recursive: true });
  await fsp.mkdir(cacheDir, { recursive: true });

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
  const total = COLS * ROWS * SIZES.length;

  const jobs = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const idx = row * COLS + col;
      const padded = String(idx).padStart(3, '0');

      const left = col * CELL_SIZE;
      const top = row * CELL_SIZE;

      for (const size of SIZES) {
        const outPath = path.join(outDir, `idx-${padded}-${size}.webp`);

        jobs.push(async () => {
          await sheet
            .clone()
            .extract({ left, top, width: CELL_SIZE, height: CELL_SIZE })
            .resize(size, size)
            .webp({ quality: 88 })
            .toFile(outPath);

          completed++;
          if (completed % 60 === 0 || completed === total) {
            console.log(`[portraits] Generated ${completed}/${total}`);
          }
        });
      }
    }
  }

  const concurrency = Number(process.env.PORTRAIT_JOBS ?? 8);
  console.log(
    `[portraits] Generating ${total} thumbnails (concurrency=${concurrency}) -> ${path.relative(repoRoot, outDir)}`,
  );
  await runPool(jobs, concurrency);

  await writeAvailability(true);
  console.log('[portraits] Done');
}

main().catch(async (err) => {
  const lifecycle = process.env.npm_lifecycle_event;
  const strict = lifecycle === 'build:portraits';

  try {
    await writeAvailability(false);
  } catch {
    // ignore
  }

  if (strict) {
    console.error(err);
    process.exit(1);
  }

  console.warn('[portraits] optional portrait generation failed; continuing without generated thumbnails');
  console.warn(err instanceof Error ? err.message : String(err));
  process.exit(0);
});
