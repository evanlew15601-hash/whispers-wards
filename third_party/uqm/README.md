# The Ur-Quan Masters (UQM) - vendored engine code (no content)

This directory vendors a small subset of The Ur-Quan Masters (UQM) engine **source code** from:

- https://github.com/juj/sc2-uqm
  - Snapshot: `ff2444088d42e80612fd28f79d368783e244a606` (master)

The upstream snapshot files under `sc2/src/uqm/` are copied verbatim and retain their original upstream file headers.
Any locally-modified derivative code is listed explicitly below.

## Licensing

- The UQM **engine code** is licensed under **GPL-2.0-or-later**.
- The original UQM **game content** (voiceovers, dialogue, graphics, sounds, music, etc.) is licensed under **CC BY-NC-SA 2.5** (see upstream `COPYING`).

This repository intentionally vendors **engine code only**.

## Explicitly not included

We do **not** vendor or ship any UQM content/dialogue assets (including race scripts, strings, voice, images, sounds, music, or other packaged content).

## What is vendored

### Verbatim upstream engine files

- `sc2/src/uqm/comm.c`
  - https://github.com/juj/sc2-uqm/blob/ff2444088d42e80612fd28f79d368783e244a606/sc2/src/uqm/comm.c
- `sc2/src/uqm/comm.h`
  - https://github.com/juj/sc2-uqm/blob/ff2444088d42e80612fd28f79d368783e244a606/sc2/src/uqm/comm.h
- `sc2/src/uqm/commglue.c`
  - https://github.com/juj/sc2-uqm/blob/ff2444088d42e80612fd28f79d368783e244a606/sc2/src/uqm/commglue.c
- `sc2/src/uqm/commglue.h`
  - https://github.com/juj/sc2-uqm/blob/ff2444088d42e80612fd28f79d368783e244a606/sc2/src/uqm/commglue.h
- `sc2/src/uqm/cnctdlg.c`
  - https://github.com/juj/sc2-uqm/blob/ff2444088d42e80612fd28f79d368783e244a606/sc2/src/uqm/cnctdlg.c
- `sc2/src/uqm/cnctdlg.h`
  - https://github.com/juj/sc2-uqm/blob/ff2444088d42e80612fd28f79d368783e244a606/sc2/src/uqm/cnctdlg.h

### Minimal runtime demo (UQM-derived)

This repo also includes a tiny, self-contained module under `minimal_wasm/` which is **derived from** the `comm.c` conversation sizing logic (not a verbatim copy), and is used to compile a small WebAssembly module for an in-app runtime demo.

- `minimal_wasm/uqm_min.c` (derived)
- `minimal_wasm/uqm_min.wat` (derived)

## Upstream license text

See `third_party/uqm/COPYING` for the upstream UQM licensing text as distributed with the project.
