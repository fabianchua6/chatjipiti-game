# Acceptance

## Automated

Run `npm test` and `npm run build`.

Tests cover paired-board counts/blanks, deterministic dates, ranking, corrupt/unavailable storage, typing prefix mismatch/edit detection, WPM, progressive seeded text, contained circle targets, scoring bounds and daily reward idempotency.

## Browser

- Chat composer and suggestions start the mock agent; invitation and sidebar open games.
- Agent completion leaves the drawing surface in place and does not navigate away from a game.
- Memory reveals blanks, locks mismatches, completes boards and advances; previous score survives reload.
- Typing accepts correct characters, fails at first incorrect character, blocks paste, supports composed committed input and stops at deadline. Finish is disabled before input.
- Circle hides target after three seconds; pointer release scores, cancel aborts, zero-radius scores zero; keyboard controls work.
- Circle 95+ displays Pope Tibo; daily earns one reset; repeat success does not duplicate the balance; practice never awards resets.
- Sidebar profile wallet updates and persists across reload.
- Mobile drawer opens/closes, contains keyboard focus, and navigation moves focus to content.
- Phone layout has no horizontal overflow; reduced-motion and mute preferences work.

## Before submission

- Decide whether to make the repository public and choose hosting.
- Astra poster and five supplied geometric icon designs are integrated, with thirteen variations for larger boards.
- Confirm daily attempt/reward rules and the desired starting chat prompt.
- Verify the event’s actual submission brief; prepare an accessible 90-second demo if still required.

## Verified in the local preview, 2026-09-13

- Exact supplied poster forms a fixed mosaic; revealed faces have no visible names and retain accessible shape labels.
- Inline typing accepted ten characters and stopped on the next wrong key. Clicking the passage resumed native input. Backspace ended a second run with five accepted characters.
- Updated room pointer test scored 98.8/100 and displayed the blessing; repeat daily success reported already banked and retained a balance of one.
- Desktop and 390px layout inspected; phone-width typing has no horizontal overflow. Real mobile keyboard and IME behavior still require physical-device testing.
- Rule suite: 12 passing tests. Production TypeScript/Vite build passes.
