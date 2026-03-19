#!/usr/bin/env python3
"""
Script to split payment logos grid into individual images with:
- Precise auto-cropping to content bounds
- TRUE transparent background (remove white completely)
"""
from PIL import Image
import os

# Input image
input_path = "image-12.png"
output_dir = "public/payment-logos"

# Create output directory
os.makedirs(output_dir, exist_ok=True)

# Open the image
img = Image.open(input_path).convert("RGBA")
width, height = img.size

# Grid configuration (4 rows x 3 columns)
rows = 4
cols = 3

# Calculate cell size
cell_width = width // cols
cell_height = height // rows

# Logo names in order (left to right, top to bottom)
logos = [
    # Row 1
    "bca", "mandiri", "bni",
    # Row 2
    "bri", "visa", "mastercard",
    # Row 3
    "paypal", "gopay", "ovo",
    # Row 4
    "alfamart", "pegadaian", "tokopedia"
]

# Spacing between cards (black gaps)
h_gap = 5   # Horizontal gap between columns
v_gap = 6   # Vertical gap between rows

print(f"Image size: {width}x{height}")
print(f"Output directory: {output_dir}")
print("-" * 40)

def find_content_bounds(crop_img, white_threshold=240):
    """
    Find the tight bounding box around non-white content.
    Returns (left, upper, right, lower) or None if no content found.
    """
    pixels = crop_img.load()
    w, h = crop_img.size
    
    # Initialize bounds
    min_x, min_y = w, h
    max_x, max_y = 0, 0
    
    # Scan for non-white pixels
    for y in range(h):
        for x in range(w):
            pixel = pixels[x, y]
            # For RGBA, check RGB values
            r, g, b, a = pixel[0], pixel[1], pixel[2], pixel[3]
            
            # Skip already transparent pixels
            if a == 0:
                continue
            
            # If any channel is significantly below white threshold
            if r < white_threshold or g < white_threshold or b < white_threshold:
                min_x = min(min_x, x)
                min_y = min(min_y, y)
                max_x = max(max_x, x)
                max_y = max(max_y, y)
    
    if min_x > max_x:
        return None
    
    return (min_x, min_y, max_x + 1, max_y + 1)

def make_white_transparent(crop_img, white_threshold=248):
    """
    Make white pixels fully transparent.
    """
    # Ensure RGBA
    if crop_img.mode != "RGBA":
        crop_img = crop_img.convert("RGBA")
    
    pixels = crop_img.load()
    w, h = crop_img.size
    
    for y in range(h):
        for x in range(w):
            pixel = pixels[x, y]
            r, g, b, a = pixel[0], pixel[1], pixel[2], pixel[3]
            
            # If pixel is very close to white, make it fully transparent
            if r > white_threshold and g > white_threshold and b > white_threshold:
                pixels[x, y] = (255, 255, 255, 0)  # White but transparent
    
    return crop_img

# Split and save each logo
for idx, name in enumerate(logos):
    row = idx // cols
    col = idx % cols
    
    # Calculate crop coordinates for the card
    # Small offset to avoid black gaps
    offset = 5
    
    left = col * cell_width + offset
    upper = row * cell_height + offset
    right = (col + 1) * cell_width - h_gap - offset
    lower = (row + 1) * cell_height - v_gap - offset
    
    # Crop the card
    card_img = img.crop((left, upper, right, lower))
    
    # First make white transparent
    card_img = make_white_transparent(card_img, white_threshold=248)
    
    # Find content bounds (on the transparent image)
    content_bounds = find_content_bounds(card_img, white_threshold=240)
    
    if content_bounds:
        # Crop to content
        logo_img = card_img.crop(content_bounds)
    else:
        # Fallback to full card
        logo_img = card_img
    
    # Verify transparency
    logo_img = logo_img.convert("RGBA")
    
    # Save with transparency
    output_path = os.path.join(output_dir, f"{name}.png")
    logo_img.save(output_path, "PNG")
    
    # Calculate final size
    final_w = content_bounds[2] - content_bounds[0] if content_bounds else logo_img.size[0]
    final_h = content_bounds[3] - content_bounds[1] if content_bounds else logo_img.size[1]
    
    # Count transparent pixels for verification
    pixels = list(logo_img.getdata())
    transparent_count = sum(1 for p in pixels if p[3] == 0)
    total_pixels = len(pixels)
    transparent_pct = (transparent_count / total_pixels) * 100
    
    print(f"✓ {name}.png: {final_w}x{final_h} ({transparent_pct:.1f}% transparent)")

print("-" * 40)
print(f"Done! Split {len(logos)} logos to {output_dir}/")
print("All logos have TRUE transparent backgrounds!")
