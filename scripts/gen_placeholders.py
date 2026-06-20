import os
from PIL import Image, ImageDraw

OUTPUTS = {
    "assets/sprites/dk.png":       (64, 64, "#cc4444", "⚔"),
    "assets/sprites/dw.png":       (64, 64, "#4444cc", "✦"),
    "assets/sprites/elf.png":      (64, 64, "#44cc44", "🏹"),
    "assets/sprites/sum.png":      (64, 64, "#cc44cc", "◆"),
    "assets/sprites/mg.png":       (64, 64, "#cc8844", "⚡"),
    "assets/sprites/goblin.png":   (32, 32, "#66aa44", "G"),
    "assets/sprites/skeleton.png": (32, 32, "#ddddcc", "S"),
    "assets/sprites/giant.png":    (48, 48, "#885533", "T"),
}

for path, (w, h, color, symbol) in OUTPUTS.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    sheet = Image.new("RGBA", (w * 4, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(sheet)
    for frame in range(4):
        x = frame * w
        draw.ellipse([x + 4, 4, x + w - 4, h - 4], fill=color)
        draw.text((x + w//2 - 4, h//2 - 6), symbol, fill="white")
    sheet.save(path)
    print(f"Created {path} ({w*4}x{h})")

# ── Item icons ──
os.makedirs("assets/items", exist_ok=True)
item_sheet = Image.new("RGBA", (32 * 4, 32), (0, 0, 0, 0))
d = ImageDraw.Draw(item_sheet)
colors = ["#cccccc", "#4488ff", "#ffff00", "#00ff44"]
for i, c in enumerate(colors):
    d.rectangle([i*32 + 4, 4, i*32 + 28, 28], fill=c)
item_sheet.save("assets/items/weapons.png")
print("Created assets/items/weapons.png")

# ── UI ──
os.makedirs("assets/ui", exist_ok=True)
for name, w, h, color in [("panel.png",16,16,"#2a2a4e"), ("button.png",32,16,"#4a4a6e"), ("heart.png",16,16,"#cc4444")]:
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0,0,w-1,h-1], radius=2, fill=color)
    img.save(f"assets/ui/{name}")
    print(f"Created assets/ui/{name}")

# ── Background ──
os.makedirs("assets/bg", exist_ok=True)
bg = Image.new("RGBA", (800, 600), "#1a2a1a")
d = ImageDraw.Draw(bg)
for y in range(0, 600, 40):
    d.line([(0, y), (800, y)], fill="#2a3a2a", width=1)
for x in range(0, 800, 40):
    d.line([(x, 0), (x, 600)], fill="#2a3a2a", width=1)
d.rectangle([0, 480, 800, 600], fill="#3a2a1a")
bg.save("assets/bg/brave_grounds.png")
print("Created assets/bg/brave_grounds.png")

print("\nAll placeholder assets generated!")
