import { describe, expect, it } from 'vitest';

import { loadUqmMinimalWasmExports } from './uqmWasmTestUtils';

describe('UQM minimal wasm build artifact', () => {
  it(
    'exposes expected exports (including conversation core)',
    async () => {
      const exp = await loadUqmMinimalWasmExports();

      expect(exp.memory).toBeInstanceOf(WebAssembly.Memory);
      expect(typeof exp.uqm_alloc).toBe('function');
      expect(typeof exp.uqm_alloc_mark).toBe('function');
      expect(typeof exp.uqm_alloc_reset).toBe('function');
      expect(typeof exp.uqm_version_ptr).toBe('function');
      expect(typeof exp.uqm_version_len).toBe('function');
      expect(typeof exp.uqm_line_fit_chars).toBe('function');
      expect(typeof exp.uqm_construct_response).toBe('function');

      expect(typeof exp.uqm_conv_reset).toBe('function');
      expect(typeof exp.uqm_conv_set_graph).toBe('function');
      expect(typeof exp.uqm_conv_get_current_node).toBe('function');
      expect(typeof exp.uqm_conv_get_rep).toBe('function');
      expect(typeof exp.uqm_conv_get_secrets).toBe('function');
      expect(typeof exp.uqm_conv_get_choice_count).toBe('function');
      expect(typeof exp.uqm_conv_choice_is_locked).toBe('function');
      expect(typeof exp.uqm_conv_get_available_choice_count).toBe('function');
      expect(typeof exp.uqm_conv_get_available_choice_local_index).toBe('function');
      expect(typeof exp.uqm_conv_choose_available).toBe('function');
      expect(typeof exp.uqm_conv_choose).toBe('function');
    },
    60_000,
  );

  it(
    'line-fit demo behaves reasonably',
    async () => {
      const exp = await loadUqmMinimalWasmExports();

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
    },
    60_000,
  );

  it(
    'construct-response concatenates a NULL-terminated pointer list into an output buffer',
    async () => {
      const exp = await loadUqmMinimalWasmExports();

      const enc = new TextEncoder();
      const dec = new TextDecoder();

      function writeCString(s: string): number {
        const bytes = enc.encode(s);
        const ptr = exp.uqm_alloc(bytes.length + 1);
        const mem = new Uint8Array(exp.memory.buffer, ptr, bytes.length + 1);
        mem.set(bytes);
        mem[bytes.length] = 0;
        return ptr;
      }

      const helloPtr = writeCString('Hello');
      const spacePtr = writeCString(' ');
      const worldPtr = writeCString('world');

      const partsPtr = exp.uqm_alloc(4 * 4);
      const parts = new Uint32Array(exp.memory.buffer, partsPtr, 4);
      parts[0] = helloPtr;
      parts[1] = spacePtr;
      parts[2] = worldPtr;
      parts[3] = 0;

      const outCap = 64;
      const outPtr = exp.uqm_alloc(outCap);

      const written = exp.uqm_construct_response(outPtr, outCap, partsPtr);
      expect(written).toBe(11);

      const out = new Uint8Array(exp.memory.buffer, outPtr, outCap);
      expect(out[written]).toBe(0);

      const s = dec.decode(out.subarray(0, written));
      expect(s).toBe('Hello world');
    },
    60_000,
  );
});
