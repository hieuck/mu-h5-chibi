# Project Stage Report — MU Chibi Squad

**Repository:** https://github.com/hieuck/mu-h5-chibi  
**Date:** 2026-07-09  
**Detected Stage:** Production  
**Reporter:** Kimchi Builder Agent  

## Executive Summary

MU Chibi Squad is in active Production. The core idle ARPG loop is implemented: auto-farm combat, team composition, equipment/sets/gems/enhancement, boss encounters, daily quests, guild, pets, maps, sound, and inventory UI are present in `src/game/` and covered by tests in `src/tests/`. However, design documentation and production planning artifacts lag behind implementation. The project has a draft game concept but no per-system GDDs, no systems index, no roadmap, and empty design/technical registries.

## Stage Detection Criteria

| Criterion | Evidence | Met |
| ---- | ---- | ---- |
| Active code implementation | 22 systems, 41 source files, 48 test files in `src/` | Yes |
| Build/runtime toolchain configured | `src/package.json` with Vite, TypeScript, Jest, Phaser 4 | Yes |
| Game loop playable (core) | Scenes, autoFarm, combat, loot, inventory, team, maps implemented and tested | Yes |
| Design docs exist but incomplete | `design/gdd/game-concept.md` draft only; no per-system GDDs | Yes |
| Production planning missing | No sprint plan, roadmap, or milestone tracker in `production/` | Yes |
| Registries not populated | `design/registry/entities.yaml` and `docs/architecture/tr-registry.yaml` empty | Yes |

## Completeness Overview

### Implementation (High)

- **Core Loop**: Auto-farm, monster spawning, loot drops, gold/EXP gain, inventory management, map switching.
- **Combat**: Damage, critical hits, skills, regen, floating damage numbers, boss encounters.
- **Progression**: Equipment tiers, set bonuses, enhancement, gem sockets, wings, pets, team stats, character classes.
- **Social/Metagame**: Guild system, daily quests, shop.
- **Presentation**: HUD, map backgrounds, sound system, sprite rendering, item tooltips, health/mana bars.

### Design Documentation (Low)

- Only `design/gdd/game-concept.md` exists (Draft, 2026-06-20).
- No `design/systems-index.md`.
- No per-system GDDs for combat, equipment, economy, progression, UI/UX, audio, guild, pets, daily quests, etc.

### Architecture Documentation (Very Low)

- No architecture overview document.
- No ADRs.
- `docs/architecture/tr-registry.yaml` is scaffold-only with zero requirements.

### Production Planning (None)

- `production/` contains only `session-logs/` and `session-state/`.
- No roadmap, sprint plan, milestone tracker, or release checklist.

### Entity / Fact Registry (None)

- `design/registry/entities.yaml` has empty lists for entities, items, formulas, constants.

## Identified Gaps

1. **Missing systems index** — `design/systems-index.md` should map every implemented system to its GDD, source folder, test folder, and owner.
2. **Missing per-system GDDs** — implementation exists without matching design specs.
3. **Missing production plan** — no roadmap, sprint plan, or milestone tracker.
4. **Empty entity registry** — canonical items, formulas, constants, and entities not registered.
5. **Missing architecture overview / ADRs** — no record of why Phaser 4, Vite, idle-first combat, or team-based progression were chosen.
6. **Stale `CLAUDE.md`** — engine/language placeholders still read `[CHOOSE: ...]` despite the project being TypeScript + Phaser 4.
7. **Design drift risk** — without per-system GDDs, future code changes may diverge from the game concept.

## Recommended Next Steps

### Immediate (this cycle)

1. Create `design/systems-index.md` as a living map of implemented systems and planned GDDs.
2. Fill `CLAUDE.md` engine/language/build placeholders for Phaser 4 / TypeScript / Vite.
3. Populate `design/registry/entities.yaml` with key items, formulas, and constants extracted from `src/game/data/`.

### Short-term (next 1–2 sprints)

4. Author per-system GDDs in priority order:
   - combat.md
   - equipment.md
   - inventory.md
   - progression.md (level/reset/wings)
   - economy.md
   - team.md
   - ui-ux.md
   - audio.md
   - guild.md
   - pets.md
   - daily-quests.md
5. Create baseline ADRs in `docs/architecture/`:
   - Why Phaser 4 + TypeScript + Vite
   - Idle-first combat split
   - Team-based progression
6. Add `production/roadmap.md` with milestones and sprint boundaries.

### Medium-term

7. Run `/consistency-check` across new GDDs and `design/registry/entities.yaml`.
8. Run `/architecture-review` to generate and freeze TR-IDs in `docs/architecture/tr-registry.yaml`.
9. Establish a sprint cadence and keep `production/sprint-plan.md` updated per cycle.

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
| ---- | ---- | ---- | ---- |
| Design drift between code and concept | High | Medium | Create per-system GDDs and registry before adding major new systems. |
| New contributor onboarding friction | Medium | Medium | Update `CLAUDE.md` and add architecture overview. |
| Re-implementation due to unclear requirements | Medium | High | Author GDDs before expanding guild/social/PvE endgame. |
| Cross-system balance issues | Medium | High | Define formulas in registry; use `/balance-check` after GDDs exist. |

## Conclusion

MU Chibi Squad has successfully transitioned from concept into Production implementation. The next phase should focus on **documentation completeness** and **production planning** to prevent design drift and prepare for vertical slice / polish milestones.
