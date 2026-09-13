# ChatJiPiTi Game

**Play while your agents work.** A mock ChatGPT interface with three games in the sidebar.

## Run the demo

Node 24 is recommended (minimum 22.12).

```sh
npm ci
npm run dev
```

Open the localhost URL printed by Vite. The mock demo works without API keys.

For the optional local Node API, build first and then run:

```sh
npm run build
npm start
```

The API server listens on `127.0.0.1:4173` by default and serves the built `dist/` output. Set `PORT` to use another local port. Its routes include `/api/status`, `/api/assets`, `/api/generate`, `/api/generations/:id`.

The API reads `OPENAI_API_KEY` from the environment or `.env.local`. The optional image route uses `gpt-image-2.5-sunburst`; chat always runs as a simple local simulation. A missing key keeps the mock experience available and disables live controls. Live card-pack and environment generation have been verified with the configured local key. GPT-Live-1 remains parked.

A restricted key only needs Images Request permission for the final app.

`.env.local` is ignored by Git and the setup endpoint writes it with mode `0600`. Generated responses are stored under ignored `.generated/`. This repository makes no public-server deployment or security claim.

```sh
npm test
npm run build
```

Static production output is `dist/`. Fonts and game artwork are bundled locally. A private ChatGPT Sites deployment is configured; see [hosting and releases](docs/HOSTING.md).

## Demo flow

1. Open New chat, enter a prompt or use a suggestion.
2. Sending the prompt starts the mock task and shows the ghost button **Fancy a game while you wait?** in the chat.
3. Expand the invitation, then click a game to play its daily challenge inside the chat. The sidebar still opens the full game pages.
4. Games appear together as rounded icon cards, with unplayed games first and only the icon and game title visible; Daily and Free Play both count. Minimise pauses the round into a small pixel pet; click the pet to resume. The mock keeps running while you play.
5. After 30 seconds the agent announces completion, keeping the game in place.
6. Score 90+ on the daily circle to see Pope Tibo and bank one simulated reset.

## Games

- **You’re Absolutely Right!** — 3×3 to 6×6 memory boards; fixed Astra poster backs and 24 authored SVG geometric faces; one unmatchable blank on odd boards; smooth flips, cosmic matched-pair celebrations that grow from “YOU’RE ABSOLUTELY RIGHT” to “YOU’RE ABSOLUTELY ASTRONOMICALLY RIGHT” and “YOU’RE ABSOLUTELY ASTRONOMICALLY INFINITELY RIGHT” at four consecutive pairs; another word is added every two pairs, time and moves. Appearance choices and optional generation live in a small collapsible settings panel inside the game.
- **Make No Mistakes** — inline pixel-text input; one wrong character ends the run; 15 words and a 30-second cap in both modes; seeded lowercase phrases; local character/WPM records; IME-aware committed input; paste blocked.
- **Draw Me a Yellow Circle** — three-second target reveal, press-centre/drag-radius/release submission, position and size scoring; mouse and touch drawing, keyboard round controls; retro wood-room stage, generated Pope Tibo parody and daily reward wallet. Classic, Forest and Moon environments are selectable from the in-game settings panel.

Daily mode is repeatable. Challenges use UTC dates. Scores and mock rewards stay on this browser. The chat’s played-today list also resets at midnight UTC. Clearing browser data clears stored scores and play history. There are no global rankings.

## Structure

- `src/App.tsx`: mock chat, sidebar, profile and agent demo.
- `src/features/{memory,typing,circle}/`: game components and feature styles.
- `src/lib/challenges.ts`: deterministic challenges and scoring.
- `src/lib/records.ts`: validated local records and idempotent daily claims.
- `src/lib/sound.ts`: optional synthesized game sounds.
- `server/api.ts` and `server/index.ts`: local image-generation API.
- `src/lib/*.test.ts` and `server/*.test.ts`: generation, input, scoring, storage and API tests.

The GitHub repository is `fabianchua6/chatjipiti-game`. The local folder retains its original plural name, `chatjipiti-games`.

Read [PRODUCT.md](PRODUCT.md), [CONTRIBUTING.md](CONTRIBUTING.md), [docs/ACCEPTANCE.md](docs/ACCEPTANCE.md), [docs/ASSETS.md](docs/ASSETS.md) and [DESIGN.md](DESIGN.md).

This is an independent parody prototype. ChatGPT authentication and real usage resets are simulated. Artwork generation uses real credits when configured. Chat always uses a scripted response. The game only follows tasks submitted in its own chat.
