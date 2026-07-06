import os
from PIL import Image, ImageFilter, ImageEnhance

def enhance_image(input_path, output_path):
    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found.")
        return
        
    img = Image.open(input_path)
    
    # 1. Apply a subtle Unsharp Mask to highlight fabric weaves and hair strands
    # radius=2 controls the width of edges, percent=150 is the strength, threshold=3 avoids sharpening flat areas
    sharpened = img.filter(ImageFilter.UnsharpMask(radius=1.5, percent=130, threshold=2))
    
    # 2. Slightly boost contrast and details
    contrast_enhancer = ImageEnhance.Contrast(sharpened)
    enhanced = contrast_enhancer.enhance(1.05) # Subtle 5% boost for texture depth
    
    # Save with maximum quality (no compression artifacts)
    enhanced.save(output_path, "JPEG", quality=100, subsampling=0)
    print(f"Enhanced image saved to: {output_path}")

def main():
    base_dir = "/home/artz/Documentos/Antigravity/Ava-Vitoria/public/referencias"
    
    # Boy
    boy_in = os.path.join(base_dir, "Menino/Menino.png_202607010014.jpeg")
    boy_out = os.path.join(base_dir, "Menino/Menino_base_4k.jpg")
    enhance_image(boy_in, boy_out)
    
    # Girl
    girl_in = os.path.join(base_dir, "Menina/Menina.png_202607010042.jpeg")
    girl_out = os.path.join(base_dir, "Menina/Menina_base_4k.jpg")
    enhance_image(girl_in, girl_out)

if __name__ == "__main__":
    main()
