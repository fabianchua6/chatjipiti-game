# ChatJiPiTi Games

**Play while your agents work.** A mobile-first hackathon arcade for Fabian and Rachiket.

## Run locally

Use Node 24 (or Node 22.12+).

```sh
npm ci
npm run dev
```

Open the localhost URL printed by Vite. No API key or backend is needed.

```sh
npm test
npm run build
```

The production output is `dist/`. The app is a client-only React + TypeScript application built with Vite. Fonts are bundled locally. Sites hosting is the planned target; deployment is not configured or completed yet.

## What works now

- Responsive arcade hub and local nickname persistence.
- Explicitly simulated Continue with ChatGPT and Fancy a game entry point.
- Playable memory game: 3×3 → 4×4 → 5×5 → 6×6, shuffled faces, one unmatchable blank on odd boards, time and moves.
- Fixed-position card backs forming a temporary abstract mosaic. This is not the final Astra poster.
- Shared deterministic daily memory boards and random Free Play boards.
- Best results stored on this device, separately by mode and board size. Daily scores are additionally keyed by date.
- Typing and circle feature modules are reserved routes with honest implementation status.
- Pure game-rule tests and a GitHub Actions build workflow.

## Pair workflow

Read [CONTRIBUTING.md](CONTRIBUTING.md) before starting a branch. Proposed ownership:

| Owner | Area | Paths |
| --- | --- | --- |
| Fabian | Hub, mock profile, entry point, shared style, assets, demo | `src/App.tsx`, `src/styles.css`, `public/`, `docs/` |
| Rachiket | Typing and circle game rules and UI | `src/features/typing/`, `src/features/circle/` |
| Coordinate first | Shared state, memory enhancements, dependencies, deployment | `src/lib/`, `src/features/memory/`, package files, hosting configuration |

This division is a starting proposal, not a confirmed assignment from Rachiket. Keep feature CSS next to its game to reduce conflicts. Register new shared interfaces before both branches depend on them.

## Next build order

1. Invite Rachiket to the remote repository after confirming his GitHub handle.
2. Implement typing and circle in separate branches.
3. Agree on daily attempt limits, integrate local results and mock reset wallet.
4. Replace temporary artwork with Astra poster, agent art and approved Tibo reference.
5. Verify touch and keyboard interactions, then deploy.
6. Recheck the hackathon brief and produce the 90-second demo.

See [PRODUCT.md](PRODUCT.md) for game rules and [docs/ACCEPTANCE.md](docs/ACCEPTANCE.md) for remaining checks.

No real ChatGPT sign-in, agent detection, global leaderboard or account reset integration exists. Reset rewards must stay explicitly simulated.
