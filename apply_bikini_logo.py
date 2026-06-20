import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import rembg

def main():
    logo_path = "/home/artz/.gemini/antigravity/brain/8218e233-539c-4e72-898d-2e939bd66a48/media__1781249145271.png"
    model_path = "/home/artz/.gemini/antigravity/brain/8218e233-539c-4e72-898d-2e939bd66a48/media__1781249084219.jpg"
    
    # Output paths
    out_frente_white = "/home/artz/Documentos/Antigravity/Ava-Vitoria/public/imagens/bikini001_frente.png"
    out_frente_black = "/home/artz/Documentos/Antigravity/Ava-Vitoria/public/imagens/bikini001_frente_preta.png"
    out_frente_green = "/home/artz/Documentos/Antigravity/Ava-Vitoria/public/imagens/bikini001_frente_verde.png"
    out_frente_yellow = "/home/artz/Documentos/Antigravity/Ava-Vitoria/public/imagens/bikini001_frente_amarela.png"
    out_vitrine_white = "/home/artz/Documentos/Antigravity/Ava-Vitoria/public/imagens/bikini001_vitrine.png"
    
    print("Step 1: Cleaning logo and creating black and white logo versions...")
    logo = Image.open(logo_path).convert("RGBA")
    logo_data = np.array(logo)
    
    # BFS to isolate the logo text "ava"
    visited = np.zeros(logo_data.shape[:2], dtype=bool)
    mask = logo_data[:,:,3] > 10
    h, w = mask.shape
    components = []
    
    for y in range(h):
        for x in range(w):
            if mask[y, x] and not visited[y, x]:
                comp = []
                queue = [(y, x)]
                visited[y, x] = True
                while queue:
                    cy, cx = queue.pop(0)
                    comp.append((cy, cx))
                    for dy in [-1, 0, 1]:
                        for dx in [-1, 0, 1]:
                            ny, nx = cy + dy, cx + dx
                            if 0 <= ny < h and 0 <= nx < w:
                                if mask[ny, nx] and not visited[ny, nx]:
                                    visited[ny, nx] = True
                                    queue.append((ny, nx))
                components.append(comp)
    
    components.sort(key=len, reverse=True)
    comp_0 = components[0]
    
    # Bounding box of the logo
    comp_arr = np.array(comp_0)
    ymin, ymax = comp_arr[:,0].min(), comp_arr[:,0].max()
    xmin, xmax = comp_arr[:,1].min(), comp_arr[:,1].max()
    c0_w = xmax - xmin + 1
    c0_h = ymax - ymin + 1
    
    # Create clean black logo
    logo_clean_black = Image.new("RGBA", (c0_w, c0_h), (0, 0, 0, 0))
    logo_black_data = np.array(logo_clean_black)
    for cy, cx in comp_0:
        logo_black_data[cy - ymin, cx - xmin] = (0, 0, 0, logo_data[cy, cx, 3])
    logo_clean_black = Image.fromarray(logo_black_data)
    
    # Create clean white logo
    logo_clean_white = Image.new("RGBA", (c0_w, c0_h), (0, 0, 0, 0))
    logo_white_data = np.array(logo_clean_white)
    for cy, cx in comp_0:
        logo_white_data[cy - ymin, cx - xmin] = (255, 255, 255, logo_data[cy, cx, 3])
    logo_clean_white = Image.fromarray(logo_white_data)
    
    # Resize to 50%
    target_w = int(round(c0_w * 0.5))
    target_h = int(round(c0_h * 0.5))
    logo_res_black = logo_clean_black.resize((target_w, target_h), Image.Resampling.LANCZOS)
    logo_res_white = logo_clean_white.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    print("Step 2: Warping black and white logos...")
    d = 3.5
    warped_w = target_w
    warped_h = target_h + int(np.ceil(d)) + 2
    
    logo_warp_black = Image.new("RGBA", (warped_w, warped_h), (0, 0, 0, 0))
    logo_warp_white = Image.new("RGBA", (warped_w, warped_h), (0, 0, 0, 0))
    
    warp_black_data = np.array(logo_warp_black)
    warp_white_data = np.array(logo_warp_white)
    
    res_black_data = np.array(logo_res_black)
    res_white_data = np.array(logo_res_white)
    
    def get_pixel_bilinear(img_arr, px, py):
        ih, iw, ic = img_arr.shape
        x0 = int(np.floor(px))
        x1 = min(x0 + 1, iw - 1)
        y0 = int(np.floor(py))
        y1 = min(y0 + 1, ih - 1)
        
        wx = px - x0
        wy = py - y0
        
        x0 = max(0, min(x0, iw - 1))
        x1 = max(0, min(x1, iw - 1))
        y0 = max(0, min(y0, ih - 1))
        y1 = max(0, min(y1, ih - 1))
        
        p00 = img_arr[y0, x0]
        p01 = img_arr[y0, x1]
        p10 = img_arr[y1, x0]
        p11 = img_arr[y1, x1]
        
        px0 = p00 * (1 - wx) + p01 * wx
        px1 = p10 * (1 - wx) + p11 * wx
        p = px0 * (1 - wy) + px1 * wy
        return p.astype(np.uint8)
    
    for ox in range(warped_w):
        dy = d * np.sin(np.pi * ox / (warped_w - 1))
        for oy in range(warped_h):
            iy = oy - dy
            if 0 <= iy < target_h:
                warp_black_data[oy, ox] = get_pixel_bilinear(res_black_data, ox, iy)
                warp_white_data[oy, ox] = get_pixel_bilinear(res_white_data, ox, iy)
                
    logo_warp_black = Image.fromarray(warp_black_data)
    logo_warp_white = Image.fromarray(warp_white_data)
    
    print("Step 3: Removing background of model image and building mask...")
    model_orig = Image.open(model_path).convert("RGBA")
    model_nobg = rembg.remove(model_orig)
    
    model_nobg_data = np.array(model_nobg)
    r_nb, g_nb, b_nb, a_nb = model_nobg_data[:,:,0], model_nobg_data[:,:,1], model_nobg_data[:,:,2], model_nobg_data[:,:,3]
    
    # 3.1. Draw precise polygon masks to isolate bust and hips
    poly_mask_img = Image.new("L", model_orig.size, 0)
    draw = ImageDraw.Draw(poly_mask_img)
    
    # Top polygon
    top_poly = [(230, 440), (345, 440), (415, 520), (415, 555), (160, 555), (160, 520)]
    draw.polygon(top_poly, fill=255)
    
    # Bottom polygon
    bottom_poly = [(150, 735), (425, 735), (445, 765), (330, 835), (240, 835), (135, 765)]
    draw.polygon(bottom_poly, fill=255)
    
    poly_mask = np.array(poly_mask_img) > 128
    
    # 3.2. Combine loose polygons with R/B ratio check
    b_safe = np.maximum(1, b_nb)
    ratio = r_nb / b_safe
    is_bikini = (ratio < 1.78) & (a_nb > 200) & poly_mask
    
    # Positioning info for the logo
    x_start = 295 - warped_w // 2
    y_start = 778
    
    # Blending function for black logo (reflectance 12%)
    def blend_black_logo(bg_img_data):
        img_data = bg_img_data.copy()
        reflectance = 0.12
        for lx in range(warped_w):
            for ly in range(warped_h):
                logo_pixel = warp_black_data[ly, lx]
                factor = logo_pixel[3] / 255.0
                if factor > 0.0:
                    mx = x_start + lx
                    my = y_start + ly
                    if 0 <= mx < img_data.shape[1] and 0 <= my < img_data.shape[0]:
                        bg_r, bg_g, bg_b, bg_a = img_data[my, mx]
                        new_r = bg_r * (1.0 - factor) + (bg_r * reflectance) * factor
                        new_g = bg_g * (1.0 - factor) + (bg_g * reflectance) * factor
                        new_b = bg_b * (1.0 - factor) + (bg_b * reflectance) * factor
                        img_data[my, mx] = (int(new_r), int(new_g), int(new_b), bg_a)
        return img_data

    # Blending function for white logo (normal alpha blending on colored dark fabric)
    def blend_white_logo(bg_img_data):
        img_data = bg_img_data.copy()
        for lx in range(warped_w):
            for ly in range(warped_h):
                logo_pixel = warp_white_data[ly, lx]
                factor = logo_pixel[3] / 255.0
                if factor > 0.0:
                    mx = x_start + lx
                    my = y_start + ly
                    if 0 <= mx < img_data.shape[1] and 0 <= my < img_data.shape[0]:
                        bg_r, bg_g, bg_b, bg_a = img_data[my, mx]
                        new_r = bg_r * (1.0 - factor) + 245.0 * factor
                        new_g = bg_g * (1.0 - factor) + 245.0 * factor
                        new_b = bg_b * (1.0 - factor) + 245.0 * factor
                        img_data[my, mx] = (int(new_r), int(new_g), int(new_b), bg_a)
        return img_data

    # Tinting function to apply solid color with 12% soft 3D shading and smooth antialiased edges
    def tint_fabric_solid(bg_img_data, target_rgb):
        img_data = bg_img_data.copy()
        
        # Get blurred mask for smooth edge transitions
        mask_img = Image.fromarray((is_bikini * 255).astype(np.uint8))
        mask_img_blurred = mask_img.filter(ImageFilter.GaussianBlur(radius=1.0))
        mask_float = np.array(mask_img_blurred) / 255.0
        
        for y in range(img_data.shape[0]):
            for x in range(img_data.shape[1]):
                mask_val = mask_float[y, x]
                if mask_val > 0.0:
                    bg_r, bg_g, bg_b, bg_a = img_data[y, x]
                    # Soft 3D volume preservation:
                    # Original white fabric brightness is around 200.
                    # We compute the relative luminance L/200, and scale it by 12% contrast.
                    orig_l = (float(bg_r) + float(bg_g) + float(bg_b)) / 3.0
                    v = orig_l / 200.0
                    shadow_factor = 1.0 + (v - 1.0) * 0.12 # 12% soft shading contrast, perfectly clean
                    shadow_factor = np.clip(shadow_factor, 0.5, 1.5)
                    
                    # Solid color adjusted by shading factor
                    solid_r = np.clip(target_rgb[0] * shadow_factor, 0, 255)
                    solid_g = np.clip(target_rgb[1] * shadow_factor, 0, 255)
                    solid_b = np.clip(target_rgb[2] * shadow_factor, 0, 255)
                    
                    # Smooth blend with original image boundary
                    new_r = bg_r * (1.0 - mask_val) + solid_r * mask_val
                    new_g = bg_g * (1.0 - mask_val) + solid_g * mask_val
                    new_b = bg_b * (1.0 - mask_val) + solid_b * mask_val
                    img_data[y, x] = (int(new_r), int(new_g), int(new_b), bg_a)
        return img_data

    print("Step 4: Generating cropped images (frente)...")
    crop_y0, crop_y1 = 430, 950
    
    # 4.1. White bikini with black logo
    frente_white_data = blend_black_logo(model_nobg_data)
    frente_white_img = Image.fromarray(frente_white_data).crop((0, crop_y0, model_orig.size[0], crop_y1))
    frente_white_img.save(out_frente_white, "PNG")
    
    # 4.2. Black bikini with white logo (Charcoal solid: 35, 35, 35)
    frente_black_tinted = tint_fabric_solid(model_nobg_data, (35, 35, 35))
    frente_black_data = blend_white_logo(frente_black_tinted)
    frente_black_img = Image.fromarray(frente_black_data).crop((0, crop_y0, model_orig.size[0], crop_y1))
    frente_black_img.save(out_frente_black, "PNG")
    
    # 4.3. Green bikini with white logo (Pine solid: 30, 85, 50)
    frente_green_tinted = tint_fabric_solid(model_nobg_data, (30, 85, 50))
    frente_green_data = blend_white_logo(frente_green_tinted)
    frente_green_img = Image.fromarray(frente_green_data).crop((0, crop_y0, model_orig.size[0], crop_y1))
    frente_green_img.save(out_frente_green, "PNG")
    
    # 4.4. Yellow bikini with black logo (Gold solid: 235, 185, 55)
    frente_yellow_tinted = tint_fabric_solid(model_nobg_data, (235, 185, 55))
    frente_yellow_data = blend_black_logo(frente_yellow_tinted)
    frente_yellow_img = Image.fromarray(frente_yellow_data).crop((0, crop_y0, model_orig.size[0], crop_y1))
    frente_yellow_img.save(out_frente_yellow, "PNG")
    
    print("Step 5: Generating full-body image for vitrine (white with black logo)...")
    model_orig_data = np.array(model_orig)
    vitrine_white_data = blend_black_logo(model_orig_data)
    vitrine_white_img = Image.fromarray(vitrine_white_data)
    vitrine_white_img.save(out_vitrine_white, "PNG")
    
    print("All five output images generated successfully!")

if __name__ == "__main__":
    main()
