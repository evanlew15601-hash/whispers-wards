import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Compiler } from 'inkjs/full';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoRoot = path.resolve(__dirname, '..');

const storyDir = path.join(repoRoot, 'src', 'game', 'story');
const inkEntryPath = path.join(storyDir, 'main.ink');
const outJsonPath = path.join(storyDir, 'story.json');

await fs.mkdir(storyDir, { recursive: true });

const source = (await fs.readFile(inkEntryPath, 'utf8')).replace(/^\uFEFF/, '');

const compiler = new Compiler(source);
const story = compiler.Compile();

const compiled = story.ToJson();
if (typeof compiled !== 'string') {
  throw new Error('Expected inkjs Story.ToJson() to return a string');
}

const parsed = JSON.parse(compiled) as unknown;
const pretty = JSON.stringify(parsed, null, 2);

await fs.writeFile(outJsonPath, `${pretty}\n`, 'utf8');

console.log(`[ink] Compiled ${path.relative(repoRoot, inkEntryPath)} -> ${path.relative(repoRoot, outJsonPath)}`);
