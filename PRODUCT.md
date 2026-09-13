# ChatJiPiTi Game

<!-- impeccable:product-schema 1 -->

## Platform

web

## Purpose and users

A solo hackathon project by Fabian. A mock ChatGPT-style interface makes the time spent waiting for an agent fun, with three small games accessible from its sidebar. Tagline: **Play while your agents work.** The product name is singular: **ChatJiPiTi Game**.

## Stack and delivery

React, TypeScript and Vite; client-only state and localStorage, no backend credentials. The GitHub repo is `fabianchua6/chatjipiti-game`, private. Local checkout retains the original folder name `chatjipiti-games` to preserve existing workspace links. This release runs locally; hosting is not configured.

## Confirmed scope

- ChatGPT-style dark chat home, working mock composer, sidebar game library and individual games.
- Sending a prompt starts a scripted agent task, offers Fancy a game, and completes after 75 seconds without interrupting the game.
- User nickname, local best scores and simulated banked Astra reset wallet.
- All three games with daily seeded challenges and unlimited Free Play.
- The project is solo. There is no collaborator assignment or Rachiket invitation.
- Sign-in, model responses, running-agent state and usage rewards are explicitly simulated. No real account quota is modified.

## Memory: You’re Absolutely Right!

Progress 3×3, 4×4, 5×5, 6×6. Odd boards have one blank at a shuffled position. The blank cannot match; it flips back, preserves any open agent and remains after all pairs clear. Hidden faces shuffle; card backs remain fixed by board position. Rank by completion time, then moves, separately for each board.

A blank reveal counts as one move; a two-card comparison counts as one move. Current backs are an abstract purple mosaic. Final Astra poster artwork remains open.

## Typing: Make No Mistakes

One incorrect committed character ends the run. Curated AI memes, prompts and agent terminology progress from lowercase phrases into capitalization, punctuation, numbers and code. Daily: 60 seconds. Free Play: 300 seconds. Timer starts with first input. Backspaces and edits end the run; navigation/modifier keys do not. Paste and drop are blocked without awarding characters. IME is validated after composition commits. Browser text assistance is disabled where supported.

Display correct characters, completed words, WPM, elapsed time and fatal mistake. Rank by correct characters, then WPM. WPM uses five characters per word and a minimum one-second denominator for very short runs. A trailing unfinished word is not counted as completed.

## Circle: Draw Me a Yellow Circle

Tibo sits in a chair and asks for a yellow circle. Target appears for three seconds, then disappears. First touch sets centre; drag sets radius; release submits. Re-show the target to compare. Pointer cancel discards a stroke. Keyboard support: arrows move centre, +/- resize, Shift refines step, Enter submits, Escape cancels. Coordinates normalize to a square that remains geometrically consistent on resize.

Position and radius each contribute 50 points. Position falls linearly to zero at a distance of two target radii; size falls linearly to zero at a radius error equal to the target radius. A zero-radius stroke scores zero. At 95+, Pope Tibo descends and a synthesized chord plays when sound is enabled.

Daily 95+ earns one simulated reset per UTC date. Claim markers determine balance, so rerenders, repeat attempts and reopening cannot increment the same date. Web Locks serialize claims across tabs where supported; balance remains one key per date even without locks. Practice grants a celebration but no wallet credit.

## Provisional decisions for this version

- Dark ChatGPT-style shell, rather than the former standalone arcade home.
- Daily challenges are repeatable and show device-local best scores, not a global leaderboard.
- Daily rollover is midnight UTC.
- Simulated reset rewards are Daily-only and limited to one per day.
- Agent demo uses a scripted 75-second run and preserves its banner height at completion.
- Audio starts muted and remembers the preference.

## Evidence and remaining assets

Tibo artwork was generated for this project as an original fictional pixel-art parody. It is not an official likeness. The earlier source conversation's yellow-circle launch-ad claims were not verified; no official imagery is implied. See docs/ASSETS.md for provenance.

The source conversation reported a deployed app, GitHub repo and exactly 90-second demo as submission requirements. Recheck the actual event brief before submitting; no event timing was independently verified here.
