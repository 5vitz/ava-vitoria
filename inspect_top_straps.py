import numpy as np
from PIL import Image
import rembg

model_path = "/home/artz/.gemini/antigravity/brain/8218e233-539c-4e72-898d-2e939bd66a48/media__1781249084219.jpg"
img = Image.open(model_path).convert("RGBA")
nobg = rembg.remove(img)
data = np.array(nobg)
r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]

# Check where R/B < 1.78 and a > 200 in the range y=370 to 450
b_safe = np.maximum(1, b)
ratio = r / b_safe
is_fabric = (ratio < 1.78) & (a > 200)

print("Fabric pixels in y=370 to 450:")
for y in range(370, 450, 5):
    cols = np.where(is_fabric[y, :])[0]
    if len(cols) > 0:
        print(f"y={y}: cols={cols.min()}-{cols.max()} (count={len(cols)})")
