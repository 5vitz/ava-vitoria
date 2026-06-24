import numpy as np
from PIL import Image

def main():
    img_path = "/home/artz/Documentos/Antigravity/Ava-Vitoria/public/imagens/colecao/Prontas/AvaCrew/Costas_cropped.jpeg"
    img = Image.open(img_path)
    W, H = img.size
    print(f"Cropped image size: {W}x{H}")
    img_data = np.array(img.convert("RGB"))
    
    stripe_x0 = W // 2 - 10
    stripe_x1 = W // 2 + 10
    
    print("First 10 rows of cropped image:")
    for y in range(10):
        row_stripe = img_data[y, stripe_x0:stripe_x1]
        max_val = np.max(row_stripe)
        print(f"Row Y={y:02d}: max_val={max_val} (RGB: {np.max(row_stripe[:,0])}, {np.max(row_stripe[:,1])}, {np.max(row_stripe[:,2])})")

if __name__ == "__main__":
    main()
