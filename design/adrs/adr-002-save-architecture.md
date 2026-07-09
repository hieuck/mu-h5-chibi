# ADR-002: Save Architecture

## Status
Accepted

## Context

MU Chibi Squad is an HTML5 idle ARPG. Players expect progress to persist across browser sessions and to receive some rewards for time spent offline. The save architecture must:
- Persist the full game session (team, inventory, current map, stats) in the browser.
- Load reliably and recover from corrupted or missing data.
- Provide offline progression so returning players don't fall behind.
- Remain simple enough for an MVP while leaving room for cloud save later.

## Decision

Use browser `localStorage` as the primary persistence layer, with a versioned JSON schema, a `SaveLoadManager` for serialization/deserialization, and an `OfflineProgressionSimulator` to apply idle rewards on load.

## Consequences

### Positive

- `localStorage` is universally available in browsers and requires no backend.
- Versioned JSON schema allows safe migration as the save format evolves.
- `SaveLoadManager` centralizes save/load logic and keeps it testable.
- `GameSessionPersistence` orchestrates load → offline simulation → return session.
- Offline progression rewards returning players and matches idle genre expectations.

### Negative

- `localStorage` is limited to ~5–10 MB and is tied to a single browser.
- Players cannot transfer saves across devices without a cloud backend.
- Clearing browser data wipes progress unless exported.
- Save tampering is possible because data lives client-side.

## Alternatives Considered

| Alternative | Why Not Chosen |
| --- | --- |
| IndexedDB | Higher complexity and async API; localStorage is sufficient for MVP JSON blobs. |
| Cloud save first | Requires backend, auth, and cost; deferred until core loop is validated. |
| Cookie storage | Too small and sent with every HTTP request; inappropriate for game state. |
| In-memory only | Progress lost on refresh; unacceptable for an idle game. |

## Implementation Notes

- Save key: `mu-chibi-squad-save`.
- Save version: `1`.
- Stored fields: characters, inventory, currentMapId, savedAt.
- Offline cap: 8 hours; tick interval: 2 seconds matching the active farm tick.
- Corrupt or missing saves return `undefined` and the game starts fresh.

## Related Decisions

- ADR-001: Engine and Language Stack (Phaser 4 + TypeScript + Vite).
- design/gdd/offline-progression-system.md (to be authored).
