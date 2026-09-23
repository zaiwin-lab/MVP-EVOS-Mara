#!/usr/bin/env python3
"""Prepare the certificate artwork for the website.

The supplied file is 1491x1055, which is about 127 DPI on an A4 landscape
sheet. The name and organisation the site prints over it are live text, drawn
at the device's own resolution, so on a retina screen or on paper the two do
not match: the typed lines are sharp and the artwork behind them is soft.

This resamples the artwork so the two sit at a comparable resolution. It adds
no detail that was not there — only a re-export from the original design file
at 300 DPI (3508x2480) can do that — but it removes the browser's own naive
upscaling and restores the edge definition that the WebP compression softened.

    python3 scripts/prepare-certificate-artwork.py <source> [output]

Defaults to public/sijil.jpg.
"""
import sys, os
from PIL import Image, ImageFilter
import numpy as np

# 2x the source. That lands at 255 DPI on A4, which is enough for print and
# for any phone; going further only grows the file, since the detail to
# support 300 DPI is not in the source to begin with.
SCALE = 2.0
SHARPEN = dict(radius=1.6, percent=50, threshold=3)
QUALITY = 90

def to_linear(a):
    a = a / 255.0
    return np.where(a <= 0.04045, a / 12.92, ((a + 0.055) / 1.055) ** 2.4)

def to_srgb(a):
    a = np.clip(a, 0.0, 1.0)
    return np.where(a <= 0.0031308, a * 12.92, 1.055 * a ** (1 / 2.4) - 0.055) * 255.0

def main(src_path, out_path):
    src = Image.open(src_path).convert("RGB")
    w, h = src.size
    tw, th = round(w * SCALE), round(h * SCALE)

    # Resample in linear light. Antialiased text edges then keep their weight
    # instead of darkening, which is what makes a naive upscale look muddy.
    lin = to_linear(np.asarray(src, dtype=np.float64))
    out = np.zeros((th, tw, 3))
    for c in range(3):
        channel = Image.fromarray(lin[:, :, c].astype(np.float32), mode="F")
        out[:, :, c] = np.asarray(channel.resize((tw, th), Image.LANCZOS), dtype=np.float64)

    img = Image.fromarray(to_srgb(out).round().astype(np.uint8), "RGB")
    img = img.filter(ImageFilter.UnsharpMask(**SHARPEN))

    # subsampling=0 keeps full chroma resolution. The sheet is thin gold rules
    # and coloured text on white, which 4:2:0 smears.
    img.save(out_path, quality=QUALITY, optimize=True, progressive=True, subsampling=0)

    print(f"{src_path} {w}x{h} -> {out_path} {tw}x{th}"
          f"  ({round(os.path.getsize(out_path)/1024)} KB, "
          f"{round(tw / (297/25.4))} DPI on A4 landscape)")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else "public/sijil.jpg")
