from PIL import Image
import sys
import os

def process_favicon(input_path, output_path):
    print(f"Processing {input_path}...")
    
    try:
        img = Image.open(input_path)
        img = img.convert("RGBA")
        
        datas = img.getdata()
        
        newData = []
        for item in datas:
            # Check for white (or very light gray) pixel
            # R, G, B all high
            if item[0] > 240 and item[1] > 240 and item[2] > 240:
                newData.append((255, 255, 255, 0)) # Transparent
            else:
                newData.append(item)
        
        img.putdata(newData)
        
        # Autocrop (Trim whitespace/transparent space)
        # GetBoundingBox returns the box of non-zero regions in the alpha channel?
        # Ideally we check alpha.
        bbox = img.getbbox()
        if bbox:
            print(f"Cropping to {bbox}")
            img = img.crop(bbox)
        else:
            print("No content found (image is blank?), skipping crop.")
            
        # Save
        print(f"Saving to {output_path}")
        img.save(output_path, "PNG")
        print("Done.")
        
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python generate_favicon.py <input_path> <output_path>")
        sys.exit(1)
        
    process_favicon(sys.argv[1], sys.argv[2])
