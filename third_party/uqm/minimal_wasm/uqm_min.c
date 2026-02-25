//Copyright Paul Reiche, Fred Ford. 1992-2002

/*
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program; if not, write to the Free Software
 *  Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
 */

/*
 * Minimal UQM-derived WebAssembly compilation unit.
 *
 * This file includes code derived from:
 *   third_party/uqm/sc2/src/uqm/comm.c
 *
 * Specifically, it includes a lightly-adapted version of:
 *   BOOLEAN getLineWithinWidth(TEXT *pText, const char **startNext,
 *         SIZE maxWidth, COUNT maxChars);
 *
 * Changes from upstream:
 * - Replaced UQM engine dependencies (graphics/font metrics, UTF-8 helpers)
 *   with tiny stubs that treat width in monospace "character columns".
 * - Added a tiny bump allocator and version string exports so JS can call
 *   into this module in-browser.
 */

#include <stdint.h>
#include <stddef.h>

typedef uint32_t COUNT;
typedef int32_t SIZE;
typedef int BOOLEAN;
typedef uint32_t UniChar;

typedef struct
{
	struct { int32_t x, y; } corner;
	struct { uint32_t width, height; } extent;
} RECT;

typedef struct
{
	const char *pStr;
	COUNT CharCount;
} TEXT;

static UniChar
getCharFromString (const char **pptr)
{
	unsigned char c = (unsigned char) **pptr;
	if (c == '\0')
		return 0;
	(*pptr)++;
	return (UniChar) c;
}

static void
TextRect (TEXT *pText, RECT *rect, void *unused)
{
	rect->corner.x = 0;
	rect->corner.y = 0;
	rect->extent.width = (uint32_t) pText->CharCount;
	rect->extent.height = 1;
	(void) unused;
}

// This function calculates how much of a string can be fitted within
// a specific width, up to a newline or terminating \0.
// pText is the text to be fitted. pText->CharCount will be set to the
// number of characters that fitted.
// startNext will be filled with the start of the first word that
// doesn't fit in one line, or if an entire line fits, to the character
// past the newline, or if the entire string fits, to the end of the
// string.
// maxWidth is the maximum number of pixels that a line may be wide
//   ASSUMPTION: there are no words in the text wider than maxWidth
// maxChars is the maximum number of characters (not bytes) that are to
// be fitted.
// TRUE is returned if a complete line fitted
// FALSE otherwise
BOOLEAN
getLineWithinWidth(TEXT *pText, const char **startNext,
		SIZE maxWidth, COUNT maxChars)
{
	BOOLEAN eol;
			// The end of the line of text has been reached.
	BOOLEAN done;
			// We cannot add any more words.
	RECT rect;
	COUNT oldCount;
	const char *ptr;
	const char *wordStart;
	UniChar ch;
	COUNT charCount;

	//GetContextClipRect (&rect);

	eol = 0;
	done = 0;
	oldCount = 1;
	charCount = 0;
	ch = '\0';
	ptr = pText->pStr;
	for (;;)
	{
		wordStart = ptr;

		// Scan one word.
		for (;;)
		{
			if (*ptr == '\0')
			{
				eol = 1;
				done = 1;
				break;
			}
			ch = getCharFromString (&ptr);
			eol = ch == '\0' || ch == '\n' || ch == '\r';
			done = eol || charCount >= maxChars;
			if (done || ch == ' ')
				break;
			charCount++;
		}

		oldCount = pText->CharCount;
		pText->CharCount = charCount;
		TextRect (pText, &rect, NULL);

		if ((SIZE) rect.extent.width >= maxWidth)
		{
			pText->CharCount = oldCount;
			*startNext = wordStart;
			return 0;
		}

		if (done)
		{
			*startNext = ptr;
			return eol;
		}
		charCount++;
				// For the space in between words.
	}
}

static const uint8_t UQM_VERSION[] =
		"UQM minimal wasm (derived from comm.c)";

uint32_t
uqm_version (void)
{
	return (uint32_t) (uintptr_t) UQM_VERSION;
}

uint32_t
uqm_version_ptr (void)
{
	return uqm_version ();
}

uint32_t
uqm_version_len (void)
{
	return (uint32_t) (sizeof (UQM_VERSION) - 1);
}

extern uint8_t __heap_base;
static uint32_t heap_ptr;

uint32_t
uqm_alloc (uint32_t size)
{
	uint32_t p;

	if (heap_ptr == 0)
		heap_ptr = (uint32_t) (uintptr_t) &__heap_base;

	p = heap_ptr;
	heap_ptr = (p + size + 7u) & ~7u;
	return p;
}

uint32_t
uqm_line_fit_chars (const char *str, uint32_t maxWidth)
{
	TEXT t;
	const char *next = NULL;

	t.pStr = str;
	t.CharCount = 0;
	getLineWithinWidth (&t, &next, (SIZE) maxWidth, (COUNT) ~0u);
	return t.CharCount;
}
