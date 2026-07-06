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

def generate_slide3():
    # Paths
    project_root = "/home/artz/Documentos/Antigravity/Ava-Vitoria"
    font_vix_path = os.path.join(project_root, "public/brave-ember-font/brave-ember.otf")
    font_poppins_path = os.path.join(project_root, "public/fonts/Poppins-ExtraLight.ttf")
    output_path = os.path.join(project_root, "public/imagens/SLIDES/03 - slide_solucao.jpg")
    preview_path = os.path.join(project_root, "public/imagens/slide_solucao_preview.jpg")
    
    # 1. Create a blank BLACK image 1366x768 (Dark theme)
    width, height = 1366, 768
    slide = Image.new("RGB", (width, height), "black")
    draw = ImageDraw.Draw(slide)
    
    # 2. Load fonts
    font_title = ImageFont.truetype(font_vix_path, 28)
    font_subtitle = ImageFont.truetype(font_poppins_path, 18)
    font_quote = ImageFont.truetype(font_poppins_path, 28) # Poetic large text
    font_item_title = ImageFont.truetype(font_poppins_path, 19)
    font_item_desc = ImageFont.truetype(font_poppins_path, 15)
    
    # Text contents for Header
    title_text = "A  S O L U Ç Ã O :  O  C A N A L  D I G I T A L  D 2 C"
    subtitle_text = "Como a tecnologia e o e-commerce rompem as limitações da venda tradicional."
    
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
    
    # 5. Draw Left Column (Focus quote)
    left_x = 120
    left_y = 250
    left_width = 420
    quote_text = "\"Compartilhando a Cultura Urbana de Vitória com o Brasil.\""
    draw_wrapped_text(draw, quote_text, left_x, left_y, left_width, font_quote, text_color, line_spacing=10)
    
    # 6. Draw Right Column (List of 3 items)
    right_x = 640
    right_width = 600
    
    items = [
        {
            "y": 250,
            "title": "1. ALCANCE NACIONAL ILIMITADO",
            "desc": "Loja aberta 24/7 atendendo clientes em qualquer cidade do país com o mesmo frete e logística integrada."
        },
        {
            "y": 385,
            "title": "2. AUTOMAÇÃO COM CHECKOUT FLUIDO",
            "desc": "Conversão direta das mídias sociais (Instagram Shopping) para o carrinho em 3 cliques, eliminando gargalos de suporte manual."
        },
        {
            "y": 520,
            "title": "3. OPERAÇÃO GUIADA POR DADOS",
            "desc": "Monitoramento de vendas em tempo real para direcionar as estampas e grades de maior interesse, otimizando o capital de giro."
        }
    ]
    
    for item in items:
        # Draw Item Title
        draw.text((right_x, item["y"]), item["title"], font=font_item_title, fill=text_color)
        # Draw Item Desc
        desc_y_start = item["y"] + 32
        draw_wrapped_text(draw, item["desc"], right_x, desc_y_start, right_width, font_item_desc, desc_color, line_spacing=6)
        
    # Save the output image
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    slide.save(output_path, "JPEG", quality=95)
    print(f"Slide saved to {output_path}")
    
    # 7. Create a 1:1 close-up preview of the left column quote
    crop_w = 480
    crop_h = 240
    crop_box = (
        left_x - 10,
        left_y - 10,
        left_x - 10 + crop_w,
        left_y - 10 + crop_h
    )
    preview_img = slide.crop(crop_box)
    preview_img.save(preview_path, "JPEG", quality=95)
    print(f"Close-up preview saved to {preview_path}")

if __name__ == "__main__":
    generate_slide3()
