import { useEffect, useRef } from 'react';
import Icon from '../../components/Icon';
import { games } from '../../lib/games';
import type { GameId } from '../../lib/games';
import './game-picker.css';

type Props = { open: boolean; working: boolean; onChoose: (game: GameId) => void; onDismiss: () => void };

export default function GamePicker({ open, working, onChoose, onDismiss }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const closing = useRef(false);
  const backdropDown = useRef(false);

  useEffect(() => {
    const element = dialog.current;
    const surface = panel.current;
    if (!open || !element || !surface) return;
    closing.current = false;
    surface.classList.remove('is-closing');
    element.showModal();
    // Establish the starting scale before the open transition.
    void surface.offsetWidth;
    surface.classList.add('is-open');
    heading.current?.focus({preventScroll:true});
    return () => {
      clearTimeout(closeTimer.current);
      surface.classList.remove('is-open', 'is-closing');
      element.close();
      closing.current = false;
    };
  }, [open]);

  function close(action: () => void) {
    if (closing.current) return;
    closing.current = true;
    panel.current?.classList.remove('is-open');
    panel.current?.classList.add('is-closing');
    const duration = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--modal-close-dur')) || 150;
    closeTimer.current = setTimeout(() => {
      dialog.current?.close();
      action();
    }, duration);
  }

  return <dialog ref={dialog} className="game-picker-dialog" aria-labelledby="game-picker-title" aria-describedby="game-picker-description" onCancel={event => { event.preventDefault(); close(onDismiss); }} onPointerDown={event => { backdropDown.current = event.target === event.currentTarget; }} onClick={event => { if (event.target === event.currentTarget && backdropDown.current) close(onDismiss); }}>
    <div ref={panel} className="game-picker-panel t-modal">
      <button className="icon-button game-picker-close" aria-label="Close game picker" onClick={() => close(onDismiss)}><Icon name="close"/></button>
      <h2 ref={heading} id="game-picker-title" tabIndex={-1}>Fancy a game?</h2>
      <p id="game-picker-description">{working ? 'I’m working on your request. Pick a game while you wait.' : 'Your demo response is ready. There’s still time for a game.'}</p>
      <div className="game-picker-options">
        {games.map(game => <button key={game.id} className={`game-picker-option ${game.color}`} onClick={() => close(() => onChoose(game.id))}>
          <span className="game-picker-icon"><Icon name={game.icon}/></span>
          <span className="game-picker-copy"><strong>{game.title}</strong><span>{game.description}</span></span>
          <Icon name="chevron"/>
        </button>)}
      </div>
      <button className="game-picker-skip" onClick={() => close(onDismiss)}>{working ? 'I’ll stay in chat' : 'Read my response'}</button>
    </div>
  </dialog>;
}
