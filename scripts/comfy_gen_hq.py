#!/usr/bin/env python3
"""Regenerate assets with improved quality - better prompts + pixel art post-processing."""
import sys, os, time, argparse
from io import BytesIO
import requests
from PIL import Image

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

ASSETS = [
    ("assets/sprites/dk.png", "chibi character, cute big head small body, knight in red black armor holding greatsword, full body front view, anime style, vibrant colors, flat shading, game character design", 256, 64, "character"),
    ("assets/sprites/dw.png", "chibi character, cute big head small body, wizard in blue robe with magic staff, full body front view, anime style, vibrant colors, flat shading, game character design", 256, 64, "character"),
    ("assets/sprites/elf.png", "chibi character, cute big head small body, elf archer in green outfit with bow, pointed ears, full body front view, anime style, vibrant colors", 256, 64, "character"),
    ("assets/sprites/sum.png", "chibi character, cute big head small body, dark summoner in purple robe with magical orb, full body front view, anime style, vibrant colors", 256, 64, "character"),
    ("assets/sprites/mg.png", "chibi character, cute big head small body, magic knight in orange armor with elemental sword, full body front view, anime style, vibrant colors", 256, 64, "character"),
    ("assets/sprites/goblin.png", "chibi monster, cute big head, small green goblin with dagger, fantasy enemy, front view, anime style, simple design", 64, 32, "monster"),
    ("assets/sprites/skeleton.png", "chibi monster, cute big head, white cartoon skeleton with bone club, fantasy enemy, front view, anime style, simple design", 64, 32, "monster"),
    ("assets/sprites/giant.png", "chibi monster, cute big head, large brown ogre with club, fantasy boss enemy, front view, anime style, simple design", 96, 48, "monster"),
    ("assets/items/weapons.png", "rpg weapon icons set, sword axe staff wand, flat design, game inventory style, bright colors, simple shapes", 128, 32, "item"),
    ("assets/bg/brave_grounds.png", "fantasy game background, green field with flowers, blue sky, light forest, cheerful bright colors, illustration style", 800, 600, "bg"),
]


def to_chibi(img, target_w, target_h):
    """Resize generated image to target size with smoothing for chibi style."""
    img = img.convert("RGBA")
    return img.resize((target_w, target_h), Image.LANCZOS)


def make_workflow(prompt, seed=None):
    return {
        "3": {"class_type": "KSampler", "inputs": {
            "seed": seed or int(time.time()), "steps": 35, "cfg": 9.0,
            "sampler_name": "euler", "scheduler": "normal", "denoise": 1.0,
            "model": ["4", 0], "positive": ["6", 0], "negative": ["7", 0],
            "latent_image": ["5", 0]}},
        "4": {"class_type": "CheckpointLoaderSimple", "inputs": {
            "ckpt_name": "v1-5-pruned-emaonly-fp16.safetensors"}},
        "5": {"class_type": "EmptyLatentImage", "inputs": {
            "width": 512, "height": 512, "batch_size": 1}},
        "6": {"class_type": "CLIPTextEncode", "inputs": {
            "text": prompt, "clip": ["4", 1]}},
        "7": {"class_type": "CLIPTextEncode", "inputs": {
            "text": "ugly, deformed, bad anatomy, extra limbs, scary, horror, realistic, photograph, 3d render, low quality, blurry, distorted, watermark, text, pixel art, 8bit",
            "clip": ["4", 1]}},
        "8": {"class_type": "VAEDecode", "inputs": {
            "samples": ["3", 0], "vae": ["4", 2]}},
        "9": {"class_type": "SaveImage", "inputs": {
            "filename_prefix": "mu_chibi_hq", "images": ["8", 0]}},
    }


def gen_one(host, port, prompt, outpath, tw, th, seed=None):
    api = f"http://{host}:{port}"
    r = requests.post(f"{api}/prompt", json={"prompt": make_workflow(prompt, seed)}, timeout=30)
    r.raise_for_status()
    pid = r.json()["prompt_id"]
    print(f"    Queued: {pid}")

    for _ in range(120):
        time.sleep(2)
        r = requests.get(f"{api}/history/{pid}", timeout=10)
        if r.status_code != 200 or pid not in r.json():
            continue
        for node_out in r.json()[pid].get("outputs", {}).values():
            for img in node_out.get("images", []):
                ir = requests.get(f"{api}/view?filename={img['filename']}", timeout=30)
                if ir.status_code == 200:
                    raw = Image.open(BytesIO(ir.content))
                    final = to_chibi(raw, tw, th)
                    os.makedirs(os.path.dirname(outpath), exist_ok=True)
                    final.save(outpath)
                    print(f"    Saved: {outpath} ({tw}x{th})")
                    return True
        break
    print(f"    FAILED: {outpath}")
    return False


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--host", default="127.0.0.1")
    p.add_argument("--port", type=int, default=8188)
    p.add_argument("--all", action="store_true")
    p.add_argument("--category", choices=["character", "monster", "item", "bg"])
    p.add_argument("--seed", type=int, default=None)
    args = p.parse_args()

    to_gen = ASSETS
    if args.category:
        to_gen = [a for a in ASSETS if a[4] == args.category]

    print(f"\n  MU Chibi Squad - HQ Asset Generator")
    print(f"  Model: SD 1.5 | Steps: 35 | CFG: 9.0")
    print(f"  Style: chibi anime ({len(to_gen)} assets)\n")

    for i, (path, prompt, tw, th, cat) in enumerate(to_gen, 1):
        full = os.path.join(BASE_DIR, path)
        print(f"  [{i}/{len(to_gen)}] {os.path.basename(path)} ({tw}x{th})")
        try:
            gen_one(args.host, args.port, prompt, full, tw, th, args.seed)
        except Exception as e:
            print(f"    ERROR: {e}")
        print()

    print("  Done!\n")


if __name__ == "__main__":
    main()
