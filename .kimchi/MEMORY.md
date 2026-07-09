# Project Memory — MU Chibi Squad

## Identity

| Field | Value |
| ---- | ---- |
| **Repository** | https://github.com/hieuck/mu-h5-chibi |
| **Game Title** | MU Chibi Squad |
| **Genre** | Idle ARPG / Team Management / Auto-Battler |
| **Inspiration** | MU Online (equipment, wings, reset, class fantasy) |
| **Engine** | Phaser 4 |
| **Language** | TypeScript |
| **Build Tool** | Vite |
| **Platform** | HTML5 (H5) — web primary, mobile/desktop future |
| **Default Branch** | `main` |
| **Current Stage** | Production (active implementation) |
| **Package** | `mu-chibi-squad` v1.0.0 |

## Project Snapshot

Last memory refresh: 2026-07-09

### Source Code (`src/game/`)

- **Entry**: `main.ts` bootstraps `phaserGame.ts`.
- **Scenes**: `BootScene.ts`, `GameScene.ts`, `HUDScene.ts`.
- **Systems** (22 files): assetLoader, assetManifest, autoFarm, bossEncounter, combat, dailyQuests, floatingDamage, gameRenderer, gameSession, guild, healthBar, inventory, loot, maps, regen, setBonuses, shop, skills, soundSystem, spriteRenderer, team, visualRenderData.
- **Entities**: character, equipment, monster, pet, wings.
- **UI**: InventoryUI, MapSelectorUI, StatsPanel.
- **Data**: classSkills, gameMaps, itemDatabase, mapBackgrounds.

### Tests (`src/tests/`)

48 test files covering core loops: autoFarm, combat, loot, inventory, team, skills, boss encounters, daily quests, guild, shop, sets, enhancement, gems, pets, maps, game session, save/load, sound, equipment drops, character stats, and more.

### Design & Docs

| Path | Status | Notes |
| ---- | ---- | ---- |
| `design/gdd/game-concept.md` | Draft, 2026-06-20 | Contains elevator pitch, MDA analysis, pillars, references. |
| `design/registry/entities.yaml` | Scaffold | Empty lists for entities, items, formulas, constants. |
| `docs/architecture/tr-registry.yaml` | Scaffold | Empty requirements list. |
| `CLAUDE.md` | Out-of-date template | Engine/language placeholders still not filled. |

### Recent Cycle Notes

- **PR #1 merged** (`a13b273`): Fixed CRLF hook issue by adding `.gitattributes`, updating `.gitignore`, and enabling autonomy via `.kimchi/AUTONOMY.md`.
- Mode: `full-continuous` autonomy now active.
- Git line endings configured to LF.

## Key Decisions

1. **Stack**: Phaser 4 + TypeScript + Vite. Confirmed by `src/package.json`.
2. **Idle-first combat**: Auto-farm loop is the primary moment-to-moment gameplay; manual boss encounters provide optional skill expression.
3. **Team-based progression**: 3-4 character slots, class synergies, team stats.
4. **MU Online homage**: Equipment tiers, wings, set bonuses, enhancement, gem sockets, reset progression.
5. **Single-player + async social**: Guilds and daily quests exist; real-time PVP is explicitly excluded by anti-pillar.
6. **Autonomy enabled**: Agent may self-merge PRs, deploy staging, add dependencies, and handle local secrets under guardrails.

## Active Gaps

- No `design/systems-index.md`.
- No per-system GDDs beyond `game-concept.md`.
- No active sprint plan or roadmap in `production/`.
- `design/registry/entities.yaml` is empty — no canonical entity/item/formula/constant definitions.
- No architecture overview or ADRs in `docs/architecture/` beyond the TR registry scaffold.
- `CLAUDE.md` placeholders for engine/language/build system are not filled.
- No dependency lockfile visible at repo root; package lives in `src/package.json`.

## Recommended Next Work

1. **Fill `CLAUDE.md` engine/language placeholders** to align studio tooling with the actual Phaser/TypeScript/Vite stack.
2. **Create `design/systems-index.md`** listing all implemented systems and their authoritative GDD locations.
3. **Author per-system GDDs** for combat, equipment, inventory, team, progression, economy, guild, pets, daily quests, and sound.
4. **Populate `design/registry/entities.yaml`** with cross-referenced items, formulas, and constants from the data files.
5. **Create baseline ADRs** for "Why Phaser 4", "Idle vs active combat split", and "Team-based vs single-character progression".
6. **Add `production/roadmap.md`** with near-term milestones and sprint boundaries.
7. **Align test coverage** with newly documented systems; target test-to-production LOC ratio >= 1.0 for new code.

## Files This Memory Owns

- `.kimchi/MEMORY.md` (this file)
- `.kimchi/AUTONOMY.md`

## Notes for Future Agents

- When adding new systems, update this memory's directory snapshot and gaps list.
- When a new GDD is created, link it here and in `design/systems-index.md` once that file exists.
- Keep LF line endings. Do not revert to CRLF.
