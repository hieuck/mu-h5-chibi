# Daily Quest System

## Overview

Daily quests give players short-term goals and rewards. Each quest has a target action count; completing it grants gold and experience.

## Player Fantasy

> "I log in each day, knock out a few quests, and claim extra rewards to speed up progression."

## Detailed Design

### Quest Properties

| Property | Description |
| --- | --- |
| `id` | Unique identifier |
| `name` | Display name |
| `desc` | Description |
| `target` | Completion threshold |
| `rewardGold` | Gold reward |
| `rewardExp` | Experience reward |
| `progress` | Current progress |
| `claimed` | Whether reward was claimed |

### Quest Lifecycle

1. Quest is added to the database.
2. Player progress increments through gameplay.
3. When `progress >= target`, the quest is complete.
4. Player claims the reward if not already claimed.
5. Quests can be reset daily.

### States

```
isComplete = progress >= target
canClaim = isComplete && !claimed
```

### Quest Database

The `QuestDatabase` manages all quests:
- `addQuest(q)` — register a quest.
- `get(id)` — retrieve a quest.
- `all()` — list all quests.
- `getActive()` — list unclaimed quests.
- `resetQuests()` — reset progress and claimed flags.

## Edge Cases

| Case | Behavior |
| --- | --- |
| Claim before complete | Not allowed by `canClaim` guard. |
| Claim twice | `claimed` flag prevents double claim. |
| Reset after claiming | Resets progress and claimed flag for the next cycle. |

## Dependencies

- **Auto-Farm System:** Provides quest progress (kills, gold earned, etc.).
- **Character Progression System:** Consumes quest experience rewards.
- **Loot/Economy System:** Distributes quest gold rewards.

## Tuning Knobs

| Knob | Notes |
| --- | --- |
| Target values | Should match daily play session length. |
| Reward gold/exp | Scaled to feel meaningful but not overpowered. |
| Reset cadence | Daily reset assumed; could be hourly or weekly. |

## Acceptance Criteria

- [x] Quests have target, progress, and reward properties.
- [x] Quests can be completed and claimed once.
- [x] Quest database can list active quests and reset all quests.
- [ ] Future: quest categories, streak bonuses, and weekly challenges.
