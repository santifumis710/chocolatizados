from PIL import Image
import sys

def zoom_image(input_path, output_path, zoom_factor=1.5):
    try:
        img = Image.open(input_path)
        width, height = img.size
        
        # Calculate new dimensions
        new_width = width / zoom_factor
        new_height = height / zoom_factor
        
        # Calculate crop box (center)
        left = (width - new_width) / 2
        top = (height - new_height) / 2
        right = (width + new_width) / 2
        bottom = (height + new_height) / 2
        
        # Crop and resize back to original (or keep high res if intended for web display, 
        # but user said 'maintaining size in web', which usually means CSS size, 
        # so pixel density matters less as long as it's not blurry. 
        # But resizing back to original dimensions ensures 1:1 pixel mapping availability)
        img_cropped = img.crop((left, top, right, bottom))
        img_resized = img_cropped.resize((width, height), Image.Resampling.LANCZOS)
        
        img_resized.save(output_path, quality=95)
        print(f"Successfully zoomed image {zoom_factor}x and saved to {output_path}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    zoom_image("src/frontend/public/images/hero_madre_16_9.jpg", "src/frontend/public/images/hero_madre_16_9.jpg", zoom_factor=1.3)
