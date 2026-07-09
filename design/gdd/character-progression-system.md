# Character Progression System

## Overview

The Character Progression System defines how individual chibi heroes grow in MU Chibi Squad: creation, leveling, experience, stat allocation, HP/MP scaling, and the classic MU reset mechanic.

## Player Fantasy

> "I watch my Dark Knight grow from a weak beginner to a legendary hero, choosing exactly where each stat point goes, then resetting to become even stronger."

## Detailed Design

### Character Creation

A `Character` is created with:
- A player-given `name`.
- A `class` chosen from the five playable classes.
- Base stats determined by class (see table below).
- Level 1, 0 experience, full HP/MP, and 0 gold.

### Playable Classes and Base Stats

| Class | Strength | Agility | Stamina | Energy |
| --- | --- | --- | --- | --- |
| Dark Knight | 28 | 20 | 25 | 10 |
| Dark Wizard | 18 | 18 | 15 | 30 |
| Elf | 22 | 25 | 20 | 14 |
| Summoner | 15 | 20 | 15 | 32 |
| Magic Gladiator | 26 | 20 | 20 | 16 |

### Leveling

Characters gain experience primarily from auto-farm kills. Each kill grants `EXP_PER_KILL = 50`.

When accumulated experience reaches the threshold for the current level, the character:
- Levels up.
- Gains 5 unspent stat points.
- Carries over excess experience toward the next level.

## Formulas

### Experience Required per Level

```
expRequired(level) = level * 100
```

### HP and MP

```
maxHp = stamina * 10 + level * 5 + equipmentHpBonus
maxMp = energy * 5 + level * 2
```

HP is restored to max on level-up and reset. MP is spent when casting skills and regenerates over time.

### Stat Allocation

```
allocateStat(stat, amount):
  require amount > 0
  require amount <= unspentStatPoints
  stats[stat] += amount
  unspentStatPoints -= amount
```

Allocated stats immediately affect:
- Damage (primary stat).
- Critical chance (agility).
- Max HP (stamina).
- Max MP (energy).

## Reset System

When a character reaches level 10 or higher, the player may perform a **reset**:
- Level returns to 1.
- Experience returns to 0.
- Unspent stat points are reset to 0.
- All four base stats permanently increase by 5.
- Reset count increments by 1.
- HP/MP are restored to new max values.

Equipped items are preserved (their level requirements still apply, so low-level characters may not benefit from high-level gear immediately).

This creates the classic MU "reset loop": reach level cap → reset → stronger base → repeat.

## Edge Cases

| Case | Behavior |
| --- | --- |
| Allocating 0 or negative points | Throws error. |
| Allocating more points than available | Throws error. |
| Reset below minimum level (10) | Throws error. |
| Equipping an item above character level | Throws error. |
| Equipping class-restricted item on wrong class | Throws error. |

## Dependencies

- **Combat System:** Uses character stats, level, and equipment for damage.
- **Equipment System:** Enforces level and class requirements.
- **Skill System:** Uses energy and level to determine available skills.
- **Save/Load System:** Persists character state across sessions.

## Tuning Knobs

| Knob | Current Value | Notes |
| --- | --- | --- |
| EXP per kill | 50 | Base idle progression rate. |
| EXP required per level | `level * 100` | Linear curve; easy early, slower later. |
| Stat points per level | 5 | Gives meaningful choices without overwhelming. |
| Stat gain per reset | +5 all stats | Compounds over multiple resets. |
| Minimum reset level | 10 | First reset milestone. |
| HP per stamina | 10 | Stamina is primary HP driver. |
| MP per energy | 5 | Energy is primary MP driver. |

## Acceptance Criteria

- [x] Each class has unique base stats.
- [x] Characters level up when experience threshold is reached.
- [x] Each level-up grants 5 unspent stat points.
- [x] Stat allocation updates the chosen stat and reduces unspent points.
- [x] Reset returns character to level 1 with permanent +5 base stats.
- [x] HP and MP scale with stats and level.
- [x] Equipment level and class restrictions are enforced.
- [x] All core behaviors are covered by unit tests.
- [ ] Future: class-specific passive bonuses, skill trees, and prestige tiers.
