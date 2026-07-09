# Auto-Farm System

## Overview

The Auto-Farm System is the idle loop of MU Chibi Squad. The player's squad automatically fights monsters in the current map, earns experience and gold, picks up equipment drops, and respawns the area when it is cleared — all without requiring real-time input.

Auto-farm is the primary progression driver for the 90% hands-off portion of the game.

## Player Fantasy

> "I check in and my squad has been busy: levels gained, gold earned, and a backpack full of loot to sort through."

Players should feel that:
- Their squad keeps working even when they are not actively playing.
- Choosing the right map matters (risk vs. reward).
- Checking in after a break is rewarding.

## Detailed Design

### Farm Area

A `FarmArea` represents a single farming location.

| Property | Purpose |
| --- | --- |
| `name` | Display name shown in map selector. |
| `monsters` | Current live monsters in the area. |
| `recommendedLevel` | Suggested character level for the area. |
| `_monsterTemplates` | Spawn templates used to respawn the area. |

Areas track whether they are cleared (`isCleared`) and can respawn monsters with the same stats and drop tables.

### Auto-Farm Tick

`autoFarmTick(team, area, skillProvider?)` resolves one round of combat:

1. Apply passive HP/mana regen to the team.
2. For each alive team member:
   - Pick the first alive monster as target.
   - If a `SkillProvider` is given, use `combatTickWithSkills` (skills cost mana and deal multiplied damage).
   - Otherwise, use basic `calculateDamage` attack.
   - If the target dies, award EXP and shared gold to alive team members.
3. If all monsters are dead, respawn the area.
4. Return total EXP gained this tick.

`autoFarmTickWithLoot(...)` adds item drops:
- When a monster dies, roll its `dropTable`.
- If a drop succeeds and the inventory is not full, resolve the item ID to an `Equipment` instance and add it to inventory.
- Return both loot IDs and EXP gained.

### Rewards

| Reward | Value | Distribution |
| --- | --- | --- |
| EXP per kill | `EXP_PER_KILL = 50` | Each killer receives 50 EXP. |
| Gold | `monster.goldValue` | Split evenly among alive team members. |
| Loot | From `monster.dropTable` | One roll per kill; added to inventory if space exists. |

## Formulas

### Experience per Kill

```
expGained = 50
```

### Gold Split

```
aliveMembers = team.members.filter(m => m.hp > 0)
goldShare    = floor(monster.goldValue / aliveMembers.length)
each alive member.gold += goldShare
```

### Loot Roll

```
if (target.dropTable && !inventory.isFull) {
  dropId = target.dropTable.roll(random())
  if (dropId) {
    item = itemResolver(dropId)
    if (item) inventory.add(item)
  }
}
```

## Edge Cases

| Case | Behavior |
| --- | --- |
| Team member is dead (`hp <= 0`) | Skipped for attacks but may still receive gold share if alive during reward phase. |
| No alive monsters | Tick ends early; area respawns if cleared. |
| Area cleared mid-tick | Remaining team members stop attacking; area respawns after the tick. |
| Inventory full | Drops are rolled but not added; loot is lost for that kill. |
| No skill provider passed | Falls back to basic attacks for the whole team. |

## Dependencies

- **Combat System:** Provides damage calculation and skill-based combat ticks.
- **Team System:** Provides the squad and alive/dead state.
- **Character System:** Provides HP, EXP, gold, and mana.
- **Monster System:** Provides monsters, HP, defense, `goldValue`, and `dropTable`.
- **Inventory System:** Stores dropped equipment.
- **Regen System:** Applies passive HP/mana regen at the start of each tick.
- **Skill System:** Optional provider of class-locked skills.

## Tuning Knobs

| Knob | Current Value | Notes |
| --- | --- | --- |
| `EXP_PER_KILL` | 50 | Base idle progression rate. |
| Gold split denominator | Alive members | More team members = smaller individual share. |
| Drop table chance | Per table | Tune per map/monster in `loot.ts` / `itemDatabase.ts`. |
| Tick frequency | Driven by Phaser update loop | Affects simulation speed; not defined in this module. |

## Acceptance Criteria

- [x] A `FarmArea` can be created with a list of monsters and a recommended level.
- [x] Areas respawn when all monsters are killed.
- [x] Each farm tick deals damage, grants EXP, and splits gold among alive members.
- [x] Loot can be rolled and added to inventory if space exists.
- [x] Dead team members do not attack.
- [x] All core behaviors are covered by unit tests.
- [ ] Future: offline progression simulation, map difficulty warnings, auto-loot filters.
