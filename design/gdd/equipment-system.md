# Equipment System

## Overview

The Equipment System covers all gear in MU Chibi Squad: weapons, armor, accessories, wings, and pets. Equipment defines a character's combat effectiveness through attack power, defense, stat bonuses, enhancement levels, sockets, and set bonuses.

## Player Fantasy

> "I find, upgrade, socket, and combine gear to make my chibi squad unstoppable."

## Detailed Design

### Equipment Slots

Each character can equip one item in each of the following slots:

| Slot | Gear Type |
| --- | --- |
| Weapon | Swords, staves, bows, staffs |
| Armor | Body armor |
| Helm | Headgear |
| Boots | Footwear |
| Gloves | Handgear |
| Wings | Special cosmetic/stat item |
| Pet | Companion item |
| Ring | Accessory |
| Amulet | Accessory |

### Item Tiers

| Tier | Color | Socket Slots | Drop Rarity |
| --- | --- | --- | --- |
| Normal | `#ffffff` (white) | 0 | Common |
| Magic | `#00ff00` (green) | 1 | Uncommon |
| Rare | `#ffff00` (yellow) | 2 | Rare |
| Set | `#4444ff` (blue) | 2 | Rare; belongs to a named set |
| Ancient | `#ff4444` (red) | 3 | Very rare; highest base stats |

### Base Stats

Every equipment piece has one or more of these base properties:

- `attackPower` — added to character's total attack.
- `defense` — reduces incoming damage.
- `requiredLevel` — minimum character level to equip.
- `requiredStats` — minimum Strength, Agility, Stamina, or Energy to equip.
- `statBonuses` — flat bonuses to core stats when equipped.
- `value` — gold value for selling to the shop.

### Requirements

Equipment can only be equipped when:
- The character meets `requiredLevel`.
- The character meets all `requiredStats` thresholds.
- The item's slot is free or the item is an upgrade (auto-equip replaces lower-value gear).

### Enhancement

Equipment can be enhanced up to **+15**. Each enhancement level increases base stats.

- **+1 to +9:** Each level grants a **+30%** bonus to the base `attackPower` or `defense` (e.g., +10 attack weapon becomes +13 at +1).
- **+10 to +15:** Each level grants a larger bonus (effectively +50% per level).
- Max level +15 cannot be exceeded.
- Enhancement also increases item `value`.

### Gem Sockets

Socket slots are determined by tier:
- Normal: 0 sockets
- Magic: 1 socket
- Rare: 2 sockets
- Set: 2 sockets
- Ancient: 3 sockets

A socketed gem grants a flat stat bonus:
- Strength gem: +4 Strength
- Other gems follow the same pattern (Agility, Stamina, Energy).

Gems cannot exceed the item's `maxSockets`.

### Set Bonuses

Set items belong to named sets (e.g., "Adamantine", "Dragon"). Wearing multiple pieces of the same set unlocks cumulative bonuses:

| Set Pieces | Example Bonus |
| --- | --- |
| 2 | +30 Defense |
| 3 | +60 Defense, +10 Strength |
| 4 | +100 Defense, +20 Strength |

The system counts equipped set pieces per character and applies the highest threshold reached for each set.

### Wings and Pets

Wings and pets are special equipment slots. They provide unique stat bonuses and are handled by dedicated systems (`wings.ts`, `pet.ts`). They follow the same equip/requirement rules as normal gear.

### Auto-Equip

The auto-equip system evaluates inventory items and equips the best available gear for each character automatically. It considers:
- Item tier.
- Attack power / defense.
- Enhancement level.
- Stat bonuses.
- Requirements.

### Equipment Drops

Monsters and bosses can drop equipment as part of the loot table. Drop rates and item level are scaled to the farming area.

## Formulas

### Enhance Bonus

```
+1 to +9:   stat *= 1.3
+10 to +15: stat *= 1.5
```

The implementation applies the multiplier per level and rounds/floors as appropriate.

### Socket Bonus

```
socketBonus(gemType) = { [gemType]: 4 }
```

### Total Attack Power

```
totalAttackPower = character.baseAttackPower
                 + sum(equipped.attackPower * enhanceMultiplier)
                 + sum(equipped.statBonuses.strength * strengthMultiplier)
                 + setBonuses.attackPower
                 + wingBonuses
                 + petBonuses
```

### Total Defense

```
totalDefense = sum(equipped.defense * enhanceMultiplier)
             + setBonuses.defense
```

## Edge Cases

| Case | Behavior |
| --- | --- |
| Equip item above level requirement | Throws error. |
| Equip item above stat requirement | Throws error. |
| Enhance beyond +15 | Throws "Max enhance level reached". |
| Add socket to item with no free sockets | Throws "No free sockets". |
| Auto-equip with empty inventory | No change. |

## Dependencies

- **Character Progression System:** Provides level and stats for requirements.
- **Combat System:** Uses attack power and defense for damage formulas.
- **Loot System:** Generates equipment drops.
- **Inventory System:** Stores unequipped items.
- **Save/Load System:** Persists equipped and inventory items.

## Tuning Knobs

| Knob | Current Value | Notes |
| --- | --- | --- |
| Max enhancement level | 15 | Classic MU-style endgame chase. |
| +1 to +9 multiplier | 1.3x | Smooth early progression. |
| +10 to +15 multiplier | 1.5x | Sharper late-game power spike. |
| Gem stat bonus | +4 | Meaningful but not overpowering. |
| Normal sockets | 0 | No customization for common gear. |
| Ancient sockets | 3 | Highest tier has most customization. |
| Set bonus thresholds | 2 / 3 / 4 pieces | Encourages full set hunting. |

## Acceptance Criteria

- [x] Weapons, armor, and accessories can be created with stats and requirements.
- [x] Equipment enforces level and stat requirements.
- [x] Enhancement increases stats up to +15.
- [x] Sockets and gems add stat bonuses.
- [x] Set bonuses apply based on equipped pieces.
- [x] Wings and pets integrate with the equipment slot system.
- [x] Auto-equip selects best available gear.
- [x] All core behaviors covered by unit tests.
- [ ] Future: enhancement failure/success chances, item refining, runewords.
