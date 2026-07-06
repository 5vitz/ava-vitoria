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

def generate_slide9():
    # Paths
    project_root = "/home/artz/Documentos/Antigravity/Ava-Vitoria"
    font_vix_path = os.path.join(project_root, "public/brave-ember-font/brave-ember.otf")
    font_poppins_path = os.path.join(project_root, "public/fonts/Poppins-ExtraLight.ttf")
    output_path = os.path.join(project_root, "public/imagens/SLIDES/09 - slide_operacao.jpg")
    preview_path = os.path.join(project_root, "public/imagens/slide_operacao_preview.jpg")
    
    # 1. Create a blank BLACK image 1366x768 (Dark theme)
    width, height = 1366, 768
    slide = Image.new("RGB", (width, height), "black")
    draw = ImageDraw.Draw(slide)
    
    # 2. Load fonts
    font_title = ImageFont.truetype(font_vix_path, 28)
    font_subtitle = ImageFont.truetype(font_poppins_path, 18)
    font_item_title = ImageFont.truetype(font_poppins_path, 18)
    font_item_desc = ImageFont.truetype(font_poppins_path, 15)
    
    # Text contents for Header
    title_text = "E S T R U T U R A  O P E R A C I O N A L"
    subtitle_text = "Mapeamento dos processos integrados, da fabricação à entrega nacional."
    
    # Colors (Dark Theme)
    text_color = (255, 255, 255)       # Pure White
    desc_color = (180, 180, 180)       # Light Grey
    divider_color = (60, 60, 60)       # Dark Grey divider
    
    # 3. Draw Header (Left-aligned at X=120, Y=80)
    x_margin = 120
    draw.text((x_margin, 80), title_text, font=font_title, fill=text_color)
    draw.text((x_margin, 135), subtitle_text, font=font_header_subtitle if 'font_header_subtitle' in locals() else font_subtitle, fill=desc_color)
    
    # 4. Draw 1px Divider
    divider_y = 190
    draw.line([(x_margin, divider_y), (width - x_margin, divider_y)], fill=divider_color, width=1)
    
    # 5. Define Content Blocks (Grid 2x2)
    col1_x = 120
    col2_x = 746
    row1_y = 250
    row2_y = 480
    col_width = 500
    
    blocks = [
        {
            "col": col1_x, "row": row1_y,
            "title": "1. DESIGN & PRODUÇÃO",
            "desc": "Modelagem física das peças, seleção de malhas de alta gramatura e aplicação de estampas sob a direção artística da marca."
        },
        {
            "col": col2_x, "row": row1_y,
            "title": "2. INTEGRAÇÃO E-COMMERCE",
            "desc": "Sincronização automática do estoque físico com a plataforma de vendas online e integração com a sacolinha do Instagram Shopping."
        },
        {
            "col": col1_x, "row": row2_y,
            "title": "3. PREPARAÇÃO & EXPEDIÇÃO",
            "desc": "Processo de embalagem premium, emissão de etiquetas de envio e postagem ágil a partir do centro de distribuição em Vitória."
        },
        {
            "col": col2_x, "row": row2_y,
            "title": "4. SUPORTE & EXPERIÊNCIA",
            "desc": "Rastreamento automatizado de pedidos enviado para o cliente, atendimento pós-venda e gestão simples de trocas (logística reversa)."
        }
    ]
    
    # 6. Render Blocks
    for b in blocks:
        # Draw Item Title
        draw.text((b["col"], b["row"]), b["title"], font=font_item_title, fill=text_color)
        # Draw Wrapped Item Description
        desc_y_start = b["row"] + 35
        draw_wrapped_text(draw, b["desc"], b["col"], desc_y_start, col_width, font_item_desc, desc_color, line_spacing=6)
        
    # Save the output image
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    slide.save(output_path, "JPEG", quality=95)
    print(f"Slide saved to {output_path}")
    
    # 7. Create a 1:1 close-up preview of a block
    crop_w = 600
    crop_h = 200
    crop_box = (
        col1_x - 10,
        row1_y - 10,
        col1_x - 10 + crop_w,
        row1_y - 10 + crop_h
    )
    preview_img = slide.crop(crop_box)
    preview_img.save(preview_path, "JPEG", quality=95)
    print(f"Close-up preview saved to {preview_path}")

if __name__ == "__main__":
    generate_slide9()
