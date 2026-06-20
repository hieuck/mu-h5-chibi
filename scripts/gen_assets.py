import requests
import io
import os
from PIL import Image

API_URL = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell"
OUTPUT_DIR = "assets/sprites"

os.makedirs(OUTPUT_DIR, exist_ok=True)

PROMPTS = {
    "dk.png": "pixel art chibi knight character, 64x64 sprite sheet, 4 frames idle animation, top-down isometric view, full plate armor with greatsword, red and black, transparent background, game asset, cute style --ar 1:1",
    "goblin.png": "pixel art chibi goblin monster, 32x32 sprite sheet, 2 frames idle, top-down view, small green goblin with dagger, game asset",
}

for filename, prompt in PROMPTS.items():
    print(f"Generating {filename}...")
    try:
        response = requests.post(API_URL, json={"inputs": prompt}, timeout=60)
        if response.status_code == 200:
            img = Image.open(io.BytesIO(response.content))
            path = os.path.join(OUTPUT_DIR, filename)
            img.save(path)
            print(f"  Saved {path} ({img.size})")
        else:
            print(f"  Error: {response.status_code} - {response.text[:200]}")
    except Exception as e:
        print(f"  Failed: {e}")
