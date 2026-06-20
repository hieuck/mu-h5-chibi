#!/usr/bin/env python3
"""
MU Chibi Squad - ComfyUI Asset Generator
Sends prompts to local ComfyUI API to generate game sprites.

Usage:
  1. Start ComfyUI with API enabled
  2. python scripts/comfy_gen.py --host 127.0.0.1 --port 8188

Requires: requests, Pillow (pip install requests Pillow)
"""

import sys
import os
import json
import time
import argparse
from io import BytesIO
from urllib import request as urllib_req
from urllib.error import URLError
import requests
from PIL import Image

# ── Config ──
ASSETS_DIR = "assets"
SPRITES_DIR = f"{ASSETS_DIR}/sprites"
ITEMS_DIR = f"{ASSETS_DIR}/items"
UI_DIR = f"{ASSETS_DIR}/ui"
BG_DIR = f"{ASSETS_DIR}/bg"

ASSETS = [
    # (filename, prompt, width, height, category)
    # ── Characters (sprite sheet: 4 frames horizontal) ──
    ("sprites/dk.png", "pixel art chibi knight character, 64x64 sprite sheet, 4 frames idle, top-down isometric, red black armor with greatsword, transparent background, game asset", 256, 64, "character"),
    ("sprites/dw.png", "pixel art chibi wizard, 64x64 sprite sheet, 4 frames idle, top-down, blue robe with staff, magic glow, transparent bg", 256, 64, "character"),
    ("sprites/elf.png", "pixel art chibi elf archer, 64x64 sprite sheet, 4 frames idle, top-down, green outfit with bow, elven ears, transparent bg", 256, 64, "character"),
    ("sprites/sum.png", "pixel art chibi summoner, 64x64 sprite sheet, 4 frames idle, top-down, purple dark robe with orb, mystical, transparent bg", 256, 64, "character"),
    ("sprites/mg.png", "pixel art chibi magic gladiator, 64x64 sprite sheet, 4 frames idle, top-down, orange red armor with elemental sword, transparent bg", 256, 64, "character"),

    # ── Monsters (sprite sheet: 2 frames) ──
    ("sprites/goblin.png", "pixel art chibi goblin, 32x32 sprite sheet, 2 frames idle, top-down, small green goblin with dagger, game enemy", 64, 32, "monster"),
    ("sprites/skeleton.png", "pixel art chibi skeleton, 32x32 sprite sheet, 2 frames idle, top-down, cute skeleton warrior with club, game enemy", 64, 32, "monster"),
    ("sprites/giant.png", "pixel art chibi giant ogre, 48x48 sprite sheet, 2 frames idle, top-down, large muscular ogre with club, game boss enemy", 96, 48, "monster"),

    # ── Items ──
    ("items/weapons.png", "fantasy weapon icons grid, 32x32 each, 4 items: sword, axe, staff, bow, different rarities white blue yellow green, pixel art", 128, 32, "item"),

    # ── UI ──
    ("ui/panel.png", "game UI panel corner, 16x16, dark purple fantasy theme, golden border, rpg style, pixel art", 16, 16, "ui"),
    ("ui/button.png", "game UI button, 32x16, golden frame dark background, rounded corners, rpg style pixel art", 32, 16, "ui"),
    ("ui/heart.png", "pixel art red crystal heart icon, 16x16, game UI health display, chibi cute style", 16, 16, "ui"),

    # ── Background ──
    ("bg/brave_grounds.png", "fantasy game background, 800x600, green grassy field with light forest edge, blue sky, top-down rpg style, bright daytime", 800, 600, "bg"),
]

# ── Negative prompt ──
NEGATIVE_PROMPT = "nsfw, low quality, blurry, deformed, distorted, ugly, bad anatomy, extra limbs, text, watermark, signature"


