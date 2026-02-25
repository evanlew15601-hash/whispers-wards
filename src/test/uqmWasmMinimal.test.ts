import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// This test ensures our minimal UQM-derived wasm module can be compiled and executed
// without requiring a system C toolchain. The WAT source lives under third_party/uqm.

describe('UQM minimal wasm module', () => {
  it('compiles and exposes expected exports', async () => {
    const wabtModule = await import('wabt');
    const wabtFactory = (wabtModule as any).default ?? wabtModule;
    const wabt = await wabtFactory();

    const watPath = path.resolve(process.cwd(), 'third_party/uqm/minimal_wasm/uqm_min.wat');
    const watSource = fs.readFileSync(watPath, 'utf8');

    const parsed = wabt.parseWat(watPath, watSource, { features: { mutable_globals: true } });
    const { buffer } = parsed.toBinary({ log: false, write_debug_names: false });

    const { instance } = await WebAssembly.instantiate(buffer, {});
    const exp = instance.exports as any;

    expect(exp.memory).toBeInstanceOf(WebAssembly.Memory);
    expect(typeof exp.uqm_alloc).toBe('function');
    expect(typeof exp.uqm_version_ptr).toBe('function');
    expect(typeof exp.uqm_version_len).toBe('function');
    expect(typeof exp.uqm_line_fit_chars).toBe('function');
  });

  it('line-fit demo behaves reasonably', async () => {
    const wabtModule = await import('wabt');
    const wabtFactory = (wabtModule as any).default ?? wabtModule;
    const wabt = await wabtFactory();

    const watPath = path.resolve(process.cwd(), 'third_party/uqm/minimal_wasm/uqm_min.wat');
    const watSource = fs.readFileSync(watPath, 'utf8');

    const parsed = wabt.parseWat(watPath, watSource, { features: { mutable_globals: true } });
    const { buffer } = parsed.toBinary({ log: false, write_debug_names: false });

    const { instance } = await WebAssembly.instantiate(buffer, {});
    const exp = instance.exports as any;

    const mem = new Uint8Array(exp.memory.buffer);
    const enc = new TextEncoder();

    const ptr = exp.uqm_alloc(64);
    const bytes = enc.encode('Hello from UQM');
    mem.set(bytes, ptr);
    mem[ptr + bytes.length] = 0;

    // With maxWidth=8, should fit "Hello " (6 chars) but not "from".
    expect(exp.uqm_line_fit_chars(ptr, 8)).toBe(6);

    // With maxWidth=6, should fit "Hello" (5 chars).
    expect(exp.uqm_line_fit_chars(ptr, 6)).toBe(5);
  });
});
