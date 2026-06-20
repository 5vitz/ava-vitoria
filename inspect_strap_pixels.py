import numpy as np
from PIL import Image
import rembg

model_path = "/home/artz/.gemini/antigravity/brain/8218e233-539c-4e72-898d-2e939bd66a48/media__1781249084219.jpg"
img = Image.open(model_path).convert("RGBA")
nobg = rembg.remove(img)
data = np.array(nobg)
r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]

b_safe = np.maximum(1, b)
ratio = r / b_safe
is_fabric = (ratio < 1.78) & (a > 200)

print("Sample pixels in y=370 to 440:")
for y in range(370, 440, 10):
    cols = np.where(is_fabric[y, :])[0]
    for x in cols[:5]: # print up to 5 pixels
        print(f"y={y}, x={x}: R={r[y,x]}, G={g[y,x]}, B={b[y,x]}, ratio={ratio[y,x]:.3f}")
