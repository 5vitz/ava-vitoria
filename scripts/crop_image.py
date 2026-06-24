import os
import numpy as np
from PIL import Image

def main():
    img_path = "/home/artz/Documentos/Antigravity/Ava-Vitoria/public/imagens/colecao/Prontas/AvaCrew/Costas.jpeg"
    out_path = "/home/artz/Documentos/Antigravity/Ava-Vitoria/public/imagens/colecao/Prontas/AvaCrew/Costas_cropped.jpeg"
    
    if not os.path.exists(img_path):
        print(f"Error: File not found at {img_path}")
        return
        
    img = Image.open(img_path)
    W, H = img.size
    print(f"Original image size: {W}x{H}")
    
    img_data = np.array(img.convert("RGB"))
    
    # Scan middle column to find top of head
    # We scan a narrow vertical stripe around W // 2
    stripe_x0 = W // 2 - 10
    stripe_x1 = W // 2 + 10
    
    y_head = None
    threshold = 40
    consecutive_needed = 3
    consecutive_count = 0
    
    for y in range(H):
        row_stripe = img_data[y, stripe_x0:stripe_x1]
        max_val = np.max(row_stripe)
        if max_val > threshold:
            consecutive_count += 1
            if consecutive_count >= consecutive_needed:
                y_head = y - consecutive_needed + 1
                break
        else:
            consecutive_count = 0
            
    if y_head is None:
        print("Warning: Top of the head not found, defaulting to y=0")
        y_head = 0
    else:
        print(f"Top of the head detected at y = {y_head}")
        
    # Apply rule: start 20px above y_head
    y_start = max(0, y_head - 20)
    print(f"Applying rule (y_head - 20px): y_start = {y_start}")
    
    # 48% Zoom: crop height is 48% of H
    crop_height = int(H * 0.48)
    crop_width = int(crop_height * 9 / 16)
    
    x_start = (W - crop_width) // 2
    x_end = x_start + crop_width
    y_end = y_start + crop_height
    
    # Adjust boundaries if they exceed image limits
    if y_end > H:
        print(f"Adjusting: crop box exceeded bottom of image. Shifting Y up.")
        y_start = H - crop_height
        y_end = H
        
    print(f"Crop box: X[{x_start}:{x_end}], Y[{y_start}:{y_end}]")
    print(f"Cropped image size: {crop_width}x{crop_height} (Aspect ratio: {crop_width/crop_height:.4f})")
    
    img_cropped = img.crop((x_start, y_start, x_end, y_end))
    img_cropped.save(out_path, "JPEG", quality=95)
    print(f"Cropped image saved successfully to {out_path}")

if __name__ == "__main__":
    main()
