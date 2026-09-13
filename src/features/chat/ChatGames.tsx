import Icon from '../../components/Icon';
import { games } from '../../lib/games';
import type { GameId } from '../../lib/games';
import { usePlayedToday } from './usePlayedToday';
import './chat-games.css';

export default function ChatGames({ working, onChoose }: { working: boolean; onChoose: (game: GameId) => void }) {
  const played = usePlayedToday();
  const unplayed = games.filter(game => !played.has(game.id));
  return <section className="chat-games" aria-label="Play a game">
    <h2>{unplayed.length ? working ? 'A game while you wait?' : 'Fancy a game?' : 'Another round?'}</h2>
    {unplayed.length > 0 && <div className="chat-game-options" aria-label="Not played today">
      {unplayed.map(game => <button key={game.id} className={`chat-game-option ${game.color}`} onClick={() => onChoose(game.id)} aria-label={`Play ${game.title}`}>
        <Icon name={game.icon}/>
        <span><strong>{game.title}</strong><small>{game.category}</small></span>
        <span className="chat-game-action">Play <Icon name="chevron"/></span>
      </button>)}
    </div>}
    {played.size > 0 && <div className="chat-game-replays">
      <p>Played today</p>
      {games.filter(game => played.has(game.id)).map(game => <button key={game.id} onClick={() => onChoose(game.id)} aria-label={`Replay ${game.title}`}><span>{game.title}</span><span>Replay <Icon name="chevron"/></span></button>)}
    </div>}
  </section>;
}
