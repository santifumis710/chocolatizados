"""
OpenRouter Image Generation Script
Generates product photos using OpenRouter API with models like GPT-5 image, DALL-E 3, etc.

Usage:
    python execution/generate_image_openrouter.py --prompt "your prompt" --output "output_path.png"
    python execution/generate_image_openrouter.py --prompt "your prompt" --output "output_path.png" --reference "reference_image.png"
"""

import os
import sys
import argparse
import base64
import requests
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

# Available image generation models on OpenRouter
MODELS = {
    "gpt-5-image": "openai/gpt-5-image", 
    "dall-e-3": "openai/dall-e-3",
    "gemini-3-image": "google/gemini-3-pro-image-preview",
    "gemini-2.5-flash-image": "google/gemini-2.5-flash-image",
}

DEFAULT_MODEL = "gpt-5-image"


def encode_image_to_base64(image_path: str) -> str:
    """Encode an image file to base64 string."""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


def generate_image(
    prompt: str,
    output_path: str,
    reference_image: str = None,
    model: str = DEFAULT_MODEL,
    size: str = "1024x1024",
) -> bool:
    if not OPENROUTER_API_KEY:
        print("ERROR: OPENROUTER_API_KEY not found in .env file")
        print("Please add your OpenRouter API key to the .env file")
        return False

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://chocolatizados.com",
        "X-Title": "Chocolatizados Product Photos",
    }
    
    # Build the request payload
    model_id = MODELS.get(model, model)
    
    # OpenRouter generally uses chat/completions for everything
    messages = [{"role": "user", "content": []}]
    
    # Add text prompt
    messages[0]["content"].append({"type": "text", "text": prompt})

    # Add reference images
    if reference_image:
        refs = reference_image.split(",")
        for ref in refs:
            ref = ref.strip()
            if os.path.exists(ref):
                image_base64 = encode_image_to_base64(ref)
                messages[0]["content"].append({
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/png;base64,{image_base64}"
                    },
                })
            else:
                print(f"WARNING: Reference image not found: {ref}")
    
    payload = {
        "model": model_id,
        "messages": messages,
    }
    endpoint = f"{OPENROUTER_BASE_URL}/chat/completions"

    try:
        print(f"Generating image with model: {model_id}")
        
        response = requests.post(endpoint, headers=headers, json=payload, timeout=120)
        
        if response.status_code != 200:
            print(f"ERROR: API Status {response.status_code}")
            print(response.text)
            return False
            
        data = response.json()
        
        # Save debug info to file to allow full inspection
        with open("last_openrouter_response.json", "w") as f:
            import json
            json.dump(data, f, indent=2)
            
        print(f"DEBUG: Response saved to last_openrouter_response.json")
        
        # Check if we got an image URL back
        message = data["choices"][0]["message"]
        content = message.get("content", "")
        
        image_url = None
        is_base64 = False
        
        # Check for Google/OpenRouter specific 'images' array
        if "images" in message and message["images"]:
            try:
                url = message["images"][0]["image_url"]["url"]
                if url:
                    image_url = url
                    if image_url.startswith("data:"):
                        is_base64 = True
            except (KeyError, IndexError) as e:
                print(f"DEBUG: Error parsing images array: {e}")

        # If not found, try content regex
        if not image_url and isinstance(content, str):
            import re
            # Look for data URI (Markdown or plain)
            data_uri_pattern = r'data:image\/[a-zA-Z]+;base64,[a-zA-Z0-9+/=]+'
            match = re.search(data_uri_pattern, content)
            if match:
                image_url = match.group(0)
                is_base64 = True
            else:
                # Look for markdown image link
                match = re.search(r'!\[.*?\]\((.*?)\)', content)
                if match:
                    image_url = match.group(1)
                else:
                    # Look for http url
                    match = re.search(r'https?://\S+', content)
                    if match:
                        image_url = match.group(0)
                        
            # Use found URL
            if image_url and image_url.startswith("data:"):
                is_base64 = True
        
        if not image_url:
            print("ERROR: No image URL found in response")
            return False
            
        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        if is_base64:
            print("Detected Base64 image data. Decoding...")
            # Remove header if present
            if "," in image_url:
                header, encoded = image_url.split(",", 1)
            else:
                encoded = image_url
                
            image_data = base64.b64decode(encoded)
            with open(output_path, "wb") as f:
                f.write(image_data)
        else:
            print(f"Downloading image from: {image_url}")
            img_resp = requests.get(image_url)
            img_resp.raise_for_status()
            with open(output_path, "wb") as f:
                f.write(img_resp.content)
        
        print(f"Image saved to: {output_path}")
        return True
        
    except Exception as e:
        print(f"ERROR: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(description="Generate images using OpenRouter API")
    parser.add_argument("--prompt", "-p", required=True, help="Image generation prompt")
    parser.add_argument("--output", "-o", required=True, help="Output file path")
    parser.add_argument("--reference", "-r", help="Reference image for img2img")
    parser.add_argument(
        "--model",
        "-m",
        default=DEFAULT_MODEL,
        choices=list(MODELS.keys()),
        help=f"Model to use (default: {DEFAULT_MODEL})",
    )
    parser.add_argument(
        "--size",
        "-s",
        default="1024x1024",
        choices=["1024x1024", "1792x1024", "1024x1792"],
        help="Image size",
    )

    args = parser.parse_args()

    success = generate_image(
        prompt=args.prompt,
        output_path=args.output,
        reference_image=args.reference,
        model=args.model,
        size=args.size,
    )

    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
