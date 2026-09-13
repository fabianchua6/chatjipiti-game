import { useSyncExternalStore } from 'react';
import { dailySeed } from '../../lib/game';
import { games } from '../../lib/games';
import { PLAYED_EVENT, wasPlayedToday } from '../../lib/playedToday';

function snapshot() {
  const now = new Date();
  return `${dailySeed(now)}:${games.map(game => wasPlayedToday(game.id, now) ? '1' : '0').join('')}`;
}

function subscribe(refresh: () => void) {
  let timer: ReturnType<typeof setTimeout>;
  function schedule() {
    clearTimeout(timer);
    const now = new Date();
    const midnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
    timer = setTimeout(update, midnight - now.getTime() + 50);
  }
  function update() { refresh(); schedule(); }
  window.addEventListener(PLAYED_EVENT, update);
  window.addEventListener('storage', update);
  window.addEventListener('focus', update);
  document.addEventListener('visibilitychange', update);
  schedule();
  return () => {
    clearTimeout(timer);
    window.removeEventListener(PLAYED_EVENT, update);
    window.removeEventListener('storage', update);
    window.removeEventListener('focus', update);
    document.removeEventListener('visibilitychange', update);
  };
}

export function usePlayedToday() {
  const value = useSyncExternalStore(subscribe, snapshot);
  const flags = value.slice(-games.length);
  return new Set(games.filter((_, index) => flags.charAt(index) === '1').map(game => game.id));
}
