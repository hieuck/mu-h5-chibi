# Project Memory: MU Chibi Squad

## Last Updated
2026-07-09

## Project Identity
- **Name:** MU Chibi Squad
- **Genre:** Idle ARPG / Team Management / Auto-Battler
- **Inspiration:** MU Online
- **Engine:** Phaser 4 + TypeScript + Vite
- **Platform:** HTML5 (H5) primary; mobile and Steam future
- **Repository:** https://github.com/hieuck/mu-h5-chibi
- **Default Branch:** main

## Current Stage
**Production** — active implementation. All P0 and major secondary systems are reverse-documented in per-system GDDs. Engine and save architecture decisions are recorded as ADRs. `CLAUDE.md` placeholders are filled. Source code contains 40+ game files across scenes, systems, entities, UI, and data. Test suite covers 306 tests across 51 suites.

## Known Technical Decisions
- **Line endings:** LF enforced via `.gitattributes`; `core.autocrlf=false` set locally to prevent Windows CRLF conversion of shell hooks.
- **Autonomy:** Full-continuous autonomous mode enabled via `.kimchi/AUTONOMY.md`.
- **Engine and language:** Phaser 4 + TypeScript + Vite (see ADR-001).
- **Test framework:** Jest with jsdom environment, TypeScript via ts-jest.
- **Build:** Vite for dev server; `tsc` for type checking.
- **Persistence:** `SaveLoadManager` + `GameSessionPersistence` use `localStorage` with versioned JSON; offline progression applies simulated farm ticks on load (see ADR-002); cloud save deferred post-MVP.

## Directory Snapshot
```
design/
  adrs/
    adr-001-engine-choice.md      # Engine/language stack decision
    adr-002-save-architecture.md  # localStorage + offline progression decision
  gdd/
    game-concept.md        # Game concept (Draft, 2026-06-20)
    combat-system.md       # Reverse-documented combat rules
    auto-farm-system.md    # Reverse-documented idle loop
    character-progression-system.md  # Reverse-documented levels/stats/reset
    equipment-system.md    # Reverse-documented gear/enhancement/sockets/sets
    skill-system.md        # Reverse-documented class skills
    team-system.md         # Reverse-documented squad management
    loot-economy-system.md # Reverse-documented drops/gold/shop/inventory
    boss-encounter-system.md # Reverse-documented boss fights
    pet-system.md          # Reverse-documented pet bonuses
    wings-system.md        # Reverse-documented class wings
    guild-system.md        # Reverse-documented guild progression
    daily-quest-system.md  # Reverse-documented daily quests
  registry/
    entities.yaml          # Populated: 12 monsters, 3 bosses, 48 items, 4 formulas, 4 constants
production/
  project-stage-report.md  # Baseline project audit
  sprint-plan.md           # Sprint 1: MVP Foundation (2026-07-09 → 2026-07-23)
src/
  game/
    main.ts                # DOM entry point
    phaserGame.ts          # Phaser game config
    scenes/                # BootScene, GameScene, HUDScene
    systems/               # 25+ systems (combat, autoFarm, offlineProgression, team, etc.)
    entities/              # character, equipment, monster, pet, wings
    ui/                    # InventoryUI, MapSelectorUI, StatsPanel
    data/                  # classSkills, gameMaps, itemDatabase, mapBackgrounds
  tests/                   # 51 test files covering most systems
```

## Identified Gaps
1. Cloud save backend not implemented (post-MVP).
2. Open PR #2 from `ecc-tools/mu-h5-chibi-1783556141539` requires review.
3. Some niche systems exist only in code/tests without GDDs (achievements, sound, map backgrounds).

## Next Recommended Work
1. Review and resolve open PR #2.
2. Implement cloud save backend post-MVP.
3. Reverse-document achievements and sound systems if needed.
4. Continue polish and balance passes on core loop.

## Recent Cycle Notes
- 2026-07-09 (Cycle 1): Fixed recurring CRLF hook failures, enabled autonomy, created MEMORY.md and stage report, created systems index, reverse-documented Combat and Auto-Farm systems, and implemented `SaveLoadManager` (PRs #1, #3, #4, #5, #6, #7).
- 2026-07-09 (Cycle 2): Populated entity registry, integrated save/load into `GameScene`, and created Sprint 1 plan (PRs #8, #9, #10).
- 2026-07-09 (Cycle 3): Updated MEMORY.md and second cycle log, reverse-documented Character Progression System, and implemented offline progression simulation (PRs #11, #12, #13).
- 2026-07-09 (Cycle 4): Reverse-documented Equipment, Skill, Team, Loot/Economy, and Boss Encounter systems (PRs #15, #16, #17, #18, #19).
- 2026-07-09 (Cycle 5): Authored ADR-001 and ADR-002, filled `CLAUDE.md` placeholders, and updated MEMORY.md (PRs #21, #22, #23, #24).
- 2026-07-09 (Cycle 6): Reverse-documented secondary systems (Pets, Wings, Guild, Daily Quests) and updated MEMORY.md (PR #25, #26).

## Pull Requests Merged
- #1 chore: enforce LF line endings and enable autonomy
- #3 docs: add project memory and baseline stage report
- #4 docs: add systems index cataloging implemented game systems
- #5 docs: add combat system GDD
- #6 docs: add auto-farm system GDD
- #7 feat: add SaveLoadManager for local session persistence
- #8 data: populate entity registry
- #9 feat: integrate SaveLoadManager into GameScene for auto load/save
- #10 docs: add Sprint 1 plan for MVP foundation
- #11 docs: update MEMORY.md with latest cycle notes and merged PRs
- #12 docs: add character progression system GDD
- #13 feat: add offline progression simulation
- #15 docs: add equipment system GDD
- #16 docs: add skill system GDD
- #17 docs: add team system GDD
- #18 docs: add loot and economy system GDD
- #19 docs: add boss encounter system GDD
- #21 docs: add ADR-001 engine and language stack
- #22 docs: add ADR-002 save architecture
- #23 docs: fill CLAUDE.md engine and language placeholders
- #24 docs: update MEMORY.md with ADRs and CLAUDE.md placeholders
- #25 docs: add secondary system GDDs (pets, wings, guild, daily quests)
