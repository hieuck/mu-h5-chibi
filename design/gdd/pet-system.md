# Pet System

## Overview

Pets are companion creatures that boost character combat stats and deal bonus damage. They are class-agnostic and scale with pet level and rarity.

## Player Fantasy

> "My loyal pet fights beside me, adding extra bite to every attack and making my character stronger."

## Detailed Design

### Pet Properties

| Property | Description |
| --- | --- |
| `name` | Display name |
| `rarity` | Common, Rare, or Legendary |
| `attackBonus` | Flat attack bonus added to owner |
| `defenseBonus` | Flat defense bonus added to owner |
| `hpBonus` | Flat HP bonus added to owner |
| `level` | Starts at 1 and can increase |

### Pet Rarity Multipliers

| Rarity | Damage Multiplier |
| --- | --- |
| Common | 1.0x |
| Rare | 1.2x |
| Legendary | 1.5x |

### Pet Damage

Pets contribute bonus damage on attacks:

```
petDamage = floor((attackBonus + level * 2) * rarityMultiplier)
```

### Stat Bonuses

Pet bonuses are added directly to the owner's stats while the pet is active. This increases total attack power, defense, and max HP.

## Dependencies

- **Character Progression System:** Receives stat bonuses.
- **Combat System:** Pet damage contributes to total damage.
- **Equipment System:** Pet occupies the Pet equipment slot.

## Tuning Knobs

| Knob | Notes |
| --- | --- |
| Rarity multipliers | 1.0 / 1.2 / 1.5 create clear upgrade tiers. |
| Level scaling | `level * 2` gives slow but meaningful growth. |
| Bonus values | Tuned per pet to match content difficulty. |

## Acceptance Criteria

- [x] Pets have rarity, level, and stat bonuses.
- [x] Pet damage scales with attack bonus, level, and rarity.
- [x] Pet bonuses apply to owner stats.
- [ ] Future: pet evolution, pet skills, and pet inventory.
