# Development

This is Fabian’s solo project. Rachiket is not a collaborator on this idea.

Use small feature branches when useful, keep games isolated, and preserve unrelated edits.

```sh
git switch -c feat/short-description
npm ci
npm run dev
npm test
npm run build
```

Keep game CSS with the game, shared UI in App.tsx/styles.css and deterministic rules under src/lib. Avoid introducing backend services unless the product needs them.

Before a commit, check changed interactive flows in the browser. Use both phone and desktop layouts for UI work. Unit tests should cover actual rules and failure cases.

Never commit secrets or personal correspondence. All ChatGPT account surfaces and reset rewards remain explicit simulations.
