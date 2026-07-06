import os
from PIL import Image, ImageDraw, ImageFont

def draw_wrapped_text(draw, text, x, y, max_width, font, fill, line_spacing=6):
    words = text.split()
    lines = []
    current_line = []
    for word in words:
        test_line = " ".join(current_line + [word])
        bbox = draw.textbbox((0, 0), test_line, font=font)
        w = bbox[2] - bbox[0]
        if w <= max_width:
            current_line.append(word)
        else:
            lines.append(" ".join(current_line))
            current_line = [word]
    if current_line:
        lines.append(" ".join(current_line))
        
    current_y = y
    for line in lines:
        draw.text((x, current_y), line, font=font, fill=fill)
        bbox = draw.textbbox((0, 0), line, font=font)
        h = bbox[3] - bbox[1]
        current_y += h + line_spacing
    return current_y

def generate_slide6():
    # Paths
    project_root = "/home/artz/Documentos/Antigravity/Ava-Vitoria"
    font_vix_path = os.path.join(project_root, "public/brave-ember-font/brave-ember.otf")
    font_poppins_path = os.path.join(project_root, "public/fonts/Poppins-ExtraLight.ttf")
    output_path = os.path.join(project_root, "public/imagens/SLIDES/06 - slide_mercado.jpg")
    preview_path = os.path.join(project_root, "public/imagens/slide_mercado_preview.jpg")
    
    # 1. Create a blank BLACK image 1366x768 (Dark theme)
    width, height = 1366, 768
    slide = Image.new("RGB", (width, height), "black")
    draw = ImageDraw.Draw(slide)
    
    # 2. Load fonts
    font_header_title = ImageFont.truetype(font_vix_path, 28)
    font_header_subtitle = ImageFont.truetype(font_poppins_path, 18)
    font_big_number = ImageFont.truetype(font_vix_path, 46) # Massive numbers
    font_item_title = ImageFont.truetype(font_poppins_path, 15)
    font_item_desc = ImageFont.truetype(font_poppins_path, 14)
    
    # Text contents for Header
    title_text = "T A M A N H O  D E  M E R C A D O"
    subtitle_text = "A dimensão da oportunidade de escala nacional para a AVA Sem Limites."
    
    # Colors (Dark Theme)
    text_color = (255, 255, 255)       # Pure White
    desc_color = (180, 180, 180)       # Light Grey
    divider_color = (60, 60, 60)       # Dark Grey divider
    
    # 3. Draw Header (Left-aligned at X=120, Y=80)
    x_margin = 120
    draw.text((x_margin, 80), title_text, font=font_header_title, fill=text_color)
    draw.text((x_margin, 135), subtitle_text, font=font_header_subtitle, fill=desc_color)
    
    # 4. Draw 1px Divider
    divider_y = 190
    draw.line([(x_margin, divider_y), (width - x_margin, divider_y)], fill=divider_color, width=1)
    
    # 5. Define Content Pillars (3 Columns with big numbers)
    col_w = 320
    col_gap = 83
    y_start = 245
    
    # Column positions: 120, 523, 926
    columns = [
        {
            "x": x_margin,
            "number": "R$ 48 B",
            "title": "MERCADO DE MODA ONLINE",
            "desc": "Faturamento anual do e-commerce de moda e vestuário no Brasil. Prova o potencial de consumo digital do país. (Fonte: Ebit/Nielsen Webshoppers / ABComm)"
        },
        {
            "x": x_margin + col_w + col_gap,
            "number": "R$ 2.4 B",
            "title": "MODA AUTORAL E STREETWEAR",
            "desc": "Potencial estimado do mercado D2C de moda criativa e streetwear, abrangendo do infantil ao clássico 40+. (Fonte: IEMI / Mapeamento Setorial D2C)"
        },
        {
            "x": x_margin + 2 * (col_w + col_gap),
            "number": "R$ 12 M",
            "title": "META DE FATURAMENTO AVA",
            "desc": "Nosso alvo de faturamento anualizado em 3 anos de expansão digital, representando a captura de 0,5% do SAM. (Projeção Interna de Expansão)"
        }
    ]
    
    # 6. Render Columns
    for col in columns:
        # Draw Big Number in Brave Ember
        draw.text((col["x"], y_start), col["number"], font=font_big_number, fill=text_color)
        
        # Draw Item Title/Label
        label_y = y_start + 70
        draw.text((col["x"], label_y), col["title"], font=font_item_title, fill=text_color)
        
        # Draw a small 1px helper line in the column
        line_y = label_y + 30
        draw.line([(col["x"], line_y), (col["x"] + 80, line_y)], fill=divider_color, width=1)
        
        # Draw Wrapped Item Description below the line
        desc_y_start = line_y + 20
        draw_wrapped_text(draw, col["desc"], col["x"], desc_y_start, col_w, font_item_desc, desc_color, line_spacing=6)
        
    # Save the output image
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    slide.save(output_path, "JPEG", quality=95)
    print(f"Slide saved to {output_path}")
    
    # 7. Create a 1:1 close-up preview of Column 1
    crop_w = 380
    crop_h = 360
    crop_box = (
        x_margin - 10,
        y_start - 10,
        x_margin - 10 + crop_w,
        y_start - 10 + crop_h
    )
    preview_img = slide.crop(crop_box)
    preview_img.save(preview_path, "JPEG", quality=95)
    print(f"Close-up preview saved to {preview_path}")

if __name__ == "__main__":
    generate_slide6()
