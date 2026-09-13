# ChatJiPiTi Games working agreements

Read PRODUCT.md, README.md and CONTRIBUTING.md before changes. Preserve unrelated edits. This is a two-person hackathon repository; agree file ownership before parallel edits.

- Keep game features isolated under src/features/<game>.
- Shared shell: src/App.tsx and src/styles.css. Coordinate changes with Fabian.
- Keep sign-in, waiting-agent state and banked usage resets explicitly simulated. Never call real account reset tools for game rewards.
- Do not invent leaderboards, percentile populations, official artwork or integration claims.
- Preserve deterministic daily seeds and fixed-position poster backs.
- Store only device-local prototype data. Never commit secrets, personal correspondence or finance files.
- Use React and TypeScript without adding backend dependencies unless the agreed product requires them.
- Validate material game changes with meaningful rule tests and a production build. Check actual mobile and keyboard behavior for interactive changes.
- For complex independent investigations, delegate read-only exploration/review; avoid overlapping implementation edits.
- Never publish, deploy, invite collaborators or change visibility without authorization for the specific action.
