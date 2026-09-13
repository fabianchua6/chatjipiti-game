# Artwork provenance

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

`src/features/memory/AgentShape.tsx` contains authored SVG interpretations of the five geometric icons in the supplied screenshot: flower, hourglass, four rings, rounded cross and beaded diamond. Thirteen distinct geometric variations support all eighteen pairs on the 6×6 board. No visible card names; accessible color/shape descriptions remain. The source screenshot and its adjacent conversation labels are not distributed.

## Retro circle room

`public/circle-room.png`, 1536×1024, generated on 2026-09-13 with the built-in image generator using the user-supplied room/chair screenshot as a composition reference. It is a stylized interpretation, not the original photograph. The output screen is rectangular, so a square SVG playfield is overlaid within its bounds to retain consistent circle geometry. No bitmap editing was applied.

Prompt brief: Create a 1536×1024, 3:2 retro 8/16-bit pixel-art stage. Warm wood-paneled room and floor; large front-on dark green display on the left; older white-haired man viewed from behind in a broad brown midcentury lounge chair at lower right; dark bottle beside the chair. Hard square pixels, stepped edges, warm brown/cream palette. Keep the screen clear and unobstructed with no text, circles, graphics, logos or markings. Reinterpret the supplied image as an original game scene.
