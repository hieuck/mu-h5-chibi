# Boss Encounter System

## Overview

Boss encounters are periodic high-value fights that break up the idle farming loop. Bosses are stronger monsters with level requirements, special abilities, and better loot and gold rewards.

## Player Fantasy

> "After farming for a while, a Goblin King spawns. My squad meets the level requirement, defeats it, and walks away with a rare drop and a pile of gold."

## Detailed Design

### Boss Encounter Structure

A `BossEncounter` bundles:

| Field | Description |
| --- | --- |
| `boss` | The `Monster` instance to fight. |
| `requiredLevel` | Minimum character level to attempt. |
| `area` | Map area where the boss appears. |
| `goldReward` | Extra gold awarded on defeat. |
| `abilities` | Optional list of special ability names. |

### Boss Stats

Bosses are standard `Monster` instances with inflated stats:

| Boss | HP | Defense | Level | Area | Required Level |
| --- | --- | --- | --- | --- | --- |
| Goblin King | 300 | 15 | 10 | brave | TBD |
| Skeleton Lord | 600 | 30 | 18 | TBD | TBD |
| Dragon King | 2000 | 60 | 35 | dragon_valley | TBD |

Bosses use the same combat and damage formulas as regular monsters, but their higher HP and defense make fights last longer.

### Level Gate

Players cannot attempt a boss until at least one character meets `requiredLevel`:

```
encounter.canAttempt(characterLevel) = characterLevel >= requiredLevel
```

This prevents low-level squads from being instantly wiped and gives players a progression target.

### Boss Spawn Rhythm

Bosses spawn on a fixed interval during auto-farm. In the current test reference, a boss is considered for spawn every 5 farm ticks:

```
BOSS_INTERVAL = 5 ticks
bossSpawned = tickCount % BOSS_INTERVAL === 0
```

This is a placeholder rhythm; the real spawn logic will integrate with area-specific boss schedules.

### Rewards

Bosses provide enhanced rewards compared to normal monsters:
- **Base gold value:** `level * 10 + randomFactor`, same formula but level is higher.
- **Bonus gold reward:** A flat `goldReward` added on defeat.
- **Rare loot table:** Bosses drop from curated drop tables containing rare, set, or ancient items.
- **Experience:** Same `EXP_PER_KILL = 50` per killing blow.

### Special Abilities

Bosses can have named abilities (e.g., "Fire Breath", "Tail Swipe"). These are descriptive in MVP and may trigger combat effects in future iterations.

## Formulas

### Level Requirement Check

```
canAttempt(level) = level >= requiredLevel
```

### Spawn Interval

```
spawnCheck(tickCount) = tickCount % BOSS_INTERVAL === 0
```

### Boss Gold Reward

```
totalGold = boss.goldValue + goldReward
```

## Edge Cases

| Case | Behavior |
| --- | --- |
| Below required level | Boss attempt blocked. |
| Boss not killed in one tick | Fight continues on next ticks until one side dies. |
| Boss drop table empty | Only gold and EXP awarded. |
| Multiple bosses eligible | Priority based on area or rotation. |

## Dependencies

- **Monster Entity:** Bosses are specialized monsters.
- **Combat System:** Handles damage and survival.
- **Loot System:** Provides curated boss drop tables.
- **Team System:** Squad attacks the boss.
- **Auto-Farm System:** Provides spawn ticks and area context.
- **Character Progression System:** Provides level gates.

## Tuning Knobs

| Knob | Current Value | Notes |
| --- | --- | --- |
| Spawn interval | 5 ticks | Placeholder; will become area-based. |
| Bonus gold reward | 0–500+ | Tuned per boss difficulty. |
| Required level | Varies | Gates content and creates goals. |
| Drop table rarity | Rare/Set/Ancient | Bosses are primary source of top-tier loot. |

## Acceptance Criteria

- [x] Boss encounter encapsulates a monster, level gate, area, and rewards.
- [x] Level requirement prevents under-leveled attempts.
- [x] Bosses have higher stats and better rewards than normal monsters.
- [x] Bosses can have curated drop tables.
- [x] Special ability names can be attached for flavor/future mechanics.
- [x] All core behaviors covered by unit tests.
- [ ] Future: spawn scheduling, boss skills with combat effects, and multiplayer raids.
