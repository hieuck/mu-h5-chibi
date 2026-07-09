# Guild System

## Overview

Guilds provide a social progression layer. Players create or join a guild, donate to increase guild experience, and unlock higher member limits as the guild levels up.

## Player Fantasy

> "I found a guild, recruit friends, and grow it into a powerhouse with extra member slots."

## Detailed Design

### Guild Properties

| Property | Description |
| --- | --- |
| `name` | Guild name |
| `members` | List of guild members |
| `exp` | Guild experience |
| `level` | Guild level (starts at 1) |

### Guild Members

Each member tracks:
- `name`
- `contribution`
- `donations`

The founder is added automatically when the guild is created.

### Member Limit

```
maxMembers = 5 + (level - 1) * 2
```

Level 1 guilds hold 5 members; each level adds 2 more slots.

### Guild Leveling

```
expRequired(level) = level * 200
```

Guilds gain experience through donations and shared activities. When experience crosses the threshold, the guild levels up and excess experience carries over.

## Edge Cases

| Case | Behavior |
| --- | --- |
| Add member at max capacity | Returns `false`. |
| Level up | `maxMembers` increases automatically. |

## Dependencies

- **Character Progression System:** Player characters are guild members.
- **Loot/Economy System:** Donations may consume gold or items.

## Tuning Knobs

| Knob | Current Value | Notes |
| --- | --- | --- |
| Base members | 5 | Small social circle at start. |
| Members per level | +2 | Slow, meaningful growth. |
| EXP required | `level * 200` | Linear curve. |

## Acceptance Criteria

- [x] Guild has name, members, exp, and level.
- [x] Member cap scales with guild level.
- [x] Guild levels up by accumulating experience.
- [x] Adding members respects the cap.
- [ ] Future: guild skills, guild boss, and guild chat.
