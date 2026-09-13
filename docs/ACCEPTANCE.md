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
- Replace the temporary memory mosaic with final Astra poster if desired.
- Confirm daily attempt/reward rules and the desired starting chat prompt.
- Verify the event’s actual submission brief; prepare an accessible 90-second demo if still required.
