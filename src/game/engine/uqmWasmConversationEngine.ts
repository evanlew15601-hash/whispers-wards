import type { ConversationEngine } from './conversationEngine';

/**
 * Stub for a future UQM-derived conversation engine compiled to WebAssembly.
 *
 * We vendor a *code-only* reference snapshot of the relevant UQM comm/commglue
 * sources under `third_party/uqm/` (GPL-2.0-or-later) for future work.
 *
 * IMPORTANT: This project does not vendor or ship any UQM dialogue/content assets.
 */
export const uqmWasmConversationEngine: ConversationEngine = {
  createInitialState() {
    throw new Error('Not implemented: UQM WASM conversation engine (see third_party/uqm)');
  },
  startNewGame() {
    throw new Error('Not implemented: UQM WASM conversation engine (see third_party/uqm)');
  },
  applyChoice() {
    throw new Error('Not implemented: UQM WASM conversation engine (see third_party/uqm)');
  },
};
