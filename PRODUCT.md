# ChatJiPiTi Games

<!-- impeccable:product-schema 1 -->

## Platform

web

## Purpose and users

Give people short, playful things to do while ChatGPT agents work. The hackathon pair is Fabian and Rachiket. Tagline: **Play while your agents work.**

## Stack

Implementation choice for this starter: React, TypeScript and Vite. Client-only state and localStorage, no backend credentials. This is an agent-selected reversible choice, not a framework preference explicitly confirmed by the user. Sites is the intended hosting destination from the supplied plan; it is not set up yet.

## Confirmed scope

- Mock Continue with ChatGPT, nickname, profile and local scores.
- Three games, each with shared Daily Challenge and unlimited Free Play.
- Mock waiting screen with Fancy a game invitation. Real automatic launch is future work.
- Simulated banked ChatGPT/Astra usage reset rewards. Never modify a real account quota.
- One cohesive retro arcade appearance: dark background, green main accent, purple memory game, red typing game, yellow circle game. Pixel headings with readable body text and touch-friendly controls.

## Memory: You’re Absolutely Right!

Progress 3×3, 4×4, 5×5, 6×6. Odd boards have one blank at a shuffled position. It reveals no agent, cannot match, flips back and stays after all pairs clear. Hidden faces shuffle; poster pieces are fixed by board position. Matched cards show their agent faces. Rank by completion time, then moves. Final 6×6 needs 18 distinct agent faces.

Starter convention: selecting a blank counts as one move and preserves an already exposed nonblank card. Each ordinary two-card comparison counts as one move. Results currently apply per board, not the combined four-level run. These are documented implementation choices that can change.

## Typing: Make No Mistakes

One incorrect key ends the run. Curated AI memes, prompts and agent terminology get harder through longer words, capitalization, punctuation, numbers and small code snippets. Free Play stops at five minutes. Show correct characters, words, WPM and fatal mistake. Rank by correct characters, then WPM. Disable browser text assistance where possible. Daily 60-second cap is a proposal from the prior plan, not a user-confirmed decision.

## Circle: Draw Me a Yellow Circle

Target appears for three seconds, then disappears. First touch fixes centre, dragging sets radius, release submits a perfect geometric circle. Re-show target for comparison. Position and size each contribute 50 points. At 95+, Pope Tibo descends and grants one explicitly simulated banked Astra reset. Tibo sits in a chair before the request. Artwork and exact scoring falloff remain to be implemented.

## Open decisions

- Rachiket’s GitHub handle and final ownership split.
- Remote repo creation approval and visibility for final judging.
- Exactly one ranked daily attempt versus repeatable attempts; starter daily memory is explicitly repeatable.
- Separate local score tables versus a combined daily result. No percentile ranking without actual population data.
- Daily rollover: UTC is the current implementation choice.
- Avatar, final poster/agent artwork and verified Tibo reference.
- Whether Free Play can grant simulated resets, and reward deduplication rules.

## Evidence and limits

The user supplied a prior planning conversation. Its reported hackathon venue/times and external reference claims have not been independently rechecked in this task. The final submission requirements reported there are a deployed app, GitHub repo and exactly 90-second accessible demo showing how Astra was used. Verify against the actual event brief before submitting.

No final artwork was attached. Starter visuals are authored geometric CSS/SVG illustrations, not generated art or official OpenAI assets. Sign-in, agent waiting state and usage resets are demonstrations only.
