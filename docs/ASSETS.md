# Artwork provenance

All artwork in this prototype is local and original or generated for this project. The built-in image generator’s underlying model is not recorded in the asset files. The optional local API names its runtime models in `server/api.ts`: `gpt-image-2.5-sunburst` for images and `gpt-6-astra` for agent runs. Live API behavior is parked and has not been verified.

## Pope Tibo sprite sheet

`public/pope-tibo.png`, 1536×1024, generated with the built-in image generator for this project on 2026-09-13. Two equal cells: seated man in hoodie; the same fictional character as a playful pope. CSS selects the two halves. The PNG has alpha transparency with a residual translucent glow. No image editing was used.

Original fictional satire, not official OpenAI artwork or an exact real-person likeness. The prior conversation's ad/reference claims were not confirmed. Reference research found OpenAI’s public Thibault Sottiaux profile at https://openai.com/build-week/ but no verified Pope Tibo visual.

Prompt:

> Create exactly one 1536x1024 landscape transparent-background sprite sheet split vertically into two equal 768px-wide halves. The SAME original fictional male game character appears in both halves, with matching body scale, centered independently in each half, full figure completely contained with generous transparent margin. Left: warm approachable dark-haired short-bearded man in a black hoodie seated relaxed on a simple wooden chair, front/three-quarter. Right: the same man as a playful benevolent pope in white-and-gold mitre and robe, standing front-facing with arms open and a small golden halo. Crisp charming 32-bit pixel art with visible square pixels and clean stepped edges. Warm, friendly, playful mood. Restrained cream, gold, black and warm skin palette. Exactly two figures, transparent background, no text, logos, platforms, backdrop, gradients, border, divider, extra props or people. Original satirical Pope Tibo game art, not an official likeness.

## Other assets

- Original SVG interface icons in src/components/Icon.tsx.
- CSS arcade motifs.
- DM Sans and Press Start 2P, self-hosted via @fontsource packages with bundled license files in node_modules.
- Synthesized sounds generated at runtime with Web Audio. No sampled recordings.

## Astra poster and geometric card faces

`public/astra-poster.png` is the exact user-supplied 909×909 PNG, copied without alteration. CSS slices the poster by fixed card position; only hidden face identities shuffle.

`src/features/memory/AgentShape.tsx` contains 24 authored SVG interpretations based on the five geometric icon families in the supplied screenshot: flower, hourglass, four rings, rounded cross and beaded diamond. The expanded face set supports the larger boards. No visible card names; accessible color/shape descriptions remain. The source screenshot and its adjacent conversation labels are not distributed.

Cards use the fixed-position Astra poster as their back and local SVG faces as their fronts. Flip timing and perspective are implementation choices informed by [Balatro’s official press kit](https://www.playbalatro.com/press-kit/) and Marvel’s official [Marvel Snap art article](https://www.marvel.com/articles/games/inside-the-art-of-marvel-snap), not copied game assets.

## Retro circle rooms

`public/environments/classic.png`, `public/environments/forest.png` and `public/environments/moon.png` are three bundled generated environments. They reinterpret the supplied room reference as original pixel art while preserving the chair, board/screen and briefcase positions needed by the game composition. The in-game appearance settings select among them; there is no separate Art Studio route or sidebar item.

`public/circle-room.png`, 1536×1024, generated on 2026-09-13 with the built-in image generator using the user-supplied room/chair screenshot as a composition reference. It is a stylized interpretation, not the original photograph. The output screen is rectangular, so a square SVG playfield is overlaid within its bounds to retain consistent circle geometry. No bitmap editing was applied.

Prompt brief: Create a 1536×1024, 3:2 retro 8/16-bit pixel-art stage. Warm wood-paneled room and floor; large front-on dark green display on the left; older white-haired man viewed from behind in a broad brown midcentury lounge chair at lower right; dark bottle beside the chair. Hard square pixels, stepped edges, warm brown/cream palette. Keep the screen clear and unobstructed with no text, circles, graphics, logos or markings. Reinterpret the supplied image as an original game scene.

The optional local generation route writes new outputs and metadata under ignored `.generated/`; it does not alter these bundled references. A missing `OPENAI_API_KEY` leaves the demo usable and disables generation controls. No remote image downloads, third-party screenshots or public deployment security guarantees are part of this asset set.

## Reference notes

The surrounding mock interface follows the official [OpenAI Apps UI guidelines](https://developers.openai.com/plugins/concepts/ui-guidelines) and the official [`apps-sdk-ui` tokens](https://raw.githubusercontent.com/openai/apps-sdk-ui/main/src/styles/variables-semantic.css). Their guidance covers system-native typography, grid spacing, corner rounds, WCAG AA, compact cards and fullscreen or PiP for rich interactions. Primitive neutral, yellow and shadow values are documented in [OpenAI’s primitive token source](https://raw.githubusercontent.com/openai/apps-sdk-ui/main/src/styles/variables-primitive.css).

The character is original parody art. OpenAI’s [Build Week page](https://openai.com/build-week/) identifies Thibault Sottiaux, but no primary source confirms a “Pope Tibo” visual or yellow-circle reference. The [GPT-6 Astra announcement](https://openai.com/index/gpt-6-astra/) supplies model context only; it does not establish ownership or approval of these game assets.

## Live generated card pack verification

Sea Glass Agents was created through the in-game card settings on 2026-09-13 using `gpt-image-2.5-sunburst`. Its local manifest records that exact model and the resulting 1536x1024 PNG. The ignored local `.generated/` folder stores the image, not the Git repository.

User-facing prompt: “Small softly rounded geometric agent emblems made from translucent sea glass. Eighteen visibly different silhouettes: folded cyan hourglass, coral petal cross, lavender diamond stack, mint cube flower, gold orbit, indigo star prism, and twelve equally distinct original abstract shapes. Quiet charcoal background, subtle dimensional lighting, clean bold silhouettes.” The server prepends the strict 6-column, 3-row atlas layout constraints.

Coral Observatory was generated through the local environment-edit API using `gpt-image-2.5-sunburst`, with the classic room as its reference. The resulting 1536x1024 image retains the large blank board, chair, seated man and handled briefcase. Prompt: “An underwater research station in a turquoise reef. Keep the exact large blank board, seated elderly man, lounge chair and upright handled briefcase in their same positions. Give him a vintage navy explorer jacket. Beyond the board are glass walls with coral, softly lit fish and shafts of ocean light. Crisp retro pixel art and warm interior lighting.”
