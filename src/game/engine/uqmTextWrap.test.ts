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

  it('normalizes CRLF and preserves explicit blank lines', async () => {
    vi.doMock('./uqmWasmRuntime', () => ({
      loadUqmWasmRuntime: () => Promise.reject(new Error('no wasm')),
    }));

    const { wrapTextLinesUqm } = await import('./uqmTextWrap');

    const lines = await wrapTextLinesUqm('One\r\n\r\nTwo\r\n\r\n\r\nThree', 80);
    expect(lines).toEqual(['One', '', 'Two', '', '', 'Three']);
  });

  it('wraps with tabs/spaces and trims line endings deterministically', async () => {
    vi.doMock('./uqmWasmRuntime', () => ({
      loadUqmWasmRuntime: () => Promise.reject(new Error('no wasm')),
    }));

    const { wrapTextLinesJs } = await import('./uqmTextWrap');

    const lines = wrapTextLinesJs('A\tB   C   ', 3);
    // The wrapper trims trailing whitespace per line.
    expect(lines).toEqual(['A', 'B', 'C']);
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

  it('guards against a buggy lineFitChars implementation returning 0', async () => {
    const lineFitChars = vi.fn(() => 0);

    vi.doMock('./uqmWasmRuntime', () => ({
      loadUqmWasmRuntime: () => Promise.resolve({ lineFitChars }),
    }));

    const { wrapTextLinesUqm } = await import('./uqmTextWrap');

    const lines = await wrapTextLinesUqm('ABC', 10);
    expect(lines).toEqual(['A', 'B', 'C']);
  });
});
