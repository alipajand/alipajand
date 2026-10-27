"""Rebuild the self-hosted font files in app/fonts/ from their upstream sources.

The site renders Archivo (text and display) and Geist Mono (labels, code). Upstream ships more than
the pages use, so this script trims each file to what the design draws, without changing any glyph:

  Archivo, upright    Latin slice, wght 100-900 kept, wdth limited to 100-125 (the design only
                      widens: font-stretch 100%-125%; nothing is condensed below 100%).
  Archivo, italic     Latin slice, wght 100-900 kept, wdth pinned at its default 100 (italics are
                      only set at normal width: tickers, pull quotes and Markdown emphasis).
  Geist Mono          Latin + General Punctuation + the symbol blocks Geist Mono draws
                      (arrows, maths, box drawing, shapes, dingbats); Cyrillic, Greek and the
                      extended Latin blocks are dropped. Outlines and the wght axis are untouched.

Both limits sit on the axis default (wdth 100), so the remaining variation data is not rescaled.
The font-wide values that subsetting and instancing recalculate (head/hhea bounds and the whole
OS/2 table) are copied back from the source. No glyph depends on them, but Chrome on macOS does:
shrunken bounds change 1x anti-aliasing, and a different OS/2 average width or Unicode-range
bitmap changes which system font draws characters Archivo lacks (arrows, triangles).

Sources:
  Archivo     The Latin woff2 slices Google Fonts serves for
              https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900
              (the ones next/font/google downloaded before the fonts were self-hosted). Licence: OFL 1.1.
  Geist Mono  node_modules/geist/dist/fonts/geist-mono/GeistMono-Variable.woff2. Licence: OFL 1.1.

Usage (Python 3 with `pip install fonttools brotli`):
  python3 scripts/build-fonts.py --archivo-roman <latin.woff2> --archivo-italic <latin-italic.woff2>
"""

import argparse
import os

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "app", "fonts")
GEIST_MONO = os.path.join(ROOT, "node_modules", "geist", "dist", "fonts", "geist-mono", "GeistMono-Variable.woff2")

# Google Fonts "latin" unicode-range, plus the symbol blocks (U+2100-27FF) Geist Mono covers.
LATIN = (
    list(range(0x0000, 0x0100))
    + [0x0131, 0x0152, 0x0153, 0x02BB, 0x02BC, 0x02C6, 0x02DA, 0x02DC, 0x0304, 0x0308, 0x0329]
    + list(range(0x2000, 0x2070))
    + [0x20AC, 0x2122, 0x2191, 0x2193, 0x2212, 0x2215, 0xFEFF, 0xFFFD]
)
SYMBOLS = list(range(0x2100, 0x2800))


# Font-wide values that subsetting and instancing recalculate from the remaining glyphs.
FONT_WIDE_BOUNDS = {
    "head": ["xMin", "yMin", "xMax", "yMax"],
    "hhea": ["advanceWidthMax", "minLeftSideBearing", "minRightSideBearing", "xMaxExtent"],
}


def save(font, source_path, name):
    source = TTFont(source_path)
    for table, fields in FONT_WIDE_BOUNDS.items():
        for field in fields:
            setattr(font[table], field, getattr(source[table], field))
    font["OS/2"] = source["OS/2"]
    font.recalcBBoxes = False
    font.recalcTimestamp = False
    font.flavor = "woff2"
    path = os.path.join(OUT, name)
    font.save(path)
    print(f"{name}: {os.path.getsize(path)} bytes")


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--archivo-roman", required=True)
    parser.add_argument("--archivo-italic", required=True)
    parser.add_argument("--geist-mono", default=GEIST_MONO)
    args = parser.parse_args()

    roman = instancer.instantiateVariableFont(TTFont(args.archivo_roman), {"wdth": (100, 125)})
    save(roman, args.archivo_roman, "Archivo-Latin.woff2")
    italic = instancer.instantiateVariableFont(TTFont(args.archivo_italic), {"wdth": 100})
    save(italic, args.archivo_italic, "Archivo-Italic-Latin.woff2")

    mono = TTFont(args.geist_mono)
    options = subset.Options()
    options.layout_features = ["*"]
    options.name_IDs = ["*"]
    options.name_languages = ["*"]
    options.notdef_outline = True
    options.hinting = True
    options.glyph_names = True  # keep post format 2 like the source; format 3 changes 1x rendering
    subsetter = subset.Subsetter(options)
    subsetter.populate(unicodes=LATIN + SYMBOLS)
    subsetter.subset(mono)
    save(mono, args.geist_mono, "GeistMono-Latin.woff2")


if __name__ == "__main__":
    main()
