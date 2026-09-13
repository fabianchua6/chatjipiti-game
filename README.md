# ChatJiPiTi Game

**Play while your agents work.** A solo hackathon project by Fabian: a mock ChatGPT interface with three games in the sidebar.

## Run

Node 24 is recommended (minimum 22.12).

```sh
npm ci
npm run dev
```

Open the localhost URL printed by Vite. No API keys or environment variables are needed.

```sh
npm test
npm run build
```

Static production output is `dist/`. Fonts and game artwork are bundled locally. Hosting is not configured yet.

## Demo flow

1. Open New chat, enter a prompt or use a suggestion.
2. The mock agent thinks and offers **Fancy a game?**
3. Open **ChatJiPiTi Game** from that invitation or the sidebar.
4. Play memory matching, strict typing or the yellow-circle challenge.
5. After 75 seconds the agent announces completion, keeping the game in place.
6. Score 95+ on the daily circle to see Pope Tibo and bank one simulated reset.

## Games

- **You’re Absolutely Right!** — 3×3 to 6×6 memory boards; fixed mosaic backs; one unmatchable blank on odd boards; time and moves.
- **Make No Mistakes** — one wrong character ends the run; Daily 60s / Free Play 300s; seeded progressive phrases; local character/WPM records; IME-aware committed input; paste blocked.
- **Draw Me a Yellow Circle** — three-second target reveal, press-centre/drag-radius/release submission, position and size scoring; mouse, touch and keyboard; generated Tibo parody and daily reward wallet.

Daily mode is repeatable. Challenges use UTC dates. Scores and mock rewards stay on this browser. Clearing browser data clears them. There are no global rankings.

## Structure

- `src/App.tsx`: mock chat, sidebar navigation, profile and agent demo.
- `src/features/{memory,typing,circle}/`: game components and feature styles.
- `src/lib/challenges.ts`: deterministic challenges and scoring.
- `src/lib/records.ts`: validated local records and idempotent daily claims.
- `src/lib/sound.ts`: optional synthesized game sounds.
- `src/lib/*.test.ts`: generation, input, scoring, storage and reward tests.

The GitHub repository is `fabianchua6/chatjipiti-game`. The local folder retains its original plural name, `chatjipiti-games`.

Read [PRODUCT.md](PRODUCT.md), [CONTRIBUTING.md](CONTRIBUTING.md), [docs/ACCEPTANCE.md](docs/ACCEPTANCE.md) and [docs/ASSETS.md](docs/ASSETS.md).

This is a parody prototype. ChatGPT authentication, model execution, agent detection and real usage resets are not connected. The memory poster remains temporary abstract art.
