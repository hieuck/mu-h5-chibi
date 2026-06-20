#!/usr/bin/env python3
"""
MU Chibi Squad - ComfyUI Asset Generator (Z-Image-Turbo)
Uses workflow từ scripts/image_z_image_turbo.json

Usage:
  1. Start ComfyUI
  2. python scripts/comfy_gen.py --host 127.0.0.1 --port 8188 --all
"""

import sys, os, json, time, argparse
from io import BytesIO
import requests
from PIL import Image

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
WORKFLOW_PATH = os.path.join(BASE_DIR, "scripts", "image_z_image_turbo.json")

ASSETS = [
    ("assets/sprites/dk.png",  "chibi knight character pixel art, 64x64 4-frame sprite sheet, top-down isometric, full plate armor with greatsword, red black scheme, game asset", 256, 64, "character"),
    ("assets/sprites/dw.png",  "chibi wizard pixel art, 64x64 4-frame sprite sheet, top-down, blue robe with staff, magic glow, game asset", 256, 64, "character"),
    ("assets/sprites/elf.png", "chibi elf archer pixel art, 64x64 4-frame sprite sheet, top-down, green outfit with bow, elven ears, game asset", 256, 64, "character"),
    ("assets/sprites/sum.png",  "chibi summoner pixel art, 64x64 4-frame sprite sheet, top-down, purple dark robe with orb, mystical, game asset", 256, 64, "character"),
    ("assets/sprites/mg.png",   "chibi magic gladiator pixel art, 64x64 4-frame sprite sheet, top-down, orange armor with elemental sword, hybrid warrior-mage, game asset", 256, 64, "character"),
    ("assets/sprites/goblin.png",   "chibi goblin monster pixel art, 32x32 2-frame sprite sheet, top-down, small green goblin with dagger, game enemy", 64, 32, "monster"),
    ("assets/sprites/skeleton.png", "chibi skeleton monster pixel art, 32x32 2-frame sprite sheet, top-down, cute skeleton warrior with club, game enemy", 64, 32, "monster"),
    ("assets/sprites/giant.png",    "chibi giant ogre pixel art, 48x48 2-frame sprite sheet, top-down, large muscular ogre with club, game boss", 96, 48, "monster"),
    ("assets/items/weapons.png", "fantasy weapon icons grid pixel art, 4 items: sword axe staff bow, rarities white blue yellow green, 32x32 each, game inventory", 128, 32, "item"),
    ("assets/ui/panel.png",  "game UI panel corner pixel art, 16x16, dark fantasy theme, golden border trim, rpg style", 16, 16, "ui"),
    ("assets/ui/button.png", "game UI button pixel art, 32x16, golden frame dark background, rounded corners, rpg style", 32, 16, "ui"),
    ("assets/ui/heart.png",  "pixel art red crystal heart icon, 16x16, game health display, chibi style", 16, 16, "ui"),
    ("assets/bg/brave_grounds.png", "fantasy game background 800x600, green grassy field, light forest edge, blue sky, top-down rpg style", 800, 600, "bg"),
]

# Node IDs in the workflow
NODE_PROMPT = "57:27"
NODE_LATENT = "57:13"
NODE_SAMPLER = "57:3"
NODE_SAVE = "9"

GEN_WIDTH = 1024
GEN_HEIGHT = 1024


def load_workflow():
    with open(WORKFLOW_PATH, encoding="utf-8") as f:
        return json.load(f)


def generate(host, port, prompt, output_path, target_w, target_h, seed=None):
    api_url = f"http://{host}:{port}"

    wf = load_workflow()

    # Inject prompt
    wf[NODE_PROMPT]["inputs"]["text"] = prompt

    # Set dimensions
    wf[NODE_LATENT]["inputs"]["width"] = GEN_WIDTH
    wf[NODE_LATENT]["inputs"]["height"] = GEN_HEIGHT

    # Set seed
    wf[NODE_SAMPLER]["inputs"]["seed"] = seed if seed is not None else int(time.time())

    # Change save prefix
    wf[NODE_SAVE]["inputs"]["filename_prefix"] = "mu_chibi_gen"

    try:
        resp = requests.post(f"{api_url}/prompt", json={"prompt": wf}, timeout=30)
        resp.raise_for_status()
        prompt_id = resp.json().get("prompt_id", "")
        print(f"    Queued: {prompt_id}")
    except requests.exceptions.ConnectionError:
        print(f"    ERROR: Cannot connect to ComfyUI at {api_url}")
        return False
    except Exception as e:
        print(f"    ERROR: {e}")
        return False

    history_url = f"{api_url}/history/{prompt_id}"
    for _ in range(120):
        time.sleep(2)
        try:
            r = requests.get(history_url, timeout=10)
            if r.status_code == 200 and prompt_id in r.json():
                outputs = r.json()[prompt_id].get("outputs", {})
                for node_id, node_out in outputs.items():
                    for img_data in node_out.get("images", []):
                        img_url = f"{api_url}/view?filename={img_data['filename']}"
                        ir = requests.get(img_url, timeout=30)
                        if ir.status_code == 200:
                            os.makedirs(os.path.dirname(output_path), exist_ok=True)
                            img = Image.open(BytesIO(ir.content))
                            img = img.resize((target_w, target_h), Image.LANCZOS)
                            img.save(output_path, "PNG")
                            print(f"    Saved: {output_path} ({target_w}x{target_h})")
                            return True
                break
        except:
            continue

    print(f"    WARNING: Generation failed/timed out for {output_path}")
    return False


def make_placeholder(output_path, w, h, cat):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    colors = {"character": (200,60,60), "monster": (100,160,60), "item": (200,180,60), "ui": (80,80,120), "bg": (40,60,40)}
    c = colors.get(cat, (100,100,100))
    Image.new("RGBA", (w, h), (*c, 255)).save(output_path)
    print(f"    [placeholder] {output_path}")


def main():
    p = argparse.ArgumentParser(description="Generate MU Chibi Squad assets via ComfyUI (Z-Image-Turbo)")
    p.add_argument("--host", default="127.0.0.1")
    p.add_argument("--port", type=int, default=8188)
    p.add_argument("--all", action="store_true")
    p.add_argument("--category", choices=["character","monster","item","ui","bg"])
    p.add_argument("--placeholder", action="store_true")
    p.add_argument("--seed", type=int, default=None)
    args = p.parse_args()

    if not os.path.exists(WORKFLOW_PATH):
        print(f"ERROR: Workflow not found at {WORKFLOW_PATH}")
        sys.exit(1)

    to_gen = ASSETS
    if args.category:
        to_gen = [a for a in ASSETS if a[4] == args.category]

    print(f"\n  {'='*50}")
    print(f"  MU Chibi Squad - Asset Generator")
    print(f"  Workflow: image_z_image_turbo.json")
    print(f"  ComfyUI:  {args.host}:{args.port}")
    print(f"  Assets:   {len(to_gen)}")
    print(f"  {'='*50}\n")

    for i, (path, prompt, tw, th, cat) in enumerate(to_gen, 1):
        full = os.path.join(BASE_DIR, path)
        print(f"  [{i}/{len(to_gen)}] {os.path.basename(path)} ({tw}x{th})")

        if args.placeholder:
            make_placeholder(full, tw, th, cat)
        else:
            ok = generate(args.host, args.port, prompt, full, tw, th, args.seed)
            if not ok:
                make_placeholder(full, tw, th, cat)
        print()

    print(f"  Done! Assets in: {os.path.join(BASE_DIR, 'assets')}\n")


if __name__ == "__main__":
    main()
