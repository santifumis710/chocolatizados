import json
import base64
import os
from pathlib import Path

def extract_image():
    log_file = Path("last_openrouter_response.json")
    output_path = Path("src/frontend/public/images/products/tableta-blanco-pastel-or.png")
    
    if not log_file.exists():
        print("Log file not found.")
        return

    try:
        with open(log_file, "r") as f:
            data = json.load(f)
        
        # Try to find image in the specific structure we saw
        image_data = None
        
        try:
            # Check for Google/OpenRouter specific 'images' array
            images = data["choices"][0]["message"].get("images", [])
            if images:
                url = images[0]["image_url"]["url"]
                if url.startswith("data:image"):
                    image_data = url.split(",")[1]
        except Exception as e:
            print(f"Error parsing specific structure: {e}")

        # If not found there, try the content regex again (just in case)
        if not image_data:
            print("Image not found in 'images' array, checking content...")
            # (Logic omitted as we know where it is based on the log, but good to keep simple)

        if image_data:
            print("Found image data! Saving...")
            decoded = base64.b64decode(image_data)
            output_path.parent.mkdir(parents=True, exist_ok=True)
            with open(output_path, "wb") as f:
                f.write(decoded)
            print(f"Successfully saved image to {output_path}")
        else:
            print("Could not find image data in the log file.")
            
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    extract_image()
