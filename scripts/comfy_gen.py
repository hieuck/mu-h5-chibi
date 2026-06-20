#!/usr/bin/env python3
"""Generate ALL game assets via ComfyUI SD 1.5."""
import sys, os, json, time, argparse
from io import BytesIO
import requests
from PIL import Image

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

ASSETS = [
    ("assets/sprites/dk.png",  "chibi pixel art knight character sprite, 64x64 game asset, top-down isometric, red black plate armor with greatsword, cute style", 256, 64, "character"),
    ("assets/sprites/dw.png",  "chibi pixel art wizard character sprite, 64x64 game asset, top-down, blue robe with staff, magic glowing effect", 256, 64, "character"),
    ("assets/sprites/elf.png", "chibi pixel art elf archer character sprite, 64x64 game asset, top-down, green outfit with bow, elven ears", 256, 64, "character"),
    ("assets/sprites/sum.png",  "chibi pixel art summoner character sprite, 64x64 game asset, top-down, purple dark robe with orb, mystical aura", 256, 64, "character"),
    ("assets/sprites/mg.png",   "chibi pixel art magic knight character sprite, 64x64 game asset, top-down, orange armor with elemental sword", 256, 64, "character"),
    ("assets/sprites/goblin.png",   "chibi pixel art goblin monster sprite, 32x32 game asset, top-down, small green goblin with dagger, enemy", 64, 32, "monster"),
    ("assets/sprites/skeleton.png", "chibi pixel art skeleton monster sprite, 32x32 game asset, top-down, cute skeleton warrior with bone club", 64, 32, "monster"),
    ("assets/sprites/giant.png",    "chibi pixel art giant ogre monster sprite, 48x48 game asset, top-down, large muscular ogre with club", 96, 48, "monster"),
    ("assets/items/weapons.png", "pixel art fantasy weapon icons grid, 4 items: sword axe staff bow, different rarities, 32x32 each", 128, 32, "item"),
    ("assets/bg/brave_grounds.png", "fantasy rpg game background, green grass field with trees, blue sky, pixel art style", 800, 600, "bg"),
]

def make_workflow(prompt, seed=None):
    return {
        "3": { "class_type": "KSampler", "inputs": {
            "seed": seed or int(time.time()), "steps": 25, "cfg": 7.0,
            "sampler_name": "euler", "scheduler": "normal", "denoise": 1.0,
            "model": ["4", 0], "positive": ["6", 0], "negative": ["7", 0],
            "latent_image": ["5", 0],
        }},
        "4": { "class_type": "CheckpointLoaderSimple", "inputs": {
            "ckpt_name": "v1-5-pruned-emaonly-fp16.safetensors"
        }},
        "5": { "class_type": "EmptyLatentImage", "inputs": {
            "width": 512, "height": 512, "batch_size": 1
        }},
        "6": { "class_type": "CLIPTextEncode", "inputs": {
            "text": prompt + ", pixel art, game sprite, transparent background, cute chibi",
            "clip": ["4", 1]
        }},
        "7": { "class_type": "CLIPTextEncode", "inputs": {
            "text": "nsfw, low quality, blurry, distorted, ugly, bad anatomy, extra limbs, text, watermark, realistic, photo",
            "clip": ["4", 1]
        }},
        "8": { "class_type": "VAEDecode", "inputs": {
            "samples": ["3", 0], "vae": ["4", 2]
        }},
        "9": { "class_type": "SaveImage", "inputs": {
            "filename_prefix": "mu_chibi_gen", "images": ["8", 0]
        }},
    }

def generate(host, port, prompt, output_path, tw, th, seed=None):
    api = f"http://{host}:{port}"
    wf = make_workflow(prompt, seed)

    r = requests.post(f"{api}/prompt", json={"prompt": wf}, timeout=30)
    r.raise_for_status()
    pid = r.json()["prompt_id"]
    print(f"    Queued: {pid}")

    for _ in range(120):
        time.sleep(2)
        r = requests.get(f"{api}/history/{pid}", timeout=10)
        if r.status_code != 200 or pid not in r.json():
            continue
        outs = r.json()[pid].get("outputs", {})
        for node_id, node_out in outs.items():
            for img in node_out.get("images", []):
                ir = requests.get(f"{api}/view?filename={img['filename']}", timeout=30)
                if ir.status_code == 200:
                    os.makedirs(os.path.dirname(output_path), exist_ok=True)
                    Image.open(BytesIO(ir.content)).resize((tw, th), Image.LANCZOS).save(output_path)
                    print(f"    Saved: {output_path} ({tw}x{th})")
                    return True
        break
    print(f"    FAILED: {output_path}")
    return False

def placeholder(output_path, w, h, cat):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    colors = {"character": (200,60,60), "monster": (100,160,60), "item": (200,180,60), "bg": (40,60,40)}
    Image.new("RGBA", (w, h), (*colors.get(cat, (100,100,100)), 255)).save(output_path)
    print(f"    [placeholder] {output_path}")

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--host", default="127.0.0.1")
    p.add_argument("--port", type=int, default=8188)
    p.add_argument("--all", action="store_true")
    p.add_argument("--category", choices=["character","monster","item","bg"])
    p.add_argument("--placeholder", action="store_true")
    p.add_argument("--seed", type=int, default=None)
    args = p.parse_args()

    to_gen = ASSETS
    if args.category:
        to_gen = [a for a in ASSETS if a[4] == args.category]

    print(f"\n  MU Chibi Squad - Asset Generator (SD 1.5)")
    print(f"  ComfyUI: {args.host}:{args.port}")
    print(f"  Assets:  {len(to_gen)}\n")

    for i, (path, prompt, tw, th, cat) in enumerate(to_gen, 1):
        full = os.path.join(BASE_DIR, path)
        print(f"  [{i}/{len(to_gen)}] {os.path.basename(path)} ({tw}x{th})")
        if args.placeholder:
            placeholder(full, tw, th, cat)
        else:
            success = generate(args.host, args.port, prompt, full, tw, th, args.seed)
            if not success:
                placeholder(full, tw, th, cat)
        print()

    print(f"  Done!\n")

if __name__ == "__main__":
    main()
