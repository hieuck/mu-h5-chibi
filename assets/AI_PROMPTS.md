# MU Chibi Squad - AI Asset Generation

## ⚡ ComfyUI (Local, khuyến nghị)

### Cài đặt
```bash
# ComfyUI đã có sẵn. Chạy với API mode:
python main.py --listen 127.0.0.1 --port 8188 --enable-cors-header
```

### Gen toàn bộ assets
```bash
cd mu-h5-chibi
python scripts/comfy_gen.py --host 127.0.0.1 --port 8188 --all
```

### Kiểm tra kết nối
```bash
python scripts/comfy_test.py 127.0.0.1 8188
```

### Gen theo category
```bash
# Chỉ gen characters
python scripts/comfy_gen.py --category character

# Chỉ gen monsters
python scripts/comfy_gen.py --category monster

# Gen với seed cố định (cùng 1 style)
python scripts/comfy_gen.py --all --seed 42
```

### Gen placeholder (không cần ComfyUI)
```bash
python scripts/comfy_gen.py --all --placeholder
python scripts/gen_placeholders.py
```

### Tùy chỉnh model
```bash
# Dùng model khác (phải có trong ComfyUI/models/checkpoints/)
python scripts/comfy_gen.py --model "animagine-xl-3.1.safetensors" --all
```

### Script tự động gen từng asset:
- `scripts/comfy_gen.py` — Gen qua ComfyUI API, auto fallback placeholder
- `scripts/comfy_test.py` — Kiểm tra kết nối ComfyUI
- `scripts/gen_placeholders.py` — Gen hình khối màu (không cần AI)

## Công cụ khác

- **Stable Diffusion** (manual): Dùng prompt bên dưới
- **Midjourney**: Copy prompt → paste → upscale → export PNG
- **DALL-E 3**: Tốt cho item icons, UI elements

## Style Guidelines

```
Style: chibi, super deformed, cute, 4-head proportion
Palette: vibrant, high saturation, fantasy colors
Lineart: clean, thick outlines, cel-shaded
Background: transparent (PNG)
```

---

## 1. Character Sprite Sheets (64×64px, 4 frames idle + 4 attack)

### Dark Knight
```
chibi knight character sprite sheet, 4 frames idle animation, 
64x64 pixels per frame, top-down isometric view, 
wearing full plate armor with greatsword, red and black color scheme, 
clean pixel art, transparent background, grid layout 4x2
```

### Dark Wizard
```
chibi wizard character sprite sheet, 4 frames idle animation, 
64x64 pixels per frame, top-down isometric view, 
wearing blue robe with staff, glowing magic effects, 
clean pixel art, transparent background, grid layout 4x2
```

### Elf
```
chibi elf archer character sprite sheet, 4 frames idle animation, 
64x64 pixels per frame, top-down isometric view, 
green outfit with bow and arrow, elven ears, 
clean pixel art, transparent background, grid layout 4x2
```

### Summoner
```
chibi summoner character sprite sheet, 4 frames idle animation, 
64x64 pixels per frame, top-down isometric view, 
purple dark outfit with summoning orb, mystical aura, 
clean pixel art, transparent background, grid layout 4x2
```

### Magic Gladiator
```
chibi magic knight sprite sheet, 4 frames idle animation, 
64x64 pixels per frame, top-down isometric view, 
orange-red armor with elemental sword, hybrid warrior-mage, 
clean pixel art, transparent background, grid layout 4x2
```

---

## 2. Monster Sprite Sheets (32×32-48×48, 2 frames idle)

### Goblin
```
chibi goblin monster sprite sheet, 2 frames idle animation, 
32x32 pixels per frame, top-down view, 
small green goblin with dagger, big ears, 
pixel art, transparent background
```

### Skeleton
```
chibi skeleton monster sprite sheet, 2 frames idle animation, 
32x32 pixels per frame, top-down view, 
cute skeleton warrior with bone club, 
pixel art, transparent background
```

### Giant
```
chibi giant monster sprite sheet, 2 frames idle animation, 
48x48 pixels per frame, top-down view, 
large muscular ogre with spiked club, bigger than other monsters, 
pixel art, transparent background
```

---

## 3. Item Icons (32×32px)

### Weapons
```
fantasy weapon icons, 32x32 pixel art, top-down view, 
collection of swords, axes, staves, bows on transparent background, 
grid layout, various rarities (white/blue/yellow/green),
game inventory style
```

### Armor Icons
```
fantasy armor icons, 32x32 pixel art, top-down view, 
collection of helmets, chestplates, boots, shields, 
grid layout, pixel art, transparent background
```

---

## 4. UI Elements

### Panel
```
game UI panel corner piece, 16x16 pixel art, 
dark purple fantasy theme, golden border trim, 
rpg menu style, seamless tileable
```

### Button
```
game UI button, 32x16 pixel art, 
golden frame with dark background, rounded corners, 
rpg menu style, hover and pressed states in same row
```

### Heart icon
```
pixel art heart icon, 16x16, 
red crystal heart, game UI health display, 
chibi style, cute
```

---

## 5. Background

### Brave Grounds (800×600)
```
fantasy game background, 800x600 pixels, 
green grassy field with light forest edge, 
blue sky with clouds, top-down rpg style, 
bright daytime, suitable for game level backdrop
```

---

## Hướng dẫn xử lý

1. **Generate** từng sprite sheet với prompt ở trên
2. **Crop & Resize** về đúng kích thước (64×64, 32×32, v.v.)
3. **Export PNG** với transparent background
4. **Đặt file** vào đúng thư mục:
   - `assets/sprites/{key}.png` - characters + monsters
   - `assets/items/{name}.png` - item icons
   - `assets/ui/{name}.png` - UI elements
   - `assets/bg/{name}.png` - backgrounds

5. **Sprite sheet layout**: mỗi frame nằm cạnh nhau theo chiều ngang
   - Char idle: 4 frames = 256×64
   - Monster idle: 2 frames = 64×32
