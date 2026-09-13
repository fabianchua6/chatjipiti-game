import { useLayoutEffect, useState } from 'react';
import { createGameClock } from './gameClock';

export function useGameClock(paused: boolean) {
  const [clock] = useState(createGameClock);
  useLayoutEffect(() => { clock.setPaused(paused); }, [clock, paused]);
  return clock;
}
