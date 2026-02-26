# Agent Notes

- UQM WASM build strategy: Option 1.
  - Prefer system toolchains (zig/clang/emcc) when present.
  - Always keep wabt/WAT fallback for zero-native-deps builds.
