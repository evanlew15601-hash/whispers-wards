import type { DialogueChoice, GameState } from '../types';

/**
 * Minimal interface to allow swapping the conversation/state-transition engine.
 *
 * Today we use a TypeScript implementation backed by `src/game/data.ts`.
 * In the future, this can be implemented by a UQM-derived engine compiled to WASM.
 */
export interface ConversationEngine {
  /** Create a fresh initial state (title screen, fresh world, etc.). */
  createInitialState(): GameState;

  /** Create a fresh game state and jump into the first dialogue node. */
  startNewGame(): GameState;

  /** Apply a player choice and return the next state (pure). */
  applyChoice(prev: GameState, choice: DialogueChoice): GameState;

  /**
   * Optional post-processing step that can alter how a dialogue node is *presented*.
   *
   * Example: the UQM WASM engine uses this to enforce "response pool" semantics
   * (hide locked choices + cap to 8 visible choices) while keeping authored data
   * in `src/game/data.ts`.
   */
  presentState?(state: GameState): GameState;
}
