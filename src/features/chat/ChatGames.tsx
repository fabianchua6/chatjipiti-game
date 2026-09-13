import { useId, useState } from 'react';
import Icon from '../../components/Icon';
import { games } from '../../lib/games';
import type { GameId } from '../../lib/games';
import { usePlayedToday } from './usePlayedToday';
import './chat-games.css';

export default function ChatGames({ onChoose }: { onChoose: (game: GameId) => void }) {
  const played = usePlayedToday();
  const [expanded, setExpanded] = useState(false);
  const choicesId = useId();
  const ordered = [...games.filter(game => !played.has(game.id)), ...games.filter(game => played.has(game.id))];
  return <section className="chat-games" aria-label="Play a game">
    <button type="button" className="chat-games-invitation" aria-expanded={expanded} aria-controls={choicesId} onClick={() => setExpanded(value => !value)}>
      <Icon name="games"/><span>Fancy a game while you wait?</span><Icon name="down"/>
    </button>
    <div id={choicesId} className="chat-game-options" hidden={!expanded}>
      {ordered.map(game => <button type="button" key={game.id} className={`chat-game-card ${game.color}`} onClick={() => onChoose(game.id)} aria-label={`${played.has(game.id) ? 'Replay' : 'Play'} ${game.title}`}>
        <span className="chat-game-emblem"><Icon name={game.icon}/></span>
        <strong>{game.title}</strong>
      </button>)}
    </div>
  </section>;
}
