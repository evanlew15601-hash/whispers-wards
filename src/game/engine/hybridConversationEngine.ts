import type { ConversationEngine } from './conversationEngine';
import type { UqmWasmRuntime } from './uqmWasmRuntime';

import { createInkConversationEngine } from './inkConversationEngine';
import { tsConversationEngine } from './tsConversationEngine';
import { createUqmWasmConversationEngine } from './uqmWasmConversationEngine';

export function createHybridConversationEngine(uqm: UqmWasmRuntime | null): ConversationEngine {
  if (!uqm) return createInkConversationEngine(tsConversationEngine);

  const wasmEngine = createUqmWasmConversationEngine(uqm);
  return createInkConversationEngine(wasmEngine);
}

export const getHybridEngineLabel = (uqmLoaded: boolean) => (uqmLoaded ? 'Ink + WASM' : 'Ink (TS)');
