# Skill System

## Overview

The Skill System defines every active ability in MU Chibi Squad. Each class has a unique skill list that unlocks as characters level up. Skills consume mana, have cooldowns, and can target a single enemy, multiple enemies (AoE), or the caster.

## Player Fantasy

> "My Dark Knight unleashes a Comet Fall, my Elf fires a Triple Shot, and my Dark Wizard drops a Nova — each class feels distinct in combat."

## Detailed Design

### Skill Properties

Every skill has:

| Property | Description |
| --- | --- |
| `id` | Unique identifier |
| `name` | Display name |
| `class` | Which class can use it |
| `damageMultiplier` | Multiplier applied to base attack damage |
| `manaCost` | Mana spent per cast |
| `cooldownMs` | Minimum time between casts (milliseconds) |
| `unlockLevel` | Character level required to learn |
| `target` | `single`, `aoe`, or `self` |

### Target Types

- **Single:** Hits one target (usually the current farm target or boss).
- **AoE:** Hits all enemies in the farming area.
- **Self:** Buff or heal applied to the caster.

### Skill Unlocking

Skills are automatically unlocked when a character reaches the required level. The `SkillDatabase.getUnlockedSkills(character)` method returns all skills the character can currently use.

### Class Skill Lists

#### Dark Knight

| Skill | Level | Mana | Cooldown | Target | Multiplier |
| --- | --- | --- | --- | --- | --- |
| Slash | 1 | 8 | 2000ms | Single | 1.5x |
| Power Slash | 10 | 15 | 4000ms | Single | 2.5x |
| Great Fortitude | 15 | 20 | 30000ms | Self | 0x (buff) |
| Rageful Blow | 20 | 25 | 6000ms | Single | 3.5x |
| Twisting Slash | 25 | 18 | 3500ms | AoE | 2.0x |
| Hell Buster | 40 | 40 | 10000ms | AoE | 4.5x |
| Comet Fall | 60 | 60 | 15000ms | AoE | 5.5x |

#### Dark Wizard

| Skill | Level | Mana | Cooldown | Target | Multiplier |
| --- | --- | --- | --- | --- | --- |
| Fire Ball | 1 | 6 | 1500ms | Single | 1.5x |
| Poison | 8 | 10 | 3000ms | Single | 2.0x |
| Lightning | 15 | 15 | 4000ms | Single | 2.5x |
| Meteor | 20 | 20 | 5000ms | AoE | 3.0x |
| Blast | 28 | 25 | 6000ms | AoE | 3.5x |
| Soul Barrier | 30 | 30 | 45000ms | Self | 0x (buff) |
| Inferno | 45 | 45 | 10000ms | AoE | 4.5x |
| Nova | 70 | 70 | 20000ms | AoE | 6.0x |

#### Elf

| Skill | Level | Mana | Cooldown | Target | Multiplier |
| --- | --- | --- | --- | --- | --- |
| Arrow | 1 | 5 | 1200ms | Single | 1.3x |
| Multiple Shot | 10 | 12 | 3000ms | AoE | 1.8x |
| Heal | 12 | 15 | 10000ms | Self | 0x (heal) |
| Defense Buff | 18 | 20 | 30000ms | Self | 0x (buff) |
| Penetration | 25 | 20 | 5000ms | Single | 3.0x |
| Ice Arrow | 22 | 18 | 4500ms | Single | 2.5x |
| Triple Shot | 35 | 30 | 7000ms | AoE | 3.5x |

#### Summoner

| Skill | Level | Mana | Cooldown | Target | Multiplier |
| --- | --- | --- | --- | --- | --- |
| Dark Ball | 1 | 7 | 1600ms | Single | 1.5x |
| Curse | 10 | 12 | 3500ms | Single | 2.0x |
| Drain Life | 18 | 18 | 5000ms | Single | 2.5x |
| Dark Scream | 25 | 25 | 6000ms | AoE | 3.0x |
| Chain Lightning | 32 | 30 | 7000ms | AoE | 3.5x |
| Death Beam | 55 | 55 | 12000ms | Single | 5.0x |

#### Magic Gladiator

| Skill | Level | Mana | Cooldown | Target | Multiplier |
| --- | --- | --- | --- | --- | --- |
| Fire Slash | 1 | 10 | 2200ms | Single | 1.8x |
| Force Wave | 8 | 15 | 3500ms | AoE | 2.0x |
| Lightning Slash | 12 | 18 | 4000ms | Single | 2.5x |
| Flame Strike | 20 | 22 | 5000ms | AoE | 3.0x |
| Blade Blast | 35 | 35 | 8000ms | AoE | 4.0x |
| Judgment | 65 | 65 | 18000ms | AoE | 5.5x |

### Skill Damage

Skill damage is computed from the character's base auto-attack damage:

```
skillDamage = baseDamage * skill.damageMultiplier
```

The combat system then applies target defense and other modifiers.

### Cooldown Management

In the idle loop, each character tracks cooldowns per skill. A skill can only be cast when:
- The character has enough mana.
- The skill's cooldown has elapsed.
- A valid target exists.

### Mana Cost

Mana is consumed on cast. If mana is insufficient, the character performs a normal attack instead.

## Edge Cases

| Case | Behavior |
| --- | --- |
| Character below unlock level | Skill not returned by `getUnlockedSkills`. |
| Insufficient mana | Skill not cast; normal attack used. |
| Cooldown active | Skill skipped until cooldown expires. |
| Self-target skill on low health | Heal/buff applies immediately if off cooldown. |

## Dependencies

- **Character Progression System:** Provides level for skill unlocking and stats for damage.
- **Combat System:** Uses skills in damage formula and target selection.
- **Auto-Farm System:** Triggers skill casts during idle ticks.
- **Mana System:** Tracks mana pool and regeneration.

## Tuning Knobs

| Knob | Notes |
| --- | --- |
| Damage multiplier | Determines burst vs sustained feel. |
| Mana cost | Limits spam frequency. |
| Cooldown | Controls skill pacing. |
| Unlock level | Provides class progression milestones. |

## Acceptance Criteria

- [x] Skills have id, name, class, multiplier, mana cost, cooldown, unlock level, and target.
- [x] Skills unlock automatically at the required level.
- [x] Skill damage scales with base damage and multiplier.
- [x] Skills filter by class and level.
- [x] Self-target skills exist for buffs and heals.
- [x] All core behaviors covered by unit tests.
- [ ] Future: skill trees, combo skills, and passive skill bonuses.
