import crypto from 'node:crypto';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Compiler, CompilerOptions } from 'inkjs/full';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoRoot = path.resolve(__dirname, '..');

const storyDir = path.join(repoRoot, 'src', 'game', 'story');
const inkEntryPath = path.join(storyDir, 'main.ink');
const outJsonPath = path.join(storyDir, 'story.json');

await fsp.mkdir(storyDir, { recursive: true });

const stripBom = (s) => s.replace(/^\uFEFF/, '');

/**
 * Minimal file handler for Ink INCLUDE support.
 *
 * Ink passes the including file path as the second argument to both methods.
 */
const fileHandler = {
  ResolveInkFilename(inkPath, includeFromFilename = null) {
    const baseDir = includeFromFilename ? path.dirname(includeFromFilename) : storyDir;
    return path.resolve(baseDir, inkPath);
  },
  LoadInkFileContents(resolvedFilename) {
    return stripBom(fs.readFileSync(resolvedFilename, 'utf8'));
  },
};

const source = stripBom(await fsp.readFile(inkEntryPath, 'utf8'));

const options = new CompilerOptions(inkEntryPath, [], true, null, fileHandler);
const compiler = new Compiler(source, options);
const story = compiler.Compile();

const compiled = story.ToJson();
if (typeof compiled !== 'string') {
  throw new Error('Expected inkjs Story.ToJson() to return a string');
}

const storyVersion = crypto.createHash('sha256').update(compiled).digest('hex').slice(0, 16);

const parsed = JSON.parse(compiled) as unknown;
const pretty = JSON.stringify(parsed, null, 2);

await fsp.writeFile(outJsonPath, `${pretty}\n`, 'utf8');

const metaPath = path.join(storyDir, 'story.meta.json');
await fsp.writeFile(
  metaPath,
  `${JSON.stringify({ storyId: 'main', storyVersion }, null, 2)}\n`,
  'utf8',
);

console.log(`[ink] Compiled ${path.relative(repoRoot, inkEntryPath)} -> ${path.relative(repoRoot, outJsonPath)}`);
