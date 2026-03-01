import { spawnSync } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const res = spawnSync(process.execPath, [path.join('scripts', 'build-uqm-minimal-wasm.mjs')], {
  cwd: root,
  stdio: 'inherit',
  env: process.env,
});

if (res.status === 0) {
  process.exit(0);
}

console.warn('[uqm-wasm] non-fatal: wasm build failed; continuing without wasm conversation core');
process.exit(0);
