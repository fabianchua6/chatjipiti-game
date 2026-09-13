# Acceptance checklist

## Starter

- [ ] Fresh clone: npm ci, npm test and npm run build pass.
- [ ] Mock sign-in reaches the hub and saves nickname after reload.
- [ ] All three game entries and Back to arcade work.
- [ ] Fancy a game opens the hub and is labeled as a simulation.
- [ ] Memory starts its timer on first flip, clears mismatches, prevents extra flips during reveal, handles blanks and finishes each level.
- [ ] Progression reaches 6×6 and counts every required pair.
- [ ] Daily boards are deterministic and Free Play boards reshuffle.
- [ ] Best times persist separately from practice and per board size.
- [ ] Storage unavailable or malformed data does not prevent play.
- [ ] Phone layout, keyboard focus and reduced motion are usable.

## Before demo

- [ ] Typing runs to success/timeout and fails immediately on incorrect input; check physical keys, touchscreen input and composition handling.
- [ ] Circle supports pointer capture, cancel, release and responsive coordinates; target hidden during drawing.
- [ ] Circle rewards are simulated and cannot be duplicated by re-rendering or reopening a result.
- [ ] Final poster, agent faces and verified Tibo assets replace temporary art.
- [ ] Daily attempt policy and timezone are visible and tested.
- [ ] Audio mute and animation behavior are complete if included.
- [ ] Deployed app is reachable by judges without approval; repo visibility/access matches the submission brief.
- [ ] Exactly 90-second demo is accessible and shows Astra usage.
