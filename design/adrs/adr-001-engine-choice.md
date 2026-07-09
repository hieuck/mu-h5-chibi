# ADR-001: Engine and Language Stack

## Status
Accepted

## Context

MU Chibi Squad is an HTML5 idle ARPG inspired by MU Online. The game must:
- Run in browsers (H5) with minimal friction.
- Support sprite-based 2D rendering, scenes, input, and audio.
- Use a statically typed language to manage growing complexity.
- Build quickly and support hot module replacement during development.
- Be testable without a browser (unit tests in CI).

## Decision

Use **Phaser 4** as the game engine, **TypeScript** as the implementation language, and **Vite** as the build tool.

## Consequences

### Positive

- **Phaser 4** is purpose-built for 2D web games and provides scenes, sprites, physics hooks, input, and audio out of the box.
- **TypeScript** catches type errors early and scales well as systems, entities, and UI grow.
- **Vite** offers fast dev builds, HMR, and straightforward production bundling.
- The stack is popular, well-documented, and easy to deploy as static files.
- Jest + jsdom can test game logic independently of Phaser rendering.

### Negative

- Phaser 4 is newer than Phaser 3; some plugins and community resources are still catching up.
- TypeScript adds build-time overhead compared to pure JavaScript.
- Vite's dev server requires Node.js; browser-only users cannot build without tooling.

## Alternatives Considered

| Alternative | Why Not Chosen |
| --- | --- |
| Phaser 3 | Phaser 4 offers modernized internals and is the forward-looking version for this project. |
| Unity WebGL | Heavier build size and longer load times; overkill for a 2D idle game. |
| Godot 4 HTML5 | Excellent engine, but introduces a second language (GDScript) and larger export size. |
| Plain JavaScript | Lacks static typing; harder to maintain as the codebase grows. |
| Webpack | Vite provides faster startup and simpler configuration for this project size. |

## Related Decisions

- ADR-002: Save Architecture (localStorage + offline progression).
- Sprint 1 plan: MVP Foundation focuses on core loop before cloud save or multiplayer.
