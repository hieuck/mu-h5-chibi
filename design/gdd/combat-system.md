# Combat System

## Overview

The Combat System resolves all player-vs-monster damage exchanges in MU Chibi Squad. It supports both basic attacks and class-locked skills, calculates damage from equipment and primary stats, applies defense reduction, and handles critical hits.

Combat is fully deterministic at the moment of calculation except for the random critical-hit roll. The system is intentionally simple: no positional targeting, no status effects, and no elemental damage in the MVP.

## Player Fantasy

> "My chibi hero swings a glowing weapon, crits for big numbers, and melts monster health bars while I watch the fight unfold."

Players should feel that:
- Equipping better weapons and raising primary stats directly increases damage.
- Critical hits are exciting but not required to progress.
- Skills are class-flavored power spikes that cost mana.

## Detailed Design

### Combat Participants

- **Attacker:** A `Character` entity. Has `totalAttackPower`, primary stat, agility, and mana.
- **Defender:** A `Monster` entity. Has `hp`, `defense`, `level`, and `isAlive`.

### Attack Types

1. **Basic Attack**
   - Uses `attack(attacker, defender)`.
   - Calls `calculateCritDamage(...)`.
   - Applies damage to defender.
   - Returns the damage dealt.

2. **Skill Attack**
   - Uses `combatTickWithSkills(attacker, defender, skillDb)`.
   - Picks the first unlocked skill the attacker can cast (mana and cooldown available).
   - Calls `calculateSkillDamage(...)` = base damage × skill damage multiplier.
   - Applies critical hit chance on top of skill damage.
   - Deducts mana cost from attacker.
   - If no skill is available, falls back to a basic attack.

### Primary Stats by Class

| Class | Primary Stat |
| --- | --- |
| Dark Knight | Strength |
| Magic Gladiator | Strength |
| Dark Wizard | Energy |
| Summoner | Energy |
| Elf | Agility |

Agility also drives critical-hit chance for all classes.

## Formulas

### Base Damage

```
weaponDamage = attacker.totalAttackPower
statDamage   = primaryStat * 0.3
baseDamage   = floor(weaponDamage + statDamage)
reduction    = 100 / (100 + defender.defense)
damage       = max(1, floor(baseDamage * reduction))
```

### Critical Hit

```
critChance = attacker.stats.agility * 0.002
isCrit     = random() < critChance
critDamage = floor(damage * 1.5)
```

### Skill Damage

```
skillDamage = floor(calculateDamage(attacker, defender) * skill.damageMultiplier)
```

Skill damage can then crit using the same critical-hit logic.

## Edge Cases

| Case | Behavior |
| --- | --- |
| Defender already dead | `takeDamage` is a no-op; `isAlive` remains `false`. |
| Damage would reduce HP below 0 | HP is clamped to 0 and `isAlive` becomes `false`. |
| Attacker has 0 attack power and low stats | Damage is floored to `1` by the `max(1, ...)` guard. |
| No unlocked skill or insufficient mana | Falls back to basic attack. |
| Multiple unlocked skills | Currently selects the first available skill; future versions may prioritize by damage or cooldown. |

## Dependencies

- **Character System:** Provides `Character`, stats, equipment, mana, and class.
- **Monster System:** Provides `Monster` with `hp`, `defense`, `takeDamage`, and `isAlive`.
- **Skill System:** Provides `Skill`, `SkillDatabase`, and `getUnlockedSkills`.
- **Equipment System:** Provides `totalAttackPower` via equipped weapon.

## Tuning Knobs

| Knob | Current Value | Notes |
| --- | --- | --- |
| Stat-to-damage ratio | 0.3 | Lower for weapons-heavy balance; raise for stat-heavy balance. |
| Defense reduction denominator | `100 + defense` | Higher denominator = defense scales linearly and softly. |
| Critical multiplier | 1.5x | Standard "feels good" multiplier. |
| Agility-to-crit-chance ratio | 0.002 | 500 agility = 100% crit (watch for caps). |
| Minimum damage | 1 | Prevents zero-damage stalemates. |

## Acceptance Criteria

- [x] Basic attacks deal damage based on weapon power and primary stat.
- [x] Defense reduces incoming damage.
- [x] Critical hits occur based on agility and multiply damage by 1.5x.
- [x] Skills deal multiplied damage and consume mana.
- [x] Monster HP cannot drop below 0 and death sets `isAlive = false`.
- [x] All formulas are covered by unit tests.
- [ ] Future: implement critical-hit cap, skill priority logic, and elemental damage.
