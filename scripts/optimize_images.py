import os
from PIL import Image

images_dir = 'src/images'

# 1. Optimize kathakali-face.png
kathakali_path = os.path.join(images_dir, 'kathakali-face.png')
if os.path.exists(kathakali_path):
    with Image.open(kathakali_path) as im:
        im = im.convert('RGBA')
        # resize to max 480px width/height for crisp high-DPI display
        im.thumbnail((480, 480), Image.Resampling.LANCZOS)
        # save as webp
        webp_path = os.path.join(images_dir, 'kathakali-face.webp')
        im.save(webp_path, 'WEBP', quality=82, method=6)
        # overwrite png with optimized version
        im.save(kathakali_path, 'PNG', optimize=True)

# 2. Optimize darshana-icon-only.png
icon_path = os.path.join(images_dir, 'darshana-icon-only.png')
if os.path.exists(icon_path):
    with Image.open(icon_path) as im:
        im = im.convert('RGBA')
        im.thumbnail((320, 320), Image.Resampling.LANCZOS)
        webp_path = os.path.join(images_dir, 'darshana-icon-only.webp')
        im.save(webp_path, 'WEBP', quality=85, method=6)
        im.save(icon_path, 'PNG', optimize=True)

# 3. Optimize images-map-logo.png
map_logo_path = os.path.join(images_dir, 'images-map-logo.png')
if os.path.exists(map_logo_path):
    with Image.open(map_logo_path) as im:
        im = im.convert('RGBA')
        im.thumbnail((320, 320), Image.Resampling.LANCZOS)
        webp_path = os.path.join(images_dir, 'images-map-logo.webp')
        im.save(webp_path, 'WEBP', quality=85, method=6)
        im.save(map_logo_path, 'PNG', optimize=True)

# 4. Optimize darshana-logo-full.png
full_logo_path = os.path.join(images_dir, 'darshana-logo-full.png')
if os.path.exists(full_logo_path):
    with Image.open(full_logo_path) as im:
        im = im.convert('RGBA')
        im.thumbnail((800, 240), Image.Resampling.LANCZOS)
        webp_path = os.path.join(images_dir, 'darshana-logo-full.webp')
        im.save(webp_path, 'WEBP', quality=88, method=6)
        im.save(full_logo_path, 'PNG', optimize=True)

print("Optimized image files in src/images:")
for f in os.listdir(images_dir):
    p = os.path.join(images_dir, f)
    if os.path.isfile(p):
        print(f"  {f}: {os.path.getsize(p)/1024:.2f} KB")
