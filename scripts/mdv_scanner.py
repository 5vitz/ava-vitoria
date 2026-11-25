import sys
import json
import math
import numpy as np
from PIL import Image

def rgb_to_hex(rgb):
    return "#{:02X}{:02X}{:02X}".format(int(rgb[0]), int(rgb[1]), int(rgb[2]))

def analyze_image(image_path):
    img = Image.open(image_path).convert("RGB")
    w, h = img.size
    arr = np.array(img, dtype=np.float32)

    # 1. Luminance (ITU-R BT.709)
    lum = 0.2126 * arr[:, :, 0] + 0.7152 * arr[:, :, 1] + 0.0722 * arr[:, :, 2]

    # Estimate background color from the 4 corners (20x20 patches)
    corners = np.concatenate([
        arr[:20, :20].reshape(-1, 3),
        arr[:20, -20:].reshape(-1, 3),
        arr[-20:, :20].reshape(-1, 3),
        arr[-20:, -20:].reshape(-1, 3)
    ], axis=0)
    bg_rgb = np.median(corners, axis=0)
    bg_hex = rgb_to_hex(bg_rgb)

    # Color distance from background
    diff_bg = np.linalg.norm(arr - bg_rgb, axis=2)
    fg_mask = diff_bg > 35.0  # Foreground pixels (ink)
    bg_mask = ~fg_mask

    negative_space_pct = float(np.mean(bg_mask) * 100.0)
    active_ink_pct = float(np.mean(fg_mask) * 100.0)

    # Classify foreground pixels into Black/Dark Ink, Gold/Warm Accent, Pure White Highlight, Mid-gray/Transition
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    dark_ink_mask = fg_mask & (lum < 75) & ((r - b) < 35)
    gold_accent_mask = fg_mask & ((r - b) >= 35) & (r > 90)
    white_highlight_mask = (lum > 242) & (np.linalg.norm(arr - bg_rgb, axis=2) > 12.0)
    mid_gray_mask = fg_mask & (~dark_ink_mask) & (~gold_accent_mask)

    dark_ink_pct = float(np.mean(dark_ink_mask) * 100.0)
    gold_accent_pct = float(np.mean(gold_accent_mask) * 100.0)
    white_highlight_pct = float(np.mean(white_highlight_mask) * 100.0)
    mid_gray_pct = float(np.mean(mid_gray_mask) * 100.0)

    dark_hex = rgb_to_hex(np.median(arr[dark_ink_mask], axis=0)) if np.any(dark_ink_mask) else "#000000"
    gold_hex = rgb_to_hex(np.median(arr[gold_accent_mask], axis=0)) if np.any(gold_accent_mask) else "NONE"

    # Bounding Box & Aspect Ratio of Foreground
    ys, xs = np.where(fg_mask)
    if len(xs) > 0:
        min_x, max_x = int(np.min(xs)), int(np.max(xs))
        min_y, max_y = int(np.min(ys)), int(np.max(ys))
        bbox_w = max_x - min_x + 1
        bbox_h = max_y - min_y + 1
        bbox_occupancy_pct = float((bbox_w * bbox_h) / (w * h) * 100.0)
        bbox_aspect_ratio = round(bbox_h / bbox_w, 2)
        centroid_x_pct = round(float(np.mean(xs) / w * 100.0), 1)
        centroid_y_pct = round(float(np.mean(ys) / h * 100.0), 1)
    else:
        bbox_occupancy_pct = 0.0
        bbox_aspect_ratio = 1.0
        centroid_x_pct, centroid_y_pct = 50.0, 50.0

    # Gradient & Dominant Force Vectors (Sobel-like finite differences)
    gy, gx = np.gradient(lum)
    grad_mag = np.hypot(gx, gy)
    strong_edges = grad_mag > np.percentile(grad_mag, 85)
    # Edge orientation (tangent to edge is perpendicular to gradient)
    angles_rad = np.arctan2(-gx[strong_edges], gy[strong_edges])
    angles_deg = (np.degrees(angles_rad) + 180.0) % 180.0
    hist_bins, bin_edges = np.histogram(angles_deg, bins=18, range=(0, 180))
    top_bins = np.argsort(hist_bins)[::-1][:3]
    dominant_angles = [
        {
            "angle_range_deg": f"{int(bin_edges[idx])}-{int(bin_edges[idx+1])}°",
            "weight_pct": round(float(hist_bins[idx] / np.sum(hist_bins) * 100.0), 1)
        }
        for idx in top_bins
    ]

    # Stroke Width Estimation via Horizontal and Vertical Run-Lengths on Ink Mask
    # Measure thinness vs solid masses
    h_runs = []
    for row in fg_mask[::2]:
        padded = np.concatenate(([False], row, [False]))
        starts = np.where(padded[1:] & ~padded[:-1])[0]
        ends = np.where(~padded[1:] & padded[:-1])[0]
        h_runs.extend((ends - starts).tolist())
    h_runs = np.array(h_runs) if len(h_runs) > 0 else np.array([0])
    thin_strokes_pct = float(np.mean(h_runs <= 6) * 100.0)
    medium_strokes_pct = float(np.mean((h_runs > 6) & (h_runs <= 25)) * 100.0)
    solid_mass_runs_pct = float(np.mean(h_runs > 25) * 100.0)
    p25_stroke_px = float(np.percentile(h_runs, 25))
    median_stroke_px = float(np.median(h_runs))
    p75_stroke_px = float(np.percentile(h_runs, 75))

    # Zonal Complexity (3x3 Grid Entropy / Ink Density)
    zonal_grid = {}
    zone_names_y = ["upper", "middle", "lower"]
    zone_names_x = ["left", "center", "right"]
    for iy, ny in enumerate(zone_names_y):
        for ix, nx in enumerate(zone_names_x):
            y0, y1 = int(iy * h / 3), int((iy + 1) * h / 3)
            x0, x1 = int(ix * w / 3), int((ix + 1) * w / 3)
            zone_ink = float(np.mean(fg_mask[y0:y1, x0:x1]) * 100.0)
            zone_edge = float(np.mean(strong_edges[y0:y1, x0:x1]) * 100.0)
            zonal_grid[f"{ny}_{nx}"] = {
                "ink_density_pct": round(zone_ink, 1),
                "edge_complexity_pct": round(zone_edge, 1)
            }

    result = {
        "image_dimensions": {"width_px": w, "height_px": h, "aspect_ratio": round(w / h, 3)},
        "spatial_metrics": {
            "negative_space_percent": round(negative_space_pct, 2),
            "active_ink_coverage_percent": round(active_ink_pct, 2),
            "bounding_box_occupancy_percent": round(bbox_occupancy_pct, 2),
            "silhouette_height_to_width_ratio": bbox_aspect_ratio,
            "focal_centroid_percent": {"x": centroid_x_pct, "y": centroid_y_pct}
        },
        "chromatic_metrics": {
            "background_median_hex": bg_hex,
            "primary_dark_ink_hex": dark_hex,
            "primary_dark_ink_percent": round(dark_ink_pct, 2),
            "gold_warm_accent_hex": gold_hex,
            "gold_warm_accent_percent": round(gold_accent_pct, 2),
            "white_highlight_percent": round(white_highlight_pct, 2),
            "mid_gray_transition_halo_percent": round(mid_gray_pct, 2)
        },
        "vector_and_stroke_metrics": {
            "dominant_orientation_angles": dominant_angles,
            "stroke_run_px": {
                "p25_fine_px": round(p25_stroke_px, 1),
                "median_px": round(median_stroke_px, 1),
                "p75_px": round(p75_stroke_px, 1)
            },
            "mass_distribution": {
                "fine_lines_le_6px_pct": round(thin_strokes_pct, 1),
                "medium_strokes_7_to_25px_pct": round(medium_strokes_pct, 1),
                "solid_mass_blocks_gt_25px_pct": round(solid_mass_runs_pct, 1)
            }
        },
        "zonal_3x3_density_map": zonal_grid
    }
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    analyze_image(sys.argv[1])
