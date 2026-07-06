import os
from PIL import Image, ImageDraw, ImageFont, ImageOps

def generate_cover():
    # Paths
    project_root = "/home/artz/Documentos/Antigravity/Ava-Vitoria"
    logo_path = os.path.join(project_root, "public/imagens/LOGO/SELO AVA PRETO-100.jpg")
    font_vix_path = os.path.join(project_root, "public/brave-ember-font/brave-ember.otf")
    font_poppins_path = os.path.join(project_root, "public/fonts/Poppins-ExtraLight.ttf")
    output_path = os.path.join(project_root, "public/imagens/SLIDES/01 - slide_capa.jpg")
    preview_path = os.path.join(project_root, "public/imagens/slide_capa_preview.jpg")
    
    # 1. Create a blank BLACK image 1366x768 (Dark theme)
    width, height = 1366, 768
    slide = Image.new("RGB", (width, height), "black")
    draw = ImageDraw.Draw(slide)
    
    # 2. Load the logo and make background transparent, projection in WHITE
    if os.path.exists(logo_path):
        logo_orig = Image.open(logo_path)
        
        # Convert to grayscale and invert
        logo_gray = logo_orig.convert("L")
        logo_inverted = ImageOps.invert(logo_gray)
        
        # Smooth lookup table for alpha channel
        lut = []
        for i in range(256):
            if i < 50:
                lut.append(0)
            elif i > 200:
                lut.append(255)
            else:
                lut.append(int((i - 50) * 255 / 150))
                
        alpha_mask = logo_inverted.point(lut)
        
        # Create transparent logo in WHITE color (255, 255, 255)
        transparent_logo = Image.new("RGBA", logo_orig.size, (255, 255, 255, 255))
        transparent_logo.putalpha(alpha_mask)
        
        # Scale logo size down to 160x160
        logo = transparent_logo.resize((160, 160), Image.Resampling.LANCZOS)
        logo_w, logo_h = logo.size
        
        # Position logo
        logo_x = (width - logo_w) // 2
        logo_y = 110
        
        # Paste logo
        slide.paste(logo, (logo_x, logo_y), logo)
    else:
        print(f"Logo not found at {logo_path}")
        logo_y = 110
        logo_h = 160

    # 3. Load fonts
    font_vix = ImageFont.truetype(font_vix_path, 30)
    font_body = ImageFont.truetype(font_poppins_path, 21)
    font_mission = ImageFont.truetype(font_poppins_path, 24)
    
    # Text contents
    text_vix = "V I X  C i t y  -  A V A  C r e w"
    text_body = "Streetwear autêntico, impulsionado por 20 anos de cultura urbana real"
    text_mission = "Missão: Nacionalizar nossa Comunidade"
    
    # Colors (Dark Theme)
    text_color = (255, 255, 255)       # Pure White
    desc_color = (180, 180, 180)       # Light Grey
    divider_color = (60, 60, 60)       # Dark Grey divider (subtle)
    
    # 4. Draw VIX City - AVA Crew
    bbox_vix = draw.textbbox((0, 0), text_vix, font=font_vix)
    w_vix = bbox_vix[2] - bbox_vix[0]
    x_vix = (width - w_vix) // 2
    y_vix = logo_y + logo_h + 40
    draw.text((x_vix, y_vix), text_vix, font=font_vix, fill=text_color)
    
    # 5. Draw 1px Divider (width 360)
    divider_w = 360
    divider_x1 = (width - divider_w) // 2
    divider_x2 = divider_x1 + divider_w
    divider_y = y_vix + 65
    draw.line([(divider_x1, divider_y), (divider_x2, divider_y)], fill=divider_color, width=1)
    
    # 6. Draw Body text
    bbox_body = draw.textbbox((0, 0), text_body, font=font_body)
    w_body = bbox_body[2] - bbox_body[0]
    x_body = (width - w_body) // 2
    y_body = divider_y + 45
    draw.text((x_body, y_body), text_body, font=font_body, fill=desc_color)
    
    # 7. Draw Mission text
    bbox_mission = draw.textbbox((0, 0), text_mission, font=font_mission)
    w_mission = bbox_mission[2] - bbox_mission[0]
    x_mission = (width - w_mission) // 2
    y_mission = y_body + 50
    draw.text((x_mission, y_mission), text_mission, font=font_mission, fill=text_color)
    
    # Save the output image
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    slide.save(output_path, "JPEG", quality=95)
    print(f"Slide saved to {output_path}")
    
    # 8. Create a 1:1 close-up preview of the text/divider area
    crop_w = 800
    crop_h = 350
    crop_box = (
        (width - crop_w) // 2,
        y_vix - 15,
        (width + crop_w) // 2,
        y_vix - 15 + crop_h
    )
    preview_img = slide.crop(crop_box)
    preview_img.save(preview_path, "JPEG", quality=95)
    print(f"Close-up preview saved to {preview_path}")

if __name__ == "__main__":
    generate_cover()
