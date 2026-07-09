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
**Production** — active implementation. Source code contains 40+ game files across scenes, systems, entities, UI, and data. Game concept doc exists. Systems are implemented in code but not yet documented as per-system GDDs.

## Known Technical Decisions
- **Line endings:** LF enforced via `.gitattributes`; `core.autocrlf=false` set locally to prevent Windows CRLF conversion of shell hooks.
- **Autonomy:** Full-continuous autonomous mode enabled via `.kimchi/AUTONOMY.md`.
- **Test framework:** Jest with jsdom environment, TypeScript via ts-jest.
- **Build:** Vite for dev server; `tsc` for type checking.

## Directory Snapshot
```
design/
  gdd/
    game-concept.md        # Game concept (Draft, 2026-06-20)
  registry/
    entities.yaml          # Entity registry scaffold (empty lists)
docs/
  architecture/
    tr-registry.yaml       # Traceability registry
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
1. No `design/systems-index.md` — systems are not formally decomposed or prioritized.
2. No per-system GDDs beyond `game-concept.md`.
3. No active sprint plan or roadmap in `production/`.
4. `design/registry/entities.yaml` is empty; cross-system facts not registered.
5. No architecture overview or ADRs for major technical decisions.
6. No `CLAUDE.md` engine/language selection filled in (still placeholders).

## Next Recommended Work
1. Create `design/systems-index.md` from existing implemented systems.
2. Reverse-document the most critical implemented systems into per-system GDDs.
3. Define a sprint plan / milestone for MVP completion.
4. Continue implementation with TDD, targeting remaining MVP gaps (cloud save, reset system depth, boss mechanics polish).

## Recent Cycle Notes
- 2026-07-09: Fixed recurring CRLF hook failures by adding `.gitattributes`, updating `.gitignore`, and enabling autonomous mode (PR #1 merged).
