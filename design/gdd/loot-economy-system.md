# Loot and Economy System

## Overview

The Loot and Economy System handles everything the player gains from killing monsters: experience, gold, equipment drops, inventory management, selling junk, and buying from shops.

## Player Fantasy

> "My squad slaughters goblins, collects gold and gear, sells the junk, and saves up for the next big upgrade."

## Detailed Design

### Gold

Gold is the primary currency. It is awarded when a monster dies.

#### Gold Drop Formula

```
monster.goldValue = level * 10 + randomFactor
```

`randomFactor` adds variance so kills don't feel identical. Higher-level monsters always drop more gold than lower-level ones.

#### Gold Distribution

When a monster dies during auto-farm, its gold is added to the team member who landed the killing blow. Gold is stored per character.

### Experience

Experience is also awarded on monster death. Each kill grants a flat `EXP_PER_KILL = 50` to the killer. Characters level up when their accumulated experience crosses the threshold.

### Loot Drops

Each monster can have a `DropTable` containing item entries. Each entry specifies:
- `itemId` — identifier resolved through the item database.
- `chance` — probability between 0 and 1 of dropping on death.

When a monster dies, the drop table is rolled. Successful drops are added to the shared inventory.

```
rollDrop(table):
  for entry in table.entries:
    if random() < entry.chance:
      add itemId to loot result
```

### Inventory

The inventory stores unequipped equipment.

- Default capacity: **40 slots**.
- Items are added sequentially.
- Adding to a full inventory throws "Inventory is full".
- Items can be removed by index.
- Items can be filtered by equipment slot.

### Item Value and Selling

Every equipment piece has a `value` in gold.

- **Player sells to shop:** `sellPrice = floor(value / 2)`.
- **Shop buy price:** Equal to the item's listed price.

The minimum sell price is 10 gold to prevent trivial transactions.

### Auto-Sell

To prevent inventory clutter during idle play, the game can auto-sell low-tier items:

- Targets Normal and Magic tier items.
- Sells them for `floor(value / 2)` gold.
- Removes them from inventory.
- Keeps Rare, Set, and Ancient items.

### Shops

Shops sell fixed items for gold:

- HP Potion — 500 gold
- Mana Potion — 300 gold

Buying requires enough gold and adds the resolved item to inventory.

## Formulas

### Monster Gold

```
goldValue(level) = level * 10 + random(0, level * 5)
```

### Experience per Kill

```
EXP_PER_KILL = 50
```

### Sell Price

```
sellPrice(item) = max(10, floor(item.value / 2))
```

### Drop Roll

```
drop(itemId, chance) = random() < chance
```

### Inventory Full

```
isFull = items.length >= maxSlots
```

## Edge Cases

| Case | Behavior |
| --- | --- |
| Monster has no drop table | No loot; gold and EXP still awarded. |
| Monster survives the tick | No rewards. |
| Drop itemId unresolved | Drop skipped. |
| Inventory full on loot | Throws "Inventory is full". |
| Buy item without enough gold | Throws "Not enough gold". |
| Sell value below 10 | Clamped to 10 gold. |

## Dependencies

- **Combat System:** Determines when monsters die.
- **Auto-Farm System:** Triggers reward generation each tick.
- **Equipment System:** Provides item definitions and values.
- **Inventory System:** Stores drops and purchased items.
- **Team System:** Receives gold and experience.
- **Character Progression System:** Consumes experience for leveling.

## Tuning Knobs

| Knob | Current Value | Notes |
| --- | --- | --- |
| EXP per kill | 50 | Base progression rate. |
| Gold per level | `level * 10` | Linear gold scaling. |
| Inventory slots | 40 | Enough for idle sessions; may need expansion. |
| Auto-sell tiers | Normal, Magic | Keeps Rare+ for player review. |
| Sell ratio | 50% | Standard vendor ratio. |
| Minimum sell price | 10 | Prevents 0-gold sales. |

## Acceptance Criteria

- [x] Monsters drop gold on death scaled by level.
- [x] Monsters drop items from drop tables.
- [x] Inventory stores up to 40 items.
- [x] Items can be sold for half value (minimum 10 gold).
- [x] Players can buy items from shops.
- [x] Auto-sell can convert low-tier junk to gold.
- [x] All core behaviors covered by unit tests.
- [ ] Future: auction house, crafting materials, and stackable consumables.