def generate_comfyui(host: str, port: int, prompt: str, neg_prompt: str,
                     width: int, height: int, output_path: str,
                     seed: int = -1, steps: int = 20, cfg: float = 7.0):
    """Send generation request to ComfyUI and save result."""
    api_url = f"http://{host}:{port}"

    # ── ComfyUI workflow (SDXL compatible) ──
    workflow = {
        "3": {
            "class_type": "KSampler",
            "inputs": {
                "seed": seed if seed >= 0 else int(time.time()),
                "steps": steps,
                "cfg": cfg,
                "sampler_name": "euler",
                "scheduler": "normal",
                "denoise": 1.0,
                "model": ["4", 0],
                "positive": ["6", 0],
                "negative": ["7", 0],
                "latent_image": ["5", 0],
            }
        },
        "4": {
            "class_type": "CheckpointLoaderSimple",
            "inputs": {"ckpt_name": "sd_xl_base_1.0.safetensors"}
        },
        "5": {
            "class_type": "EmptyLatentImage",
            "inputs": {"width": width, "height": height, "batch_size": 1}
        },
        "6": {
            "class_type": "CLIPTextEncode",
            "inputs": {"text": prompt, "clip": ["4", 1]}
        },
        "7": {
            "class_type": "CLIPTextEncode",
            "inputs": {"text": neg_prompt, "clip": ["4", 1]}
        },
        "8": {
            "class_type": "VAEDecode",
            "inputs": {"samples": ["3", 0], "vae": ["4", 2]}
        },
        "9": {
            "class_type": "SaveImage",
            "inputs": {"filename_prefix": "mu_chibi_temp", "images": ["8", 0]}
        }
    }

    # ── Queue prompt ──
    try:
        resp = requests.post(f"{api_url}/prompt", json={"prompt": workflow}, timeout=30)
        resp.raise_for_status()
        prompt_id = resp.json().get("prompt_id", "")
        print(f"  Queued: {prompt_id}")
    except requests.exceptions.ConnectionError:
        print(f"  ERROR: Cannot connect to ComfyUI at {api_url}")
        print(f"  Make sure ComfyUI is running with --listen or --enable-cors-header")
        return False
    except Exception as e:
        print(f"  ERROR: {e}")
        return False

    # ── Wait for completion ──
    history_url = f"{api_url}/history/{prompt_id}"
    for _ in range(120):
        time.sleep(2)
        try:
            resp = requests.get(history_url, timeout=10)
            if resp.status_code == 200 and prompt_id in resp.json():
                history = resp.json()[prompt_id]
                outputs = history.get("outputs", {})
                for node_id, node_out in outputs.items():
                    for img_data in node_out.get("images", []):
                        img_filename = img_data.get("filename", "")
                        img_url = f"{api_url}/view?filename={img_filename}"
                        img_resp = requests.get(img_url, timeout=30)
                        if img_resp.status_code == 200:
                            os.makedirs(os.path.dirname(output_path), exist_ok=True)
                            img = Image.open(BytesIO(img_resp.content))
                            img = img.resize((width, height), Image.NEAREST)
                            img.save(output_path, "PNG")
                            print(f"  Saved: {output_path} ({width}x{height})")
                            return True
                break
        except:
            continue

    print(f"  WARNING: Generation may have failed for {output_path}")
    return False


def generate_placeholder(output_path: str, width: int, height: int, category: str):
    """Fallback: create colored placeholder if generation fails."""
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    color_map = {
        "character": (200, 60, 60),
        "monster": (100, 160, 60),
        "item": (200, 180, 60),
        "ui": (80, 80, 120),
        "bg": (40, 60, 40),
    }
    color = color_map.get(category, (100, 100, 100))
    img = Image.new("RGBA", (width, height), (*color, 255))
    img.save(output_path, "PNG")
    print(f"  [placeholder] {output_path}")


def main():
    parser = argparse.ArgumentParser(description="Generate game assets via ComfyUI")
    parser.add_argument("--host", default="127.0.0.1", help="ComfyUI host")
    parser.add_argument("--port", type=int, default=8188, help="ComfyUI port")
    parser.add_argument("--all", action="store_true", help="Generate ALL assets")
    parser.add_argument("--category", choices=["character", "monster", "item", "ui", "bg"],
                        help="Generate specific category only")
    parser.add_argument("--placeholder", action="store_true",
                        help="Skip ComfyUI, generate placeholder sprites only")
    parser.add_argument("--seed", type=int, default=-1, help="Random seed")
    parser.add_argument("--steps", type=int, default=20, help="Sampling steps")
    parser.add_argument("--model", default="sd_xl_base_1.0.safetensors",
                        help="Checkpoint filename in ComfyUI models folder")
    args = parser.parse_args()

    # ── Filter assets ──
    to_generate = ASSETS
    if args.category:
        to_generate = [a for a in ASSETS if a[4] == args.category]

    if not to_generate:
        print("No assets match the filter.")
        return

    print(f"\n  MU Chibi Squad - Asset Generator")
    print(f"  {'='*40}")
    print(f"  ComfyUI: {args.host}:{args.port}")
    print(f"  Assets:  {len(to_generate)}")
    print(f"  Model:   {args.model}")
    print()

    for i, (path, prompt, width, height, category) in enumerate(to_generate, 1):
        full_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), path)
        print(f"  [{i}/{len(to_generate)}] {os.path.basename(path)} ({width}x{height})")

        if args.placeholder:
            generate_placeholder(full_path, width, height, category)
        else:
            success = generate_comfyui(args.host, args.port, prompt, NEGATIVE_PROMPT,
                                       width, height, full_path, args.seed, args.steps)
            if not success:
                print(f"  -> Falling back to placeholder")
                generate_placeholder(full_path, width, height, category)

        print()

    print(f"  Done! All assets saved to {os.path.abspath(ASSETS_DIR)}")


if __name__ == "__main__":
    main()
