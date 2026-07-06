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

def generate_slide7():
    # Paths
    project_root = "/home/artz/Documentos/Antigravity/Ava-Vitoria"
    font_vix_path = os.path.join(project_root, "public/brave-ember-font/brave-ember.otf")
    font_poppins_path = os.path.join(project_root, "public/fonts/Poppins-ExtraLight.ttf")
    output_path = os.path.join(project_root, "public/imagens/SLIDES/07 - slide_modelonegocio.jpg")
    preview_path = os.path.join(project_root, "public/imagens/slide_modelonegocio_preview.jpg")
    
    # 1. Create a blank BLACK image 1366x768 (Dark theme)
    width, height = 1366, 768
    slide = Image.new("RGB", (width, height), "black")
    draw = ImageDraw.Draw(slide)
    
    # 2. Load fonts
    font_title = ImageFont.truetype(font_vix_path, 28)
    font_subtitle = ImageFont.truetype(font_poppins_path, 18)
    font_quote = ImageFont.truetype(font_poppins_path, 26) # Large text
    font_item_title = ImageFont.truetype(font_poppins_path, 19)
    font_item_desc = ImageFont.truetype(font_poppins_path, 15)
    
    # Text contents for Header
    title_text = "M O D E L O  D E  N E G Ó C I O  &  D 2 C"
    subtitle_text = "Como a desintermediação física maximiza o retorno financeiro por peça vendida."
    
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
    
    # 5. Draw Left Column (User Quote)
    left_x = 120
    left_y = 250
    left_width = 420
    quote_text = "\"Vender direto ao cliente final preserva a margem cheia do produto, viabilizando reinvestimento rápido, e ampliando a criação de valor da marca.\""
    draw_wrapped_text(draw, quote_text, left_x, left_y, left_width, font_quote, text_color, line_spacing=10)
    
    # 6. Draw Right Column (List of 3 items)
    right_x = 640
    right_width = 600
    
    items = [
        {
            "y": 250,
            "title": "1. MARGEM BRUTA ESTIMADA (~70%)",
            "desc": "O baixo custo de fabricação da moda criativa local comparado ao preço de venda direta final nos garante margens saudáveis para sustentar a operação e o marketing."
        },
        {
            "y": 385,
            "title": "2. TICKET MÉDIO ALVO (R$ 220)",
            "desc": "Mix de produtos (camisetas, bonés, bermudas) planejado para estimular a compra de múltiplos itens por pedido, otimizando o custo do frete."
        },
        {
            "y": 520,
            "title": "3. RECORRÊNCIA E LEALDADE (LTV)",
            "desc": "Aproveitamento da força de comunidade para gerar compras recorrentes ao longo do ano através do modelo de lançamentos limitados (drops)."
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
    crop_h = 280
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
    generate_slide7()
