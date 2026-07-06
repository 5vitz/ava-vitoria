import os
from PIL import Image

def compile_slides_to_pdf():
    slides_dir = "/home/artz/Documentos/Antigravity/Ava-Vitoria/public/imagens/SLIDES"
    output_pdf = os.path.join(slides_dir, "apresentacao_ava.pdf")
    
    # List and sort all JPEG images in the slides directory
    files = sorted([f for f in os.listdir(slides_dir) if f.lower().endswith(('.jpg', '.jpeg'))])
    
    # Exclude any temporary or preview files if they exist there
    slides_files = [f for f in files if "slide" in f.lower()]
    
    print("Files to compile in order:")
    for f in slides_files:
        print(f"- {f}")
        
    images = []
    for f in slides_files:
        img_path = os.path.join(slides_dir, f)
        img = Image.open(img_path).convert("RGB")
        images.append(img)
        
    if images:
        # Save as PDF
        images[0].save(output_pdf, save_all=True, append_images=images[1:])
        print(f"\nPDF created successfully at: {output_pdf}")
    else:
        print("No slide images found to compile.")

if __name__ == "__main__":
    compile_slides_to_pdf()
