import { spawnSync } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const res = spawnSync(process.execPath, [path.join('scripts', 'build-uqm-minimal-wasm.mjs')], {
  cwd: root,
  stdio: ['ignore', 'pipe', 'pipe'],
  env: process.env,
  encoding: 'utf8',
});

if (res.status === 0) {
  if (res.stdout) process.stdout.write(res.stdout);
  if (res.stderr) process.stderr.write(res.stderr);
  process.exit(0);
}

console.warn('[uqm-wasm] optional wasm build failed; continuing without wasm conversation core');
process.exit(0);
