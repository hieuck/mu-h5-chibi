# Sprint Plan: MU Chibi Squad — Sprint 1

**Sprint Goal:** Close the biggest documentation and persistence gaps so the project has a stable foundation for feature velocity.

**Dates:** 2026-07-09 → 2026-07-23  
**Milestone:** MVP Foundation Complete  
**Status:** in_progress

---

## Goals

1. Ensure every core system has a per-system GDD or is explicitly reverse-documented.
2. Establish a single source of truth for game-world facts in `design/registry/entities.yaml`.
3. Make player progress persistent across browser sessions.
4. Define the remaining MVP feature set and acceptance criteria.

---

## Completed Work (Carried In)

- [x] Fix Windows CRLF hook failures.
- [x] Create `.kimchi/MEMORY.md` and `production/project-stage-report.md`.
- [x] Create `design/systems-index.md`.
- [x] Reverse-document Combat System and Auto-Farm System.
- [x] Populate `design/registry/entities.yaml`.
- [x] Implement `SaveLoadManager` and `GameSessionPersistence` with GameScene integration.

---

## Planned Stories

### Documentation
- [ ] `design/gdd/character-progression-system.md` — levels, stat allocation, reset.
- [ ] `design/gdd/equipment-system.md` — slots, tiers, enhancement, sockets, sets, wings.
- [ ] `design/gdd/skill-system.md` — class skills, unlocking, casting, mana.
- [ ] `design/gdd/team-system.md` — squad composition, formation, target selection.
- [ ] `design/gdd/loot-and-economy-system.md` — drops, gold, shop, inventory limits.
- [ ] `design/gdd/boss-system.md` — boss encounters, abilities, rewards.
- [ ] `docs/architecture/adr-001-phaser-typescript.md` — engine choice rationale.
- [ ] `docs/architecture/adr-002-local-storage-save.md` — save architecture rationale.

### Implementation
- [ ] Cloud save backend scaffold (player account + remote sync placeholder).
- [ ] Offline progression simulation: compute rewards since last session.
- [ ] Daily quest completion persistence and reset timer.
- [ ] Boss encounter manual controls and victory/defeat state.
- [ ] Equipment comparison UI and auto-equip suggestion.

### Polish / QA
- [ ] Achieve 90% test coverage for `src/game/systems/`.
- [ ] Run full test suite on every PR (already enforced via CodeRabbit).
- [ ] Update `CLAUDE.md` engine/language selection from placeholders.

---

## Acceptance Criteria

- All P0 systems from `design/systems-index.md` have a matching GDD.
- `npm test` passes with no regressions before any PR merge.
- `design/registry/entities.yaml` stays consistent with `src/game/data/*.ts`.
- Save/load preserves team, inventory, and current map across browser refresh.

---

## Risks

| Risk | Mitigation |
| --- | --- |
| Documentation lags behind code again | Make reverse-documentation a required step for any modified system. |
| Save format changes break old saves | Version the save schema and gracefully fall back to new-game state. |
| Cloud save scope creep | Treat cloud as async backup only; localStorage remains authoritative for MVP. |

---

## Notes

- This sprint focuses on **foundation**, not new maps/classes.
- Player-facing features are deferred to Sprint 2 once docs and persistence are solid.
