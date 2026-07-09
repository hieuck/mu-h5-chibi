# Wings System

## Overview

Wings are class-specific special equipment that provide percentage attack bonuses, defense, and HP. Each class has three visual wing tiers with increasing power.

## Player Fantasy

> "My chibi hero sprouts legendary wings, gaining massive attack power and survivability."

## Detailed Design

### Wing Tiers

| Tier | Item Tier Color | Attack Power % | Defense Range | HP Bonus Range |
| --- | --- | --- | --- | --- |
| Tier 1 | Rare | +12% | 15–20 | 35–50 |
| Tier 2 | Ancient | +40% | 60–70 | 120–150 |
| Tier 3 | Mythic | +65% | 110–120 | 270–300 |

### Class-Specific Wings

Each class has a unique wing name and stat distribution:

- Dark Knight: Wings of Dragon
- Dark Wizard: Wings of Heaven
- Elf: Wings of Elf
- Summoner: Wings of Summoner
- Magic Gladiator: Wings of Magician

### Wing Equipment

Wings are implemented as `Equipment` with slot `Wings`:
- `requiredClass` restricts equipping to the matching class.
- `attackPowerPercent` increases total attack power.
- `defense` and `hpBonus` add to survivability.

### Creating Wings

```
createWings({ name, tier, class, attackPowerPercent, defense, hpBonus })
getWingForClass(characterClass, wingTier)
```

## Dependencies

- **Equipment System:** Wings use the equipment slot framework.
- **Character Progression System:** Enforces class restrictions.
- **Combat System:** Applies attack power percent bonuses.

## Tuning Knobs

| Knob | Notes |
| --- | --- |
| Tier 3 attack percent | 65% is a major power spike. |
| Defense/HP scaling | Tier 2 roughly triples Tier 1; Tier 3 roughly doubles Tier 2. |
| Class restriction | Keeps wings thematically aligned. |

## Acceptance Criteria

- [x] Wings exist for all five classes.
- [x] Three tiers provide escalating power.
- [x] Wings enforce class restrictions.
- [x] Wings contribute attack percent, defense, and HP bonuses.
- [ ] Future: wing upgrades, wing skills, and cosmetic variants.
