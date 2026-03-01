import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { BUILD_ID } from '@/lib/buildInfo';

describe('index.html metadata', () => {
  it('uses the correct app title', () => {
    const html = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
    expect(html).toMatch(/<title>\s*Crown & Concord\s*<\/title>/);
  });

  it('embeds cc-build metadata matching BUILD_ID', () => {
    const html = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
    expect(html).toMatch(new RegExp(`<meta\\s+name=["']cc-build["']\\s+content=["']${BUILD_ID}["']\\s*\\/?\\s*>`));
  });

  it('does not reference vendored howler script', () => {
    const html = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
    expect(html).not.toContain('/vendor/howler/howler.core.min.js');
  });
});
