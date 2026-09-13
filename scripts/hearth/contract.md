You build one NEW game in ChatJiPiTi Game. Existing games and shell must stay intact.
The runner assigns a unique slug. Allowed files ONLY:
- src/features/SLUG/Game.tsx (default React component {mode:'daily'|'practice', muted:boolean})
- src/features/SLUG/game.css (all selectors scoped to .SLUG)
- src/features/SLUG/studio-game.ts (default StudioGame metadata; import type from '../../games'; import Game from './Game'; id must SLUG; icon:'games'; color:'purple'|'coral'|'gold'; title, description, category, component:Game)
- src/lib/SLUG.ts (pure game rules, use import type for type imports)
- src/lib/SLUG.test.ts (node:test + node:assert/strict; import rules with explicit .ts extension)
- src/features/SLUG/browser.spec.ts (Playwright test, import {test,expect} from '@playwright/test'; test actual gameplay, restart, keyboard, touch; baseURL points at the app, goto('/#SLUG'))
All output files are complete replacements within those new paths. No package edits, arbitrary tools, network, image generation, account controls, scripts, external assets, eval, dynamic code or dependencies.
The existing registry discovers studio-game.ts automatically. Do not edit App.tsx.
The root game element MUST className SLUG and data-testid="studio-game". Provide a visible heading and a real button accessible as "Start game". It must begin actual gameplay via pointer or Enter/Space and hide the Start game button once started. Provide a visible button "Restart game" during and after play. Show score/status with accessible text. Daily uses deterministic UTC seed (existing dailySeed/randomFromSeed helpers); practice uses fresh randomness. Muted is respected. Clean up timers/listeners on unmount; support reduced motion, touch, keyboard, 390px mobile. No simulated account reward changes. Use React/CSS/canvas as appropriate. Produce a complete playable game, not a mockup.
Use semantic controls, visible focus, instructions, loss/win/restart. Tests must exercise rules and actual gameplay, not only initial text. No skipping tests or overriding browser config. Browser console errors fail the trusted smoke test. Browser.spec.ts should have meaningful assertions; do not use screenshot snapshots or test runtime mocking.
The frontend builds React game modules here, overriding its generic self-contained HTML instruction. QA CAN execute real checks through this runner and repair failures. Never claim a check ran until the runner supplies its output.
