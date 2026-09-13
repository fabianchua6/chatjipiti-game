/** A monotonic game clock that excludes time spent minimised. */
export function createGameClock(readTime: () => number = () => performance.now()) {
  let pausedAt: number | null = null;
  let pausedDuration = 0;
  return {
    now: () => (pausedAt ?? readTime()) - pausedDuration,
    setPaused(paused: boolean) {
      if (paused && pausedAt === null) pausedAt = readTime();
      else if (!paused && pausedAt !== null) {
        pausedDuration += readTime() - pausedAt;
        pausedAt = null;
      }
    },
  };
}
