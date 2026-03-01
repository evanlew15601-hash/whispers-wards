# Crown & Concord

A small, dialogue-driven browser game about high-fantasy diplomacy, built with Vite + React + TypeScript.

## License

- **This repository** is licensed under **GPL-2.0-or-later** (see `LICENSE`).
- **Vendored upstream code**: `third_party/uqm` contains a small subset of The Ur-Quan Masters (UQM) **engine source code**. It remains under its upstream **GPL-2.0-or-later** licensing; see `third_party/uqm/COPYING`.
- **No UQM content**: this repo does **not** include any UQM lore/dialogue or other game assets/content.

## Development

```sh
npm install
npm run dev
npm run test
npm run build
```

## Deployment (static hosting)

This is a Vite app — you must deploy the **built** output, not the repository root.

- Build command: `npm run build`
- Publish directory: `dist/`

If you deploy the repo root (with `src/`), the site will render a "Loading…" screen forever because `/src/main.tsx` is not compiled.

### UQM WASM demo

This repo includes a tiny **UQM-derived** WebAssembly module (derived from `third_party/uqm/sc2/src/uqm/comm.c`) used as a runtime proof that we can execute UQM-originating code in-browser.

- The `.wasm` file is generated into `public/wasm/uqm_minimal.wasm`.
- On `npm run dev` / `npm run build` we *attempt* to build it first. If the WASM build fails (common in restricted hosted environments), the build continues and the app falls back to the TypeScript conversation engine.
- On `npm test`, the WASM build is treated as required so CI catches regressions.
- No system C toolchain is required: if `clang`/`emcc` aren’t available, the build falls back to compiling `third_party/uqm/minimal_wasm/uqm_min.wat` using the `wabt` npm package.
