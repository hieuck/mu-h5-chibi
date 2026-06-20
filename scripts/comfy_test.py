#!/usr/bin/env python3
"""Test connection to ComfyUI and list available models."""
import requests
import sys

HOST = sys.argv[1] if len(sys.argv) > 1 else "127.0.0.1"
PORT = int(sys.argv[2]) if len(sys.argv) > 2 else 8188

URL = f"http://{HOST}:{PORT}"

print(f"\n  Testing ComfyUI connection: {URL}")
print()

# Check if ComfyUI is running
try:
    r = requests.get(f"{URL}/system_stats", timeout=5)
    if r.status_code == 200:
        stats = r.json()
        print(f"  ✅ ComfyUI is running!")
        print(f"     Version: {stats.get('system', {}).get('version', 'unknown')}")
        print(f"     Devices: {len(stats.get('devices', []))} GPU(s)")
    else:
        print(f"  ⚠️  ComfyUI returned status {r.status_code}")
except requests.exceptions.ConnectionError:
    print(f"  ❌ Cannot connect to ComfyUI at {URL}")
    print()
    print(f"  Troubleshooting:")
    print(f"    1. Start ComfyUI with: python main.py --listen --enable-cors-header")
    print(f"    2. Check if port {PORT} is open")
    print(f"    3. If using different IP/port, pass args: python comfy_test.py <host> <port>")
    sys.exit(1)

# List available checkpoints
try:
    r = requests.get(f"{URL}/object_info/CheckpointLoaderSimple", timeout=5)
    if r.status_code == 200:
        info = r.json()
        ckpts = info.get("CheckpointLoaderSimple", {}).get("input", {}).get("required", {}).get("ckpt_name", [{}])[0] if info else []
        print(f"\n  Available models ({len(ckpts)}):")
        for c in ckpts[:10]:
            print(f"    - {c}")
        if len(ckpts) > 10:
            print(f"    ... and {len(ckpts) - 10} more")
except:
    pass

print(f"\n  To generate assets: python scripts/comfy_gen.py --host {HOST} --port {PORT} --all")
print()
