"""Generate single-frame character sprites at correct aspect ratio."""
import requests, time, os
from io import BytesIO
from PIL import Image

BASE = os.path.dirname(os.path.dirname(__file__))

ASSETS = [
    ("assets/sprites/dk.png",  "blindbox chibi knight, cute big head tiny body, red black armor with greatsword, game character, vibrant colors", 64, 64),
    ("assets/sprites/dw.png",  "blindbox chibi wizard, cute big head tiny body, blue robe with staff, magic glow, game character", 64, 64),
    ("assets/sprites/elf.png", "blindbox chibi elf archer, cute big head tiny body, green outfit with bow, elven ears, game character", 64, 64),
    ("assets/sprites/sum.png",  "blindbox chibi summoner, cute big head tiny body, purple dark robe with orb, game character", 64, 64),
    ("assets/sprites/mg.png",   "blindbox chibi magic gladiator, cute big head tiny body, orange armor with elemental sword, game character", 64, 64),
    ("assets/sprites/goblin.png",   "blindbox chibi goblin monster, cute big head, small green goblin with dagger, game enemy", 32, 32),
    ("assets/sprites/skeleton.png", "blindbox chibi skeleton monster, cute big head, white skeleton with bone club, game enemy", 32, 32),
    ("assets/sprites/giant.png",    "blindbox chibi giant ogre monster, cute big head, large brown ogre with club, game boss", 48, 48),
    ("assets/items/weapons.png", "rpg weapon icons: sword, axe, staff, bow, 32x32 each, flat design, game inventory", 128, 32),
]

API = "http://127.0.0.1:8188"

def make_wf(prompt, seed=42):
    return {
        "3": {"class_type": "KSampler", "inputs": {
            "seed": seed, "steps": 30, "cfg": 7.0,
            "sampler_name": "euler", "scheduler": "normal", "denoise": 1.0,
            "model": ["10", 0], "positive": ["11", 0], "negative": ["12", 0],
            "latent_image": ["5", 0],
        }},
        "4": {"class_type": "CheckpointLoaderSimple", "inputs": {
            "ckpt_name": "v1-5-pruned-emaonly-fp16.safetensors"
        }},
        "5": {"class_type": "EmptyLatentImage", "inputs": {
            "width": 512, "height": 512, "batch_size": 1
        }},
        "10": {"class_type": "LoraLoader", "inputs": {
            "lora_name": "blindbox_v1_mix.safetensors",
            "strength_model": 0.8, "strength_clip": 0.8,
            "model": ["4", 0], "clip": ["4", 1],
        }},
        "11": {"class_type": "CLIPTextEncode", "inputs": {
            "text": prompt, "clip": ["10", 1],
        }},
        "12": {"class_type": "CLIPTextEncode", "inputs": {
            "text": "ugly, deformed, realistic, photograph, 3d render, low quality, blurry, bad anatomy", "clip": ["10", 1],
        }},
        "8": {"class_type": "VAEDecode", "inputs": {
            "samples": ["3", 0], "vae": ["4", 2]
        }},
        "9": {"class_type": "SaveImage", "inputs": {
            "filename_prefix": "chibi_gen", "images": ["8", 0]
        }},
    }

for i, (path, prompt, tw, th) in enumerate(ASSETS):
    full = os.path.join(BASE, path)
    print(f"[{i+1}/{len(ASSETS)}] {os.path.basename(path)} ({tw}x{th})")

    r = requests.post(f"{API}/prompt", json={"prompt": make_wf(prompt, i)}, timeout=30)
    r.raise_for_status()
    pid = r.json()["prompt_id"]
    print(f"  Queued: {pid}")

    ok = False
    for _ in range(60):
        time.sleep(2)
        r = requests.get(f"{API}/history/{pid}", timeout=10)
        if r.status_code != 200 or pid not in r.json(): continue
        for node_out in r.json()[pid].get("outputs", {}).values():
            for img_data in node_out.get("images", []):
                ir = requests.get(f"{API}/view?filename={img_data['filename']}", timeout=30)
                if ir.status_code == 200:
                    raw = Image.open(BytesIO(ir.content))
                    final = raw.resize((tw, th), Image.LANCZOS)
                    os.makedirs(os.path.dirname(full), exist_ok=True)
                    final.save(full)
                    print(f"  Saved: {full} ({tw}x{th})")
                    ok = True
                    break
            if ok: break
        break
    if not ok:
        print(f"  FAILED!")
    print()

print("Done!")
