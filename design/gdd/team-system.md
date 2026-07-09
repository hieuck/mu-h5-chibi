# Team System

## Overview

The Team System manages the player's squad of up to four chibi heroes. It handles recruitment, formation, total attack power aggregation, coordinated attacks, and squad-wide survival checks.

## Player Fantasy

> "I build a squad of four heroes — a frontline knight, a mage, an elf, and a summoner — and they fight together automatically."

## Detailed Design

### Squad Composition

- A team can hold **up to 4 characters**.
- The player recruits characters from the five playable classes.
- Each character retains their own level, stats, equipment, and skills.

### Squad Management

| Action | Behavior |
| --- | --- |
| Add character | Appends to squad if space remains. |
| Remove character | Removes by index and returns the character. |
| Max size check | Adding a 5th character throws "Squad is full (max 4)". |

### Formations

The squad can be arranged in one of three formations:

- `line` (default)
- `V`
- `circle`

Formations are currently cosmetic and stored on the team. Future systems may apply formation-based bonuses.

### Team Attack

When farming or fighting a boss, all living team members attack the same target in order:

1. First member attacks.
2. If the target survives, the next member attacks.
3. Loop until the target dies or all members have attacked.

```
team.allAttack(monster):
  for member in members:
    if monster not alive: break
    damage = calculateDamage(member, monster)
    monster.takeDamage(damage)
```

### Total Attack Power

Team total attack power is the sum of each member's `totalAttackPower`:

```
team.totalAttackPower = sum(member.totalAttackPower)
```

This value is used by the auto-farm system to estimate farm speed and by UI to display squad strength.

### Squad Survival

A team is considered alive as long as at least one member has `hp > 0`:

```
team.isAlive = any(member.hp > 0)
```

If all members reach 0 HP, the team is defeated. In idle farming, the team retreats or waits for regeneration.

### Shared Loot and Experience

During auto-farm:
- Loot is added to a shared inventory.
- Experience from kills is awarded to each member that participated in the kill.
- Gold drops are shared across the squad.

## Formulas

### Max Squad Size

```
MAX_SQUAD_SIZE = 4
```

### Total Attack Power

```
totalAttackPower = Σ member.totalAttackPower
```

### Coordinated Damage

```
allAttack(monster):
  damages = []
  for member in members:
    if !monster.isAlive: break
    damage = calculateDamage(member, monster)
    monster.takeDamage(damage)
    damages.push(damage)
  return damages
```

## Edge Cases

| Case | Behavior |
| --- | --- |
| Add 5th member | Throws "Squad is full (max 4)". |
| Remove invalid index | Returns `undefined`. |
| Attack dead target | Stops early; no further attacks. |
| All members at 0 HP | `isAlive` returns `false`. |
| Empty team | `totalAttackPower` is 0; `isAlive` is `false`. |

## Dependencies

- **Character Progression System:** Provides squad members and their stats.
- **Equipment System:** Contributes to each member's total attack power and defense.
- **Combat System:** Provides damage calculation for coordinated attacks.
- **Auto-Farm System:** Uses team attack power and survival state.
- **Save/Load System:** Persists squad composition and formation.

## Tuning Knobs

| Knob | Current Value | Notes |
| --- | --- | --- |
| Max squad size | 4 | Classic party size; UI and balance built around this. |
| Formations | line / V / circle | Cosmetic for MVP; future bonuses possible. |
| Attack order | roster order | Could be influenced by formation or agility. |

## Acceptance Criteria

- [x] Team can add and remove characters.
- [x] Team enforces max size of 4.
- [x] Team aggregates total attack power.
- [x] Team can perform coordinated attack on a single target.
- [x] Team reports alive status based on member HP.
- [x] Formation can be set and retrieved.
- [x] All core behaviors covered by unit tests.
- [ ] Future: formation bonuses, team synergies, and squad orders.
