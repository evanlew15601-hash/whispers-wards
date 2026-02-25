(; Copyright Paul Reiche, Fred Ford. 1992-2002

   This program is free software; you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation; either version 2 of the License, or
   (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program; if not, write to the Free Software
   Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
;)

(; 
  Minimal UQM-derived WebAssembly module.

  Derived-from reference:
    third_party/uqm/sc2/src/uqm/comm.c

  This WAT module implements a small, self-contained subset of the logic of
  getLineWithinWidth() in a simplified monospace model.

  Exports:
    - memory
    - uqm_alloc (bump allocator)
    - uqm_version_ptr / uqm_version_len
    - uqm_line_fit_chars(ptr, maxWidth) -> number of characters that fit
      in maxWidth columns without breaking a word.
;)

(module
  (memory (export "memory") 2)

  ;; Bump allocator pointer (byte offset)
  (global $heap_ptr (mut i32) (i32.const 8192))

  (data (i32.const 1024) "UQM minimal wasm (derived from comm.c)")

  (func (export "uqm_version_ptr") (result i32)
    (i32.const 1024)
  )

  (func (export "uqm_version_len") (result i32)
    ;; length of the string above (no null terminator)
    (i32.const 38)
  )

  ;; uint32_t uqm_alloc(uint32_t size)
  (func (export "uqm_alloc") (param $size i32) (result i32)
    (local $p i32)
    (local.set $p (global.get $heap_ptr))

    ;; heap_ptr = align8(heap_ptr + size)
    (global.set $heap_ptr
      (i32.and
        (i32.add
          (i32.add (local.get $p) (local.get $size))
          (i32.const 7)
        )
        (i32.const -8)
      )
    )

    (local.get $p)
  )

  ;; Helper: load byte at ptr
  (func $load8 (param $p i32) (result i32)
    (i32.load8_u (local.get $p))
  )

  ;; uint32_t uqm_line_fit_chars(const char* str, uint32_t maxWidth)
  (func (export "uqm_line_fit_chars") (param $str i32) (param $maxWidth i32) (result i32)
    (local $p i32)
    (local $count i32)
    (local $wordStart i32)
    (local $wordLen i32)
    (local $c i32)
    (local $tentative i32)

    (local.set $p (local.get $str))
    (local.set $count (i32.const 0))

    (block $done
      (loop $outer
        ;; Start scanning next word
        (local.set $wordStart (local.get $p))
        (local.set $wordLen (i32.const 0))

        ;; Scan a word (until space/newline/NUL)
        (block $wordBreak
          (loop $scan
            (local.set $c (call $load8 (local.get $p)))

            ;; End-of-string or newline => return count + wordLen (if fits)
            (if (i32.eqz (local.get $c))
              (then (br $wordBreak))
            )
            (if (i32.eq (local.get $c) (i32.const 10))
              (then (br $wordBreak))
            )
            (if (i32.eq (local.get $c) (i32.const 13))
              (then (br $wordBreak))
            )

            ;; Space ends word
            (if (i32.eq (local.get $c) (i32.const 32))
              (then (br $wordBreak))
            )

            ;; Consume char
            (local.set $p (i32.add (local.get $p) (i32.const 1)))
            (local.set $wordLen (i32.add (local.get $wordLen) (i32.const 1)))
            (br $scan)
          )
        )

        ;; tentative = count + wordLen
        (local.set $tentative (i32.add (local.get $count) (local.get $wordLen)))

        ;; If tentative width >= maxWidth, do not include this word.
        (if (i32.ge_u (local.get $tentative) (local.get $maxWidth))
          (then (return (local.get $count)))
        )

        ;; Accept this word
        (local.set $count (local.get $tentative))

        ;; Check terminator/newline/CR after word scan
        (local.set $c (call $load8 (local.get $p)))
        (if (i32.eqz (local.get $c))
          (then (return (local.get $tentative)))
        )
        (if (i32.eq (local.get $c) (i32.const 10))
          (then (return (local.get $tentative)))
        )
        (if (i32.eq (local.get $c) (i32.const 13))
          (then (return (local.get $tentative)))
        )

        ;; If we ended on a space, include it as inter-word spacing (if it fits).
        (if (i32.eq (local.get $c) (i32.const 32))
          (then
            ;; include the space
            (local.set $tentative (i32.add (local.get $tentative) (i32.const 1)))
            (if (i32.ge_u (local.get $tentative) (local.get $maxWidth))
              (then (return (local.get $count)))
            )
            (local.set $count (local.get $tentative))
            (local.set $p (i32.add (local.get $p) (i32.const 1)))
            (br $outer)
          )
        )

        ;; Fallback: unknown delimiter, stop
        (return (local.get $tentative))
      )
    )

    (local.get $count)
  )
)
