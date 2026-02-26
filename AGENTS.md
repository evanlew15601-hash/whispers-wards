# Agent Notes

- UQM WASM build strategy: Option 1.
  - Prefer system toolchains (zig/clang/emcc) when present.
  - Always keep wabt/WAT fallback for zero-native-deps builds.

- Conversation engine direction: Option B.
  - Implement UQM-style response pool helpers in the minimal wasm core (available responses only, max 8).
  - Presentation layer can hide locked responses when running on the wasm engine.
