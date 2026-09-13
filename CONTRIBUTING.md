# Working as a pair

Clone the shared GitHub repository once remote creation is approved. Do not work from the Caison project mirror.

```sh
git switch main
git pull --ff-only
git switch -c feat/your-name-short-description
npm ci
npm run dev
```

Use `feat/fabian-shell`, `feat/rachiket-typing` and `feat/rachiket-circle` as examples. Each person creates their own branch locally. Open a pull request into `main`, include the behavior changed and checks run, and let the other person review before merging. Pull main again before starting the next feature.

## Avoid collisions

- Agree on ownership in the README before coding.
- Put game code and game-specific CSS inside its feature folder.
- Coordinate changes to App.tsx, shared styles, shared types, dependencies and hosting.
- Never revert someone else’s unrelated work to make a build pass.
- Avoid shared long-lived branches and force pushes to main.
- Run `npm test` and `npm run build` before requesting review.

## Useful Codex handoff

Open this repository folder as the Codex project. Tell Codex which feature directory it owns and link PRODUCT.md. For example:

> Implement Make No Mistakes according to PRODUCT.md. Own src/features/typing/ and game-specific tests. The shared shell is being edited separately. Coordinate any shared-interface change and do not revert unrelated work. Test a successful run, a fatal incorrect key and the time limit.

No real ChatGPT password, API key, account-reset API or paid backend is needed.
