# ChatGPT Sites hosting

The existing Vite app is deployed as static files. No backend, API key, or database is required. Game rules, artwork, and browser-local records are unchanged.

The hosted copy is at https://chatjipiti-game.rachiketarya.chatgpt.site under Rachiket’s Sites account. It starts private; use Site sharing controls to grant other people access. This does not change the GitHub repository’s visibility or ownership.

## Release procedure

1. Select an explicit commit of `fabianchua6/chatjipiti-game` and preserve its game structure.
2. Install the locked dependencies with `npm ci`.
3. Run `npm test` and `npm run build` (includes TypeScript checking).
4. Validate `dist/index.html` and its referenced local assets.
5. Push the exact source state to the Site’s source repository, package `dist/` with the Sites hosting helper, and publish that saved version.
6. Wait for the deployment to succeed before reporting the release.

The `.openai/hosting.json` manifest identifies this Site and its static `dist/` output. It contains no credentials. Keep short-lived publishing credentials out of source and Git configuration.

GitHub pushes alone do not update the Site. An automated publisher has not yet been connected. Hosting setup does not add new games, modify Hearth, or grant agents repository write access.

## Future Hearth integration

A future implementation will need repository-aware coding execution, game registration in the existing shell, meaningful rule and browser checks, and an authenticated publishing step after an accepted GitHub change. Hearth’s current HTML-artifact runner cannot perform these repository operations by itself. Add that execution path before claiming automatic game releases.
