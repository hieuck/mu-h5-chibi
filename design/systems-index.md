# Systems Index

*Generated: 2026-07-09*
*Status: Production — systems implemented in code; design docs lag behind.*

## How to Read This Index

- **Status:** `implemented` | `partial` | `planned`
- **Priority:** `P0` (MVP blocker) → `P3` (post-launch)
- **GDD:** Path to the per-system design doc; blank means not yet written.
- **Source:** Primary implementation file(s) in `src/game/`.

## Core Systems

| System | Status | Priority | Dependencies | Source | GDD |
| --- | --- | --- | --- | --- | --- |
| Game Session | implemented | P0 | — | `systems/gameSession.ts` | |
| Map / World | implemented | P0 | Game Session | `systems/maps.ts`, `data/gameMaps.ts`, `data/mapBackgrounds.ts` | |
| Auto-Farm Combat | implemented | P0 | Combat, Team, Map | `systems/autoFarm.ts`, `systems/combat.ts` | |
| Combat Engine | implemented | P0 | Character, Skills | `systems/combat.ts`, `systems/floatingDamage.ts` | |
| Team / Squad | implemented | P0 | Character | `systems/team.ts` | |
| Character Progression | implemented | P0 | — | `entities/character.ts`, `systems/gameSession.ts` | |
| Skills | implemented | P0 | Character | `systems/skills.ts`, `data/classSkills.ts` | |
| Equipment | implemented | P0 | Character, Inventory | `entities/equipment.ts`, `systems/inventory.ts` | |
| Inventory | implemented | P0 | Equipment | `systems/inventory.ts`, `ui/InventoryUI.ts` | |
| Set Bonuses | implemented | P0 | Equipment | `systems/setBonuses.ts` | |
| Enhancement / Upgrades | implemented | P1 | Equipment | systems referenced in `tests/enhancement.test.ts` | |
| Gem Socketing | implemented | P1 | Equipment | systems referenced in `tests/gemSocket.test.ts` | |
| Wings | implemented | P0 | Character | `entities/wings.ts` | |
| Reset Progression | partial | P0 | Character Progression | `systems/gameSession.ts` (reset referenced in tests) | |
| Boss Encounters | implemented | P0 | Combat, Map | `systems/bossEncounter.ts` | |
| Loot / Drops | implemented | P0 | Combat, Inventory | `systems/loot.ts`, `data/itemDatabase.ts` | |
| Shop | implemented | P1 | Inventory, Gold | `systems/shop.ts`, `ui/InventoryUI.ts` | |
| Gold / Economy | implemented | P1 | Loot, Shop | `systems/loot.ts`, `systems/shop.ts` | |
| Daily Quests | implemented | P2 | — | `systems/dailyQuests.ts` | |
| Guild | implemented | P2 | — | `systems/guild.ts` | |
| Pets | implemented | P2 | Character | `entities/pet.ts` | |
| Sound / SFX | implemented | P2 | — | `systems/soundSystem.ts` | |
| Save / Load | implemented | P0 | Game Session | `systems/gameSession.ts` (save/load referenced in tests) | |
| Asset Loading | implemented | P0 | — | `systems/assetLoader.ts`, `systems/assetManifest.ts`, `systems/spriteRenderer.ts`, `systems/visualRenderData.ts` | |
| Rendering / HUD | implemented | P0 | Game Session | `systems/gameRenderer.ts`, `systems/healthBar.ts`, `scenes/HUDScene.ts`, `ui/StatsPanel.ts` | |

## Dependency Graph (Textual)

```
Game Session
├── Map / World
├── Character Progression
│   ├── Team / Squad
│   ├── Skills
│   ├── Equipment
│   │   ├── Inventory
│   │   ├── Set Bonuses
│   │   ├── Enhancement
│   │   ├── Gem Socketing
│   │   └── Wings
│   └── Pets
├── Combat Engine
│   ├── Auto-Farm Combat
│   └── Boss Encounters
├── Loot / Drops
│   ├── Gold / Economy
│   └── Shop
├── Save / Load
└── Rendering / HUD

Independent / Meta Systems:
- Asset Loading
- Daily Quests
- Guild
- Sound / SFX
```

## Next Actions

1. Write per-system GDDs for P0 systems that lack them, starting with:
   - `design/gdd/combat-system.md`
   - `design/gdd/auto-farm-system.md`
   - `design/gdd/equipment-system.md`
   - `design/gdd/character-progression-system.md`
2. Populate `design/registry/entities.yaml` with cross-system facts.
3. Author ADRs for engine choice and save/load architecture.
