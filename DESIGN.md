# ChatJiPiTi Game design

The user replaced the standalone arcade landing page with a mock ChatGPT-style interface. The shared shell now uses familiar chat proportions, quiet chrome and a persistent sidebar.

- Canvas #212121; sidebar #171717; composer #303030; readable DM Sans throughout chat.
- Desktop sidebar 260px (240px on compact desktop), full-height chat workspace and header. Mobile uses a dismissible drawer with focus management.
- Initial home centres a greeting and working composer. Suggestions start a scripted task. The in-chat invitation is the main bridge into games.
- Sidebar exposes ChatJiPiTi Game and all three individual games. Hash routes support browser history.
- Game library keeps a small retro signature: pixel heading, original geometric game art, purple memory, coral typing and gold circle.
- Circle art is generated original pixel-art parody, cropped by CSS into two sprite cells without modifying the source PNG.
- Focus is a warm outline. Reduced-motion removes animations. Sound is opt-in and locally remembered.
- Completion preserves the agent-strip layout so the circle canvas does not move while a user draws.
