import { useGameClock } from '../lib/useGameClock';
import { useEffect, useState } from 'react';
import Icon from './Icon';
import GameRoundControls from './GameRoundControls';
import './game-result-overlay.css';

type Game = 'memory' | 'typing' | 'circle';


export default function GameResultOverlay({ game, summary, onReplay, onNextBoard, delay = 0, paused = false }: {
  game: Game;
  summary: string;
  onReplay: () => void;
  onNextBoard?: () => void;
  delay?: number;
  paused?: boolean;
}) {
  const clock = useGameClock(paused);
  const [until] = useState(() => clock.now() + delay);
  const [ready, setReady] = useState(delay === 0);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    if (paused || ready) return;
    const timer = setInterval(() => { if (clock.now() >= until) setReady(true); }, 50);
    return () => clearInterval(timer);
  }, [clock, paused, ready, until]);

  if (!ready) return null;
  if (dismissed) return <button className="game-result-reopen" onClick={() => setDismissed(false)}>Results <Icon name="chevron"/></button>;
  return <div className="game-result-overlay">
    <div className="game-result-actions" onKeyDown={event => {
      if (event.key === 'Escape') { event.stopPropagation(); setDismissed(true); }
    }}>
      <button className="game-result-close icon-button" aria-label="Hide game results" onClick={() => setDismissed(true)}><Icon name="close"/></button>
      <p role="status">{summary}</p>
      <div className="game-result-buttons">
        {onNextBoard && <button onClick={onNextBoard}>Next board <Icon name="chevron"/></button>}
        <GameRoundControls game={game} onRestart={onReplay}/>
      </div>
    </div>
  </div>;
}
