# The Ur-Quan Masters (UQM) - vendored engine code (no content)

This directory vendors a small subset of The Ur-Quan Masters (UQM) engine **source code** from:

- https://github.com/juj/sc2-uqm (master)

## Licensing

- The UQM **engine code** is licensed under **GPL-2.0-or-later**.
- The original UQM **game content** (voiceovers, dialogue, graphics, sounds, music, etc.) is licensed under **CC BY-NC-SA 2.5** (see upstream `COPYING`).

This repository intentionally vendors **engine code only**.

## Explicitly not included

We do **not** vendor or ship any UQM content/dialogue assets (including race scripts, strings, voice, images, sounds, music, or other packaged content). Only C source files required as a reference for future integration are present.

## What is vendored

- `sc2/src/uqm/comm.c`
- `sc2/src/uqm/comm.h`
- `sc2/src/uqm/commglue.c`
- `sc2/src/uqm/commglue.h`
- `sc2/src/uqm/cnctdlg.c`
- `sc2/src/uqm/cnctdlg.h`

## Upstream license text

See `third_party/uqm/COPYING` for the upstream UQM licensing text as distributed with the project.
