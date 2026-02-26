import { loadUqmWasmRuntime } from './uqmWasmRuntime';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

type ConstructResponseFn = (outPtr: number, outCap: number, partsPtr: number) => number;

export async function constructResponseUqm(parts: string[]): Promise<string> {
  try {
    const uqm = await loadUqmWasmRuntime();

    const exp = uqm.exports;
    const fn: ConstructResponseFn = exp.uqm_construct_response;

    const mark = exp.uqm_alloc_mark();
    try {
      const partPtrs: number[] = [];
      let totalBytes = 0;

      for (const part of parts) {
        const bytes = encoder.encode(part);
        totalBytes += bytes.length;

        const ptr = exp.uqm_alloc(bytes.length + 1);
        const mem = new Uint8Array(exp.memory.buffer, ptr, bytes.length + 1);
        mem.set(bytes);
        mem[bytes.length] = 0;

        partPtrs.push(ptr);
      }

      const partsArrPtr = exp.uqm_alloc((partPtrs.length + 1) * 4);
      {
        const partsArr = new Uint32Array(exp.memory.buffer, partsArrPtr, partPtrs.length + 1);
        for (let i = 0; i < partPtrs.length; i++) partsArr[i] = partPtrs[i] >>> 0;
        partsArr[partPtrs.length] = 0;
      }

      const outCap = totalBytes + 1;
      const outPtr = exp.uqm_alloc(outCap);

      // Ensure a terminator exists even if the wasm side fails to write anything.
      {
        const out = new Uint8Array(exp.memory.buffer, outPtr, outCap);
        out[0] = 0;
        out[outCap - 1] = 0;
      }

      const writtenRaw = fn(outPtr, outCap, partsArrPtr);

      // Re-create the view after the call in case the wasm runtime grew memory.
      const outAfter = new Uint8Array(exp.memory.buffer, outPtr, outCap);

      const writtenU32 = writtenRaw >>> 0;
      let written = Number.isFinite(writtenRaw) ? Math.floor(writtenU32) : -1;
      if (written < 0 || written >= outCap) {
        written = 0;
        while (written < outCap && outAfter[written] !== 0) written++;
      } else if (written === 0 && outAfter[0] !== 0) {
        while (written < outCap && outAfter[written] !== 0) written++;
      }

      return decoder.decode(outAfter.subarray(0, written));
    } finally {
      exp.uqm_alloc_reset(mark);
    }
  } catch {
    return parts.join('');
  }
}
