import numpy as np
from PIL import Image, ImageDraw
import rembg
import os

model_path = "/home/artz/.gemini/antigravity/brain/8218e233-539c-4e72-898d-2e939bd66a48/media__1781249084219.jpg"
out_debug_mask = "/home/artz/Documentos/Antigravity/Ava-Vitoria/public/imagens/debug_mask.png"

print("Step 1: Removing background in memory...")
img = Image.open(model_path).convert("RGBA")
nobg = rembg.remove(img)
data = np.array(nobg)
r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]

print("Step 2: Drawing loose polygon masks...")
# Create a grayscale image for drawing the polygon mask
poly_mask_img = Image.new("L", img.size, 0)
draw = ImageDraw.Draw(poly_mask_img)

# Loose polygon for the bikini top (covers the bust, excludes arms, neck, belly)
# Vertices:
# 1. Above left cup: (230, 440)
# 2. Above right cup: (345, 440)
# 3. Right edge of right cup/strap: (415, 520)
# 4. Bottom of right cup/back strap: (415, 555)
# 5. Bottom of left cup/back strap: (160, 555)
# 6. Left edge of left cup/strap: (160, 520)
top_poly = [(230, 440), (345, 440), (415, 520), (415, 555), (160, 555), (160, 520)]
draw.polygon(top_poly, fill=255)

# Loose polygon for the bikini bottom (covers the hips/tanga, excludes hands, belly, thighs)
# Vertices:
# 1. Top left tie area: (150, 735)
# 2. Top right tie area: (425, 735)
# 3. Right side strap/hip: (445, 765)
# 4. Groin bottom right: (330, 835)
# 5. Groin bottom left: (240, 835)
# 6. Left side strap/hip: (135, 765)
bottom_poly = [(150, 735), (425, 735), (445, 765), (330, 835), (240, 835), (135, 765)]
draw.polygon(bottom_poly, fill=255)

poly_mask = np.array(poly_mask_img) > 128

print("Step 3: Combining with R/B ratio filter...")
b_safe = np.maximum(1, b)
ratio = r / b_safe

# R/B ratio threshold is 1.78. Inside the loose polygon and body alpha.
is_bikini = (ratio < 1.78) & (a > 200) & poly_mask

# Create visualization image: white where is_bikini is True, transparent black elsewhere
viz_data = np.zeros_like(data)
viz_data[is_bikini] = (255, 255, 255, 255)
viz_data[~is_bikini] = (0, 0, 0, 100) # semi-transparent black for non-bikini areas so we can see the overlay

viz_img = Image.fromarray(viz_data)
# Let's blend it on top of the original model image to see the alignment!
blended = Image.alpha_composite(img, viz_img)

os.makedirs(os.path.dirname(out_debug_mask), exist_ok=True)
blended.save(out_debug_mask, "PNG")
print(f"Debug mask overlay saved to {out_debug_mask}")
