import { InlineGameNavigation } from '../features/chat/InlineGameNavigation';
import { useContext, useEffect, useRef } from 'react';
import { roundShortcut } from '../lib/roundShortcuts';
import { Keycap } from './KeyboardLegend';

type Game = 'memory' | 'typing' | 'circle';
const nextGames: Record<Game, Game> = { memory: 'typing', typing: 'circle', circle: 'memory' };

export const roundLegend = [
  { keys: ['Space'], label: 'Restart' },
  { keys: ['Enter'], label: 'Next game' },
];

export function useRoundShortcuts(game: Game, completed: boolean, onRestart: () => void) {
  const navigateInline = useContext(InlineGameNavigation);
  const restart = useRef(onRestart);
  useEffect(() => { restart.current = onRestart; });
  useEffect(() => {
    if (!completed) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const action = roundShortcut(event, completed);
      if (!action) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const surface = document.querySelector(`.game-surface.${game}-game`);
      if (!surface?.contains(target) && target !== document.body && !target.matches('main')) return;
      if (target.closest('input:not(:disabled), textarea:not(:disabled), select, [contenteditable="true"], dialog, [role="dialog"]')) return;
      const control = target.closest('button, a, [role="button"]');
      if (control && !control.matches('[data-round-action], :disabled')) return;
      event.preventDefault();
      if (action === 'restart') restart.current();
      else if (navigateInline) navigateInline(nextGames[game]);
      else location.hash = nextGames[game];
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [game, completed, navigateInline]);
}

export default function GameRoundControls({ game, onRestart }: { game: Game; onRestart: () => void }) {
  const navigateInline = useContext(InlineGameNavigation);
  return <>
    <button type="button" className="primary" data-round-action="restart" aria-keyshortcuts="Space" onClick={onRestart}>Restart <Keycap>Space</Keycap></button>
    <a className="secondary" data-round-action="next-game" aria-keyshortcuts="Enter" href={`#${nextGames[game]}`} onClick={event => { if (navigateInline) { event.preventDefault(); navigateInline(nextGames[game]); } }}>Next game <Keycap>Enter</Keycap></a>
  </>;
}
