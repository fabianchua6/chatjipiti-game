import { useId, useRef, useState } from 'react';
import Icon from '../../components/Icon';
import CreateGameLink from '../../components/CreateGameLink';
import { games } from '../../games';
import type { GameId } from '../../lib/games';
import { usePlayedToday } from './usePlayedToday';
import { InlineGameNavigation } from './InlineGameNavigation';
import PixelPet from './PixelPet';
import './chat-games.css';
import './inline-game.css';

export default function ChatGames({ muted }: { muted: boolean }) {
  const played = usePlayedToday();
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [choosing, setChoosing] = useState(true);
  const choicesId = useId();
  const panel = useRef<HTMLDivElement>(null);
  const pet = useRef<HTMLButtonElement>(null);
  const invitation = useRef<HTMLButtonElement>(null);
  const activeGame = games.find(game => game.id === selected);
  const Game = activeGame?.component;
  const paused = !expanded || choosing;
  const ordered = [...games.filter(game => !played.has(game.id as GameId)), ...games.filter(game => played.has(game.id as GameId))];

  function focusGame() {
    requestAnimationFrame(() => {
      const body = panel.current?.querySelector('.inline-game-body');
      const target = body?.querySelector<HTMLElement>('textarea:not(:disabled)') ?? body?.querySelector<HTMLElement>('.memory-card:not(:disabled)') ?? body?.querySelector<HTMLElement>('.game-start') ?? body?.querySelector<HTMLElement>('.drawing-surface') ?? body?.querySelector<HTMLElement>('button:not(:disabled)');
      target?.focus({ preventScroll: true });
      panel.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
    });
  }
  function choose(game: string) {
    setSelected(game); setChoosing(false); setExpanded(true); focusGame();
  }
  function minimise() {
    setExpanded(false);
    requestAnimationFrame(() => (selected ? pet.current : invitation.current)?.focus({ preventScroll: true }));
  }
  function resume() { setChoosing(false); setExpanded(true); focusGame(); }

  return <section className="chat-games" aria-label="Play a game">
    <button ref={invitation} type="button" className="chat-games-invitation" aria-expanded={expanded} aria-controls={choicesId} onClick={() => expanded ? minimise() : selected ? resume() : setExpanded(true)}>
      <Icon name="games"/><span>Fancy a game while you wait?</span><Icon name="down"/>
    </button>
    <div id={choicesId}>
      <div className="chat-game-options" hidden={!expanded || !choosing}>
        {ordered.map(game => <button type="button" key={game.id} className={`chat-game-card ${game.color}`} onClick={() => choose(game.id)} aria-label={`Play ${game.title}`}>
          <span className="chat-game-emblem"><Icon name={game.icon}/></span><strong>{game.title}</strong>
        </button>)}
      </div>
      {expanded && choosing && <CreateGameLink/>}
      {expanded && choosing && activeGame && <button className="inline-game-back" onClick={resume}><Icon name="back"/>Resume {activeGame.title}</button>}
      {Game && activeGame && <div ref={panel} id={`${choicesId}-game`} className="chat-inline-game" role="region" aria-label={`${activeGame.title} mini game`} hidden={paused} inert={paused} data-game-paused={paused || undefined}>
        <div className="inline-game-toolbar"><span><Icon name={activeGame.icon}/><strong>{activeGame.title}</strong></span><div><button type="button" onClick={() => { setChoosing(true); requestAnimationFrame(() => invitation.current?.focus({preventScroll:true})); }}>Games</button><button type="button" onClick={minimise} aria-label="Minimise game"><Icon name="down"/><span>Minimise</span></button></div></div>
        <div className="inline-game-body"><InlineGameNavigation value={choose}><Game key={selected} mode="daily" muted={muted} paused={paused}/></InlineGameNavigation></div>
      </div>}
    </div>
    {selected && !expanded && <button ref={pet} type="button" className="chat-game-pet" onClick={resume} aria-label={`Resume ${activeGame?.title ?? 'game'}`} aria-expanded={false} aria-controls={`${choicesId}-game`}><span className="pet-caption">Game paused<span>Click to resume</span></span><PixelPet/></button>}
  </section>;
}
