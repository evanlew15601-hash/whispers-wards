import { describe, expect, it, vi, beforeEach } from 'vitest';

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

describe('uqmTextWrap', () => {
  it('falls back to JS wrapper when wasm runtime is unavailable (deterministic)', async () => {
    vi.doMock('./uqmWasmRuntime', () => ({
      loadUqmWasmRuntime: () => Promise.reject(new Error('no wasm')),
    }));

    const { wrapTextLinesJs, wrapTextLinesUqm } = await import('./uqmTextWrap');

    const text = 'Hello from UQM\n\nSecond paragraph here.';
    const width = 8;

    const js = wrapTextLinesJs(text, width);
    const a = await wrapTextLinesUqm(text, width);
    const b = await wrapTextLinesUqm(text, width);

    expect(a).toEqual(js);
    expect(b).toEqual(a);
    expect(a).toContain('');
  });

  it('wraps punctuation edge cases (quotes, em-dashes) without stripping characters', async () => {
    vi.doMock('./uqmWasmRuntime', () => ({
      loadUqmWasmRuntime: () => Promise.reject(new Error('no wasm')),
    }));

    const { wrapTextLinesJs } = await import('./uqmTextWrap');

    const text = 'He said, "Hello — world!"';
    const lines = wrapTextLinesJs(text, 12);

    expect(lines).toEqual(['He said,', '"Hello —', 'world!"']);
  });

  it('handles multiple spaces and tabs at wrap boundaries', async () => {
    vi.doMock('./uqmWasmRuntime', () => ({
      loadUqmWasmRuntime: () => Promise.reject(new Error('no wasm')),
    }));

    const { wrapTextLinesJs } = await import('./uqmTextWrap');

    expect(wrapTextLinesJs('Hello   world', 7)).toEqual(['Hello', 'world']);
    expect(wrapTextLinesJs('a\t\tb', 2)).toEqual(['a', 'b']);
  });

  it('splits hyphenated and long words without spaces (deterministic)', async () => {
    vi.doMock('./uqmWasmRuntime', () => ({
      loadUqmWasmRuntime: () => Promise.reject(new Error('no wasm')),
    }));

    const { wrapTextLinesJs } = await import('./uqmTextWrap');

    const hyphenated = 'Well-known facts';
    expect(wrapTextLinesJs(hyphenated, 5)).toEqual(['Well-', 'known', 'facts']);

    const longWord = 'supercalifragilistic';
    const a = wrapTextLinesJs(longWord, 6);
    const b = wrapTextLinesJs(longWord, 6);

    expect(a).toEqual(['superc', 'alifra', 'gilist', 'ic']);
    expect(b).toEqual(a);
  });

  it('preserves explicit newlines and normalizes CRLF/CR sequences', async () => {
    vi.doMock('./uqmWasmRuntime', () => ({
      loadUqmWasmRuntime: () => Promise.reject(new Error('no wasm')),
    }));

    const { wrapTextLinesJs } = await import('./uqmTextWrap');

    const text = 'A\r\n\rB\n\nC';
    expect(wrapTextLinesJs(text, 10)).toEqual(['A', '', 'B', '', 'C']);
  });

  it('uses lineFitChars when wasm runtime is available', async () => {
    const lineFitChars = vi.fn((text: string, maxWidth: number) => {
      if (text.length <= maxWidth) return text.length;
      const slice = text.slice(0, maxWidth);
      const idx = slice.lastIndexOf(' ');
      return idx > 0 ? idx + 1 : maxWidth;
    });

    vi.doMock('./uqmWasmRuntime', () => ({
      loadUqmWasmRuntime: () => Promise.resolve({ lineFitChars }),
    }));

    const { wrapTextLinesUqm } = await import('./uqmTextWrap');

    const lines = await wrapTextLinesUqm('Hello from UQM', 6);

    expect(lineFitChars).toHaveBeenCalled();
    expect(lines).toEqual(['Hello', 'from', 'UQM']);
  });

  it('wasm path matches JS behavior for edge cases (deterministic, width is floored)', async () => {
    const lineFitChars = vi.fn((text: string, maxWidth: number) => {
      if (text.length <= maxWidth) return text.length;

      const slice = text.slice(0, maxWidth);
      const lastWs = Math.max(slice.lastIndexOf(' '), slice.lastIndexOf('\t'));
      if (lastWs > 0) return lastWs + 1;

      return maxWidth;
    });

    vi.doMock('./uqmWasmRuntime', () => ({
      loadUqmWasmRuntime: () => Promise.resolve({ lineFitChars }),
    }));

    const { wrapTextLinesJs, wrapTextLinesUqm } = await import('./uqmTextWrap');

    const text = 'He said, "Hello — world!"\n\nHello   world\nstate-of-the-art\nsupercalifragilistic';
    const maxWidth = 8.9;

    const js = wrapTextLinesJs(text, maxWidth);
    const a = await wrapTextLinesUqm(text, maxWidth);
    const b = await wrapTextLinesUqm(text, maxWidth);

    expect(a).toEqual(js);
    expect(b).toEqual(js);

    // Ensure maxWidth is floored before passing into the runtime.
    expect(lineFitChars.mock.calls.every(([, w]) => w === 8)).toBe(true);
  });
});
