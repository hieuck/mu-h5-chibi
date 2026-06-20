"""Test LoRA generation - 1 character sprite."""
import requests, time, os
from io import BytesIO
from PIL import Image

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

WORKFLOW = {
    "3": { "class_type": "KSampler", "inputs": {
        "seed": 42, "steps": 30, "cfg": 7.0,
        "sampler_name": "euler", "scheduler": "normal", "denoise": 1.0,
        "model": ["10", 0], "positive": ["11", 0], "negative": ["12", 0],
        "latent_image": ["5", 0],
    }},
    "4": { "class_type": "CheckpointLoaderSimple", "inputs": {
        "ckpt_name": "v1-5-pruned-emaonly-fp16.safetensors"
    }},
    "5": { "class_type": "EmptyLatentImage", "inputs": {
        "width": 512, "height": 512, "batch_size": 1
    }},
    "10": { "class_type": "LoraLoader", "inputs": {
        "lora_name": "blindbox_v1_mix.safetensors",
        "strength_model": 0.8,
        "strength_clip": 0.8,
        "model": ["4", 0],
        "clip": ["4", 1],
    }},
    "11": { "class_type": "CLIPTextEncode", "inputs": {
        "text": "blindbox chibi knight character, cute big head small body, red black armor with greatsword, game character design, vibrant colors, flat shading, full body",
        "clip": ["10", 1],
    }},
    "12": { "class_type": "CLIPTextEncode", "inputs": {
        "text": "ugly, deformed, realistic, photograph, 3d, low quality, blurry, extra limbs, bad anatomy",
        "clip": ["10", 1],
    }},
    "8": { "class_type": "VAEDecode", "inputs": {
        "samples": ["3", 0], "vae": ["4", 2]
    }},
    "9": { "class_type": "SaveImage", "inputs": {
        "filename_prefix": "lora_test", "images": ["8", 0]
    }},
}

api = "http://127.0.0.1:8188"
r = requests.post(f"{api}/prompt", json={"prompt": WORKFLOW}, timeout=30)
r.raise_for_status()
pid = r.json()["prompt_id"]
print(f"Queued: {pid}")

for _ in range(60):
    time.sleep(2)
    r = requests.get(f"{api}/history/{pid}", timeout=10)
    if r.status_code != 200 or pid not in r.json(): continue
    for node_out in r.json()[pid].get("outputs", {}).values():
        for img in node_out.get("images", []):
            ir = requests.get(f"{api}/view?filename={img['filename']}", timeout=30)
            if ir.status_code == 200:
                out = os.path.join(BASE_DIR, "assets/sprites/dk_lora_test.png")
                img_pil = Image.open(BytesIO(ir.content))
                img_pil = img_pil.resize((256, 64), Image.LANCZOS)
                img_pil.save(out)
                print(f"Saved: {out}")
                exit(0)
    break

print("Failed!")
