"""
Social share card (1200x630).

Rendered rather than photographed: the brand is typographic now, so the card
is the wordmark at poster scale on the site's own navy, with the same gold
carried by "& AI". No logo, matching the header and footer.
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1200, 630
NAVY   = (10, 20, 40)
GOLD   = (217, 173, 69)
WHITE  = (255, 255, 255)
DIM    = (255, 255, 255, 110)

B = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
R = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
f = lambda p, s: ImageFont.truetype(p, s)

img = Image.new("RGB", (W, H), NAVY)
d = ImageDraw.Draw(img)

# A faint warm bloom top-right, so the flat navy has some depth.
glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
gd = ImageDraw.Draw(glow)
for i in range(70, 0, -1):
    a = int(10 * (i / 70) ** 2)
    gd.ellipse([W - 120 - i * 9, -260 - i * 5, W + 240 + i * 9, 200 + i * 5],
               fill=(217, 173, 69, a))
glow = glow.filter(ImageFilter.GaussianBlur(90))
img = Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB")
d = ImageDraw.Draw(img)

PAD = 82

# Top rule + eyebrow
d.line([(PAD, 96), (PAD + 54, 96)], fill=GOLD, width=3)
d.text((PAD + 70, 96), "PROGRAMOS LITE", font=f(B, 19), fill=(255, 255, 255), anchor="lm")

# Wordmark — "Digital " white, "& AI" gold, set as one line.
fw = f(B, 118)
x, y = PAD, 200
d.text((x, y), "Digital ", font=fw, fill=WHITE, anchor="ls")
x += d.textlength("Digital ", font=fw)
d.text((x, y), "& AI", font=fw, fill=GOLD, anchor="ls")

# Tracked sub-line, letter-spaced by hand (PIL has no tracking).
sub, fs, tx = "UNTUK KOPERASI", f(B, 30), PAD
for ch in sub:
    d.text((tx, 250), ch, font=fs, fill=(255, 255, 255), anchor="lt")
    tx += d.textlength(ch, font=fs) + 7.5

# Divider
d.line([(PAD, 352), (W - PAD, 352)], fill=(255, 255, 255, 255), width=1)
d.line([(PAD, 352), (PAD + 120, 352)], fill=GOLD, width=2)

# Event particulars
d.text((PAD, 392), "Transformasi Digital & AI untuk Koperasi",
       font=f(B, 37), fill=WHITE, anchor="lt")
d.text((PAD, 448), "24 September 2026  ·  8:30 AM – 5:00 PM",
       font=f(R, 27), fill=(198, 208, 224), anchor="lt")
d.text((PAD, 487), "Hotel Serapi, Kuching",
       font=f(R, 27), fill=(198, 208, 224), anchor="lt")

# Organisers, named once, as on the site.
d.text((PAD, 560), "ANGKASA  ·  KOBIS BERHAD  ·  SDEC",
       font=f(B, 20), fill=(150, 165, 190), anchor="lt")

img.save("public/og-card.jpg", "JPEG", quality=92, subsampling=0, optimize=True)
print("wrote public/og-card.jpg", img.size)
