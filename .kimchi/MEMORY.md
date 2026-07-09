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
**Production** — active implementation. Source code contains 40+ game files across scenes, systems, entities, UI, and data. Game concept doc exists. Systems are implemented in code and progressively being reverse-documented.

## Known Technical Decisions
- **Line endings:** LF enforced via `.gitattributes`; `core.autocrlf=false` set locally to prevent Windows CRLF conversion of shell hooks.
- **Autonomy:** Full-continuous autonomous mode enabled via `.kimchi/AUTONOMY.md`.
- **Test framework:** Jest with jsdom environment, TypeScript via ts-jest.
- **Build:** Vite for dev server; `tsc` for type checking.
- **Persistence:** `SaveLoadManager` + `GameSessionPersistence` use `localStorage`; cloud save deferred post-MVP.

## Directory Snapshot
```
design/
  gdd/
    game-concept.md        # Game concept (Draft, 2026-06-20)
    combat-system.md       # Reverse-documented combat rules
    auto-farm-system.md    # Reverse-documented idle loop
  registry/
    entities.yaml          # Populated: 12 monsters, 3 bosses, 48 items, 4 formulas, 4 constants
docs/
  architecture/
    tr-registry.yaml       # Traceability registry
production/
  sprint-plan.md           # Sprint 1: MVP Foundation (2026-07-09 → 2026-07-23)
src/
  game/
    main.ts                # DOM entry point
    phaserGame.ts          # Phaser game config
    scenes/                # BootScene, GameScene, HUDScene
    systems/               # 25+ systems (combat, autoFarm, loot, team, etc.)
    entities/              # character, equipment, monster, pet, wings
    ui/                    # InventoryUI, MapSelectorUI, StatsPanel
    data/                  # classSkills, gameMaps, itemDatabase, mapBackgrounds
  tests/                   # 50+ test files covering most systems
```

## Identified Gaps
1. Several P0 systems still lack per-system GDDs:
   - Character Progression
   - Equipment (enhancement, sockets, sets, wings)
   - Skill System
   - Team / Squad
   - Loot and Economy
   - Boss Encounters
2. No architecture overview or ADRs for engine choice and save architecture.
3. `CLAUDE.md` engine/language placeholders still not filled.
4. Offline progression simulation not implemented.
5. Cloud save backend not implemented.

## Next Recommended Work
1. Continue reverse-documenting P0 systems, starting with Character Progression and Equipment.
2. Author ADRs for Phaser 4 + TypeScript and local-storage save architecture.
3. Implement offline progression simulation.
4. Fill `CLAUDE.md` engine/language selections.

## Recent Cycle Notes
- 2026-07-09 (Cycle 1): Fixed recurring CRLF hook failures, enabled autonomy, created MEMORY.md and stage report, created systems index, reverse-documented Combat and Auto-Farm systems, and implemented `SaveLoadManager` (PRs #1, #3, #4, #5, #6, #7).
- 2026-07-09 (Cycle 2): Populated entity registry, integrated save/load into `GameScene`, and created Sprint 1 plan (PRs #8, #9, #10).

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
