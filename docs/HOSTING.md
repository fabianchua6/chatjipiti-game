# Hosting and Hearth cloud releases

The arcade is hosted at https://chatjipiti-game.rachiketarya.chatgpt.site/. Its existing Sites access policy is unchanged. The public source repo is fabianchua6/chatjipiti-game.

The Sites Worker serves the current tested bundle selected by `release.json` on the `hearth-published` branch. Each build has an immutable `builds/<mission-id>` directory. Root responses expose `X-Studio-Source-Sha` for release verification. This lets cloud releases update the hosted arcade without a Mac or per-release Sites connector session. Roll back by pointing release.json at a previous retained build through a normal commit to that branch.

## Automatic new games

A GitHub Actions schedule checks the owner’s Hearth queue about every five minutes (GitHub can delay scheduled jobs). Manual dispatch checks immediately. Public repo schedules may be disabled by GitHub after 60 days of inactivity; re-enable the workflow if this occurs. Source branch protections may require configuring the workflow actor to release, or changing delivery to a reviewed PR.

The runner reads current repository context and team definitions, uses OpenAI Responses for each role, records usage/handoffs in Hearth, and accepts human steering before every next action. Rules, build and browser checks run in a disposable unprivileged Docker container without network or credentials. Failed checks go back to QA for up to two repair attempts. A successful run fast-forwards main and publishes a validated bundle. No force pushes. Upstream changes during validation stop publication for a fresh run.

Repository secrets: OPENAI_API_KEY, HEARTH_RUNNER_SECRET, HEARTH_SITE_BEARER, STUDIO_SITE_BEARER. Only the trusted host orchestrator sees these; generated code never runs on that host. GITHUB_TOKEN provides repository-scoped write access. Never commit secrets, generated workspace transcripts or local .env files. The game code and release bundles are public with this repo; human mission notes stay in Hearth.

New games register through `src/features/<slug>/studio-game.ts`; see scripts/hearth/contract.md. The initial integration adds games; broad changes to existing games, dependencies, server code or deployment infrastructure require a separate trusted change.

## Local work and Sites worker updates

`npm test` and `npm run build` validate/build the browser app. `npm run build:site` additionally packages the Cloudflare Worker for Sites. Worker changes still use Sites source/version deployment with the existing project ID. Do not put transient runtime secrets in .openai/hosting.json.

The existing optional image-generation Node API remains a local feature; it is not deployed to the arcade Worker. Hosted artwork controls report unavailable, while bundled appearances and all games remain usable. The cloud runner’s API key is for engineering agents, not browser visitors or image-generation requests.
