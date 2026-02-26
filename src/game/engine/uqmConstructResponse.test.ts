import { describe, expect, it, vi, beforeEach } from 'vitest';

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

describe('uqmConstructResponse', () => {
  it('falls back to JS join when wasm runtime is unavailable (deterministic)', async () => {
    vi.doMock('./uqmWasmRuntime', () => ({
      loadUqmWasmRuntime: () => Promise.reject(new Error('no wasm')),
    }));

    const { constructResponseUqm } = await import('./uqmConstructResponse');

    const parts = ['Hello', ' ', 'world', '!'];

    const a = await constructResponseUqm(parts);
    const b = await constructResponseUqm(parts);

    expect(a).toBe('Hello world!');
    expect(b).toBe(a);
  });
});
