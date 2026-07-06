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

def generate_slide10():
    # Paths
    project_root = "/home/artz/Documentos/Antigravity/Ava-Vitoria"
    font_vix_path = os.path.join(project_root, "public/brave-ember-font/brave-ember.otf")
    font_poppins_path = os.path.join(project_root, "public/fonts/Poppins-ExtraLight.ttf")
    output_path = os.path.join(project_root, "public/imagens/SLIDES/10 - slide_proposta.jpg")
    preview_path = os.path.join(project_root, "public/imagens/slide_proposta_preview.jpg")
    
    # 1. Create a blank BLACK image 1366x768 (Dark theme)
    width, height = 1366, 768
    slide = Image.new("RGB", (width, height), "black")
    draw = ImageDraw.Draw(slide)
    
    # 2. Load fonts
    font_title = ImageFont.truetype(font_vix_path, 28)
    font_subtitle = ImageFont.truetype(font_poppins_path, 18)
    font_giant_val = ImageFont.truetype(font_vix_path, 52) # Valuation Target
    font_val_sub = ImageFont.truetype(font_poppins_path, 14)
    font_quote = ImageFont.truetype(font_poppins_path, 20)
    font_item_title = ImageFont.truetype(font_poppins_path, 18)
    font_item_desc = ImageFont.truetype(font_poppins_path, 14)
    
    # Text contents for Header
    title_text = "P R O P O S T A  F I N A N C E I R A  &  C A P T A Ç Ã O"
    subtitle_text = "A tese de aceleração: gerar valor contínuo para o ativo (Equity) visando o alvo de 3 anos."
    
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
    
    # 5. Draw Left Column (Valuation Highlight)
    left_x = 120
    left_y = 240
    left_width = 420
    
    # Giant R$ 12 M text
    draw.text((left_x, left_y), "R$ 12 M", font=font_giant_val, fill=text_color)
    
    # Subtitle for valuation
    val_sub_y = left_y + 70
    draw.text((left_x, val_sub_y), "META DE VALUATION EM 3 ANOS", font=font_val_sub, fill=desc_color)
    
    # Line below subtitle
    line_y = val_sub_y + 25
    draw.line([(left_x, line_y), (left_x + 120, line_y)], fill=divider_color, width=1)
    
    # Quote/Thesis
    quote_y = line_y + 25
    quote_text = "\"Trabalhar com foco no acúmulo de valor da marca através de reinvestimento contínuo, maximizando o equity da empresa.\""
    draw_wrapped_text(draw, quote_text, left_x, quote_y, left_width, font_quote, text_color, line_spacing=8)
    
    # 6. Draw Right Column (List of 3 items)
    right_x = 640
    right_width = 600
    
    items = [
        {
            "y": 240,
            "title": "1. CONSTRUÇÃO DE ATIVOS (EQUITY)",
            "desc": "O lucro da operação é reinvestido na marca (tecnologia, IP e fortalecimento da comunidade), criando um ativo intangível de altíssima valorização de mercado."
        },
        {
            "y": 375,
            "title": "2. CAPTAÇÃO DE INVESTIMENTO",
            "desc": "Procura ativa por parceiros e investidores de venture capital para viabilizar e acelerar a infraestrutura de tecnologia e a expansão nacional."
        },
        {
            "y": 510,
            "title": "3. ROTA DE CRESCIMENTO E SAÍDA",
            "desc": "Alinhamento estratégico para uma possível fusão, aquisição ou venda de participação no terceiro ano com base no valuation alvo estabelecido."
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
    crop_h = 320
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
    generate_slide10()
