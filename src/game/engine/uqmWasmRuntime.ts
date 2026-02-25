export type UqmWasmExports = {
  memory: WebAssembly.Memory;
  uqm_alloc: (size: number) => number;
  uqm_version_ptr: () => number;
  uqm_version_len: () => number;
  uqm_line_fit_chars: (strPtr: number, maxWidth: number) => number;
};

export type UqmWasmRuntime = {
  getVersionString: () => string;
  lineFitChars: (text: string, maxWidth: number) => number;
};

let cached: Promise<UqmWasmRuntime> | null = null;

function getExports(instance: WebAssembly.Instance): UqmWasmExports {
  const raw = instance.exports as unknown as Record<string, unknown>;

  const memory = (raw.memory ?? raw.wasmMemory ?? raw._memory) as WebAssembly.Memory | undefined;
  const uqm_alloc = (raw.uqm_alloc ?? raw._uqm_alloc) as
    | ((size: number) => number)
    | undefined;
  const uqm_version_ptr = (raw.uqm_version_ptr ?? raw.uqm_version ?? raw._uqm_version_ptr ?? raw._uqm_version) as
    | (() => number)
    | undefined;
  const uqm_version_len = (raw.uqm_version_len ?? raw._uqm_version_len) as
    | (() => number)
    | undefined;
  const uqm_line_fit_chars = (raw.uqm_line_fit_chars ?? raw._uqm_line_fit_chars) as
    | ((strPtr: number, maxWidth: number) => number)
    | undefined;

  if (!memory || !uqm_alloc || !uqm_version_ptr || !uqm_version_len || !uqm_line_fit_chars) {
    throw new Error('UQM wasm module exports missing expected symbols');
  }

  return {
    memory,
    uqm_alloc,
    uqm_version_ptr,
    uqm_version_len,
    uqm_line_fit_chars,
  };
}

async function instantiateUqmWasm(): Promise<UqmWasmRuntime> {
  const wasmUrl = `${import.meta.env.BASE_URL}wasm/uqm_minimal.wasm`;

  const response = await fetch(wasmUrl);
  if (!response.ok) {
    throw new Error(`Failed to load UQM wasm: ${response.status} ${response.statusText}`);
  }

  let instance: WebAssembly.Instance;
  if ('instantiateStreaming' in WebAssembly) {
    try {
      const res = await WebAssembly.instantiateStreaming(response, {});
      instance = res.instance;
    } catch {
      const bytes = await (await fetch(wasmUrl)).arrayBuffer();
      const res = await WebAssembly.instantiate(bytes, {});
      instance = res.instance;
    }
  } else {
    const bytes = await response.arrayBuffer();
    const res = await WebAssembly.instantiate(bytes, {});
    instance = res.instance;
  }

  const exports = getExports(instance);
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  return {
    getVersionString() {
      const ptr = exports.uqm_version_ptr();
      const len = exports.uqm_version_len();
      return decoder.decode(new Uint8Array(exports.memory.buffer, ptr, len));
    },
    lineFitChars(text, maxWidth) {
      const bytes = encoder.encode(text);
      const ptr = exports.uqm_alloc(bytes.length + 1);
      const mem = new Uint8Array(exports.memory.buffer, ptr, bytes.length + 1);
      mem.set(bytes);
      mem[bytes.length] = 0;
      return exports.uqm_line_fit_chars(ptr, maxWidth);
    },
  };
}

export function loadUqmWasmRuntime(): Promise<UqmWasmRuntime> {
  if (!cached) cached = instantiateUqmWasm();
  return cached;
}
