# ChatJiPiTi Game working agreements

Read PRODUCT.md and README.md. This is Fabian’s paired hackathon project. Keep partner details unspecified in product copy unless the user supplies them. Preserve unrelated edits.

- Keep game features under src/features/<game> and pure rules under src/lib.
- Preserve the mock ChatGPT shell and sidebar access to the game library. There is no separate Art Studio route or sidebar item; appearance selection and generation belong in compact, collapsible settings inside the memory and circle games.
- Keep profile and banked resets explicitly simulated. Never call real account-reset tools for rewards. User-authorized image generation is real when configured. Chat is a simple 30-second scripted simulation and never calls an agent API. GPT-Live-1 is parked.
- Do not invent leaderboards, populations, official art or integration claims.
- Preserve deterministic UTC daily seeds and fixed-position poster backs.
- Keep device-local prototype data only. No secrets or personal source correspondence in commits. `.env.local` is ignored and is written with mode `0600`; generated API assets live under ignored `.generated/`.
- The optional local Node API uses `gpt-image-2.5-sunburst` for image generation when `OPENAI_API_KEY` is present. Missing keys must leave the mock demo usable and disable live controls. Do not make public-server deployment or security claims from this prototype.
- Run meaningful rule tests and the production build. Verify affected desktop, touch and keyboard interactions.
- Delegate independent read-only investigation and review for complex changes; keep overlapping code edits in the main agent.
- The user authorized creating and populating the private fabianchua6/chatjipiti-game GitHub repo. Further publication or visibility changes need their direction.
