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

def generate_slide4():
    # Paths
    project_root = "/home/artz/Documentos/Antigravity/Ava-Vitoria"
    font_vix_path = os.path.join(project_root, "public/brave-ember-font/brave-ember.otf")
    font_poppins_path = os.path.join(project_root, "public/fonts/Poppins-ExtraLight.ttf")
    output_path = os.path.join(project_root, "public/imagens/SLIDES/04 - slide_comunidade.jpg")
    preview_path = os.path.join(project_root, "public/imagens/slide_comunidade_preview.jpg")
    
    # 1. Create a blank BLACK image 1366x768 (Dark theme)
    width, height = 1366, 768
    slide = Image.new("RGB", (width, height), "black")
    draw = ImageDraw.Draw(slide)
    
    # 2. Load fonts
    font_title = ImageFont.truetype(font_vix_path, 28)
    font_subtitle = ImageFont.truetype(font_poppins_path, 18)
    font_item_title = ImageFont.truetype(font_poppins_path, 18)
    font_item_desc = ImageFont.truetype(font_poppins_path, 14)
    
    # Text contents for Header
    title_text = "N O S S O  M A I O R  A T I V O :  A  C O M U N I D A D E  A V A"
    subtitle_text = "Duas décadas de cultura urbana real consolidada em Vitória como base de crescimento."
    
    # Colors (Dark Theme)
    text_color = (255, 255, 255)       # Pure White
    desc_color = (180, 180, 180)       # Light Grey
    divider_color = (60, 60, 60)       # Dark Grey divider
    
    # 3. Draw Header (Left-aligned at X=120, Y=80)
    x_margin = 120
    draw.text((x_margin, 80), title_text, font=font_title, fill=text_color)
    draw.text((x_margin, 135), subtitle_text, font=font_subtitle, fill=desc_color)
    
    # 4. Draw 1px Divider
    divider_y = 190
    draw.line([(x_margin, divider_y), (width - x_margin, divider_y)], fill=divider_color, width=1)
    
    # 5. Define Content Pillars (4 Columns)
    col_w = 250
    col_gap = 42
    y_start = 250
    
    # Column positions: 120, 412, 704, 996
    columns = [
        {
            "x": x_margin,
            "title": "1. LEGITIMIDADE",
            "desc": "Duas décadas de conexão real com o skate, grafite e a cultura de rua de Vitória. Uma verdade de marca que não pode ser comprada com anúncios."
        },
        {
            "x": x_margin + col_w + col_gap,
            "title": "2. CUSTO ZERO",
            "desc": "A lealdade da comunidade local atua como um motor de indicação orgânica diária, mantendo nosso Custo de Aquisição de Cliente (CAC) próximo de zero."
        },
        {
            "x": x_margin + 2 * (col_w + col_gap),
            "title": "3. ADVOGADOS",
            "desc": "Nossos clientes não são apenas consumidores passivos; eles propagam ativamente o movimento e o estilo de vida AVA nas ruas."
        },
        {
            "x": x_margin + 3 * (col_w + col_gap),
            "title": "4. EXPANSÃO",
            "desc": "Vitória é a nossa prova de conceito. Exportaremos essa mesma atitude urbana local para outras capitais do país de forma escalonada."
        }
    ]
    
    # 6. Render Columns
    for col in columns:
        # Draw Item Title
        draw.text((col["x"], y_start), col["title"], font=font_item_title, fill=text_color)
        # Draw Wrapped Item Description
        desc_y_start = y_start + 35
        draw_wrapped_text(draw, col["desc"], col["x"], desc_y_start, col_w, font_item_desc, desc_color, line_spacing=6)
        
    # Save the output image
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    slide.save(output_path, "JPEG", quality=95)
    print(f"Slide saved to {output_path}")
    
    # 7. Create a 1:1 close-up preview of Column 1
    crop_w = 320
    crop_h = 320
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
    generate_slide4()
