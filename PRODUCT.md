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
- Sending a prompt starts a scripted 30-second task. The ghost invitation expands to slim game cards; choosing one starts a compact playable window inside the chat. Minimise pauses the round into a pixel pet; clicking the pet resumes it. Task completion preserves the game.
- User nickname, local best scores and simulated Codex reset reward wallet.
- All three games with daily seeded challenges and unlimited Free Play.
- The project is solo. There is no collaborator assignment or Rachiket invitation.
- Sign-in, model responses, running-agent state and usage rewards are explicitly simulated. No real account quota is modified.

## Memory: You’re Absolutely Right!

Progress 3×3, 4×4, 5×5, 6×6. Odd boards have one blank at a shuffled position. The blank cannot match; it flips back, preserves any open agent and remains after all pairs clear. Hidden faces shuffle; card backs remain fixed by board position. Rank by completion time, then moves, separately for each board.

A blank reveal counts as one move; a two-card comparison counts as one move. Backs use the exact user-supplied Astra poster. Faces use five SVG geometric designs based on the supplied agent-icon screenshot, plus thirteen distinct variants for larger boards. No visible names appear on cards; accessible descriptions remain.

## Typing: Make No Mistakes

Typing happens directly in the pixel-text passage. A transparent native textarea overlays the passage to preserve keyboard and composition support; the highlighted character acts as the visible cursor. One incorrect committed character ends the run. Short lowercase AI jokes form exactly 15 words per round. Daily and Free Play both cap the round at 30 seconds, or end earlier when the passage is complete. Timer starts with first input. Backspaces and edits end the run; navigation/modifier keys do not. Paste and drop are blocked without awarding characters. IME is validated after composition commits. Browser text assistance is disabled where supported.

Display correct characters, completed words, WPM, elapsed time and fatal mistake. Rank by correct characters, then WPM. WPM uses five characters per word and a minimum one-second denominator for very short runs. A trailing unfinished word is not counted as completed; finishing the full passage counts all 15 words. Short-round records use a new key so legacy long-run scores remain separate.

## Circle: Draw Me a Yellow Circle

A generated pixel-art room follows the supplied stage reference: a large dark screen, wood paneling and an older man seen from behind in a lounge chair. A square interactive drawing area sits inside the illustrated screen. Tibo asks for a yellow circle. Target appears for three seconds, then disappears. First touch sets centre; drag sets radius; release submits. Re-show the target to compare. Pointer cancel discards a stroke. Drawing uses mouse or touch only. Keyboard shortcuts manage rounds: Space starts or restarts; Enter opens the next game after completion. Coordinates normalize to a square that remains geometrically consistent on resize.

Position and radius each contribute 50 points. Position falls linearly to zero at a distance of two target radii; size falls linearly to zero at a radius error equal to the target radius. A zero-radius stroke scores zero. At 90+, Pope Tibo descends and a synthesized chord plays when sound is enabled.

Every circle score of 90+ earns one demo Codex reset in either mode, including repeat attempts. A unique round ID prevents duplicate submissions from crediting the same round twice. Existing daily rewards remain in the wallet; new rewards persist per round, with a session fallback when browser storage is unavailable. Every win shows the golden “CODEX RESET BLESSED” celebration.

## Provisional decisions for this version

- Dark ChatGPT-style shell, rather than the former standalone arcade home.
- Daily challenges are repeatable and show device-local best scores, not a global leaderboard.
- Daily rollover is midnight UTC.
- Simulated reset rewards repeat on every qualifying round in Daily and Free Play.
- Agent demo uses a scripted 75-second run and preserves its banner height at completion.
- Audio starts enabled on every visit; the mute button applies to the current session.

## Evidence and remaining assets

Tibo artwork was generated for this project as an original fictional pixel-art parody. It is not an official likeness. The earlier source conversation's yellow-circle launch-ad claims were not verified; no official imagery is implied. See docs/ASSETS.md for provenance.

The source conversation reported a deployed app, GitHub repo and exactly 90-second demo as submission requirements. Recheck the actual event brief before submitting; no event timing was independently verified here.
