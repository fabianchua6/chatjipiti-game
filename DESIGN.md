# ChatJiPiTi Game design

The project is a paired hackathon prototype with a mock ChatGPT shell. The shared shell uses familiar chat proportions, quiet chrome and a persistent sidebar. The partner is intentionally unspecified in product copy.

- Canvas `#212121`; sidebar `#171717`; composer `#303030`; readable DM Sans throughout chat.
- Desktop sidebar 260px (240px on compact desktop), full-height chat workspace and header. Mobile uses a dismissible drawer with focus management.
- Initial home centres a greeting and working composer. Suggestions start a scripted task. The in-chat invitation is the main bridge into games.
- Sidebar exposes ChatJiPiTi Game and the three games. Hash routes support browser history. There is no separate Art Studio route or sidebar item.
- Game library keeps a small retro signature: pixel heading, original geometric game art, purple memory, coral typing and gold circle.
- Memory uses 24 authored SVG faces. Cards flip with a smooth perspective transition and matched pairs trigger a short particle and proclamation celebration.
- Circle has three bundled generated environments: Classic, Forest and Moon. Each keeps the room composition with the chair, board/screen and briefcase. New appearance selection and optional generation are compact, collapsible settings inside the memory and circle games.
- Circle art is generated original pixel-art parody, cropped by CSS into two sprite cells without modifying the source PNG.
- Focus is a warm outline. Reduced-motion removes animations. Sound is opt-in and locally remembered.
- Completion preserves the agent-strip layout so the circle canvas does not move while a user draws.

## Reference decisions

The mock shell takes its spacing, typography and accessibility cues from the official [OpenAI Apps UI guidelines](https://developers.openai.com/plugins/concepts/ui-guidelines) and the official [`apps-sdk-ui` semantic tokens](https://raw.githubusercontent.com/openai/apps-sdk-ui/main/src/styles/variables-semantic.css). The token source uses a 4px spacing base, system UI font stack, 12–18px body sizes, 16–24px corner radii, an 800px chat max width, 20px chat gutters and a 24px composer radius. The project’s dark shell and yellow accent are local adaptations, not claims of official ChatGPT branding.

The primitive token source documents the neutral surfaces, yellow values and shadow geometry used as references: [OpenAI primitive tokens](https://raw.githubusercontent.com/openai/apps-sdk-ui/main/src/styles/variables-primitive.css). The lightweight game interaction takes cues from [Balatro’s official press kit](https://www.playbalatro.com/press-kit/) and Marvel’s official [Marvel Snap art article](https://www.marvel.com/articles/games/inside-the-art-of-marvel-snap), which describes frame-breaking 3D effects and animation bringing cards to life.

Card motion values are implementation inferences rather than official values: `perspective: 900px`, approximately 520ms `cubic-bezier(.22,.8,.24,1)`, `transform-style: preserve-3d`, `backface-visibility: hidden`, a subtle `rotateY(180deg) scale(1.01)`, 12–16px radius, 1px border and layered 8px shadow geometry. These values should remain easy to tune against the local preview.

The [OpenAI Build Week page](https://openai.com/build-week/) identifies Thibault Sottiaux as Head of Product & Platform, but no primary source establishes a “Pope Tibo” visual or yellow-circle reference. The character is original parody art. The Astra model context is documented by [OpenAI’s GPT-6 Astra announcement](https://openai.com/index/gpt-6-astra/); live integrations remain parked and unverified.
