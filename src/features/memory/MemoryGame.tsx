import { useGameClock } from '../../lib/useGameClock';
import { getMatchPhrase } from '../../lib/matchPhrases';
import { markPlayed } from '../../lib/playedToday';
import { useEffect, useRef, useState } from 'react';
import GameResultOverlay from '../../components/GameResultOverlay';
import { BOARD_SIZES, dailySeed, makeBoard, readBest, saveBest } from '../../lib/game';
import type { BoardSize, MemoryResult } from '../../lib/game';

import AgentShape from './AgentShape';
import { SHAPE_NAMES } from './shapeNames';
import MatchCelebration from './MatchCelebration';
import { useArtLibrary } from '../../lib/appearance';
import type { ArtAsset } from '../../lib/appearance';
import { playSound } from '../../lib/sound';
import './memory.css';
import GameRoundControls, { roundLegend, useRoundShortcuts } from '../../components/GameRoundControls';
import KeyboardLegend from '../../components/KeyboardLegend';
import ArtworkSettings from '../studio/ArtworkSettings';

type Props = { mode: 'daily' | 'practice'; muted: boolean; paused?: boolean };

export default function MemoryGame({ mode, muted, paused = false }: Props) {
  const { selected } = useArtLibrary('cards');
  const [level, setLevel] = useState(0);
  const size = BOARD_SIZES[level];
  const [attempt, setAttempt] = useState(0);
  const [seed, setSeed] = useState(() => mode === 'daily' ? dailySeed() : crypto.randomUUID());
  function nextLevel() { setLevel(value => value + 1); }
  function restart() {
    setLevel(0); setAttempt(value => value + 1);
    setSeed(mode === 'daily' ? dailySeed() : crypto.randomUUID());
  }
  return <section className="game-surface memory-game">
    <div className="game-heading"><div><h1>You’re Absolutely Right!</h1><p>Match every pair. The blank card is a little unhelpful.</p></div><span className="badge">{size} × {size}</span></div>
    <ArtworkSettings kind="cards"/>
    <MemoryBoard paused={paused} muted={muted} pack={selected} key={`${level}-${attempt}-${seed}`} size={size} seed={`${seed}:${size}`} mode={mode} onNext={level < 3 ? nextLevel : undefined} onRestart={restart} />
  </section>;
}

function MemoryBoard({ size, seed, mode, onNext, onRestart, muted, pack, paused }: { paused: boolean; muted: boolean; pack: ArtAsset; size: BoardSize; seed: string; mode: Props['mode']; onNext?: () => void; onRestart: () => void }) {
  const clock = useGameClock(paused);
  const [celebration, setCelebration] = useState<{ sequence: number; combo: number } | null>(null);
  const combo = useRef(0);
  const celebrationTimer = useRef<number | undefined>(undefined);
  const [board] = useState(() => makeBoard(size, seed));
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [result, setResult] = useState<MemoryResult | null>(null);
  const [saved, setSaved] = useState(true);
  const [notice, setNotice] = useState('Choose a card to start.');
  const started = useRef<number | null>(null);
  const timer = useRef<{ at: number; run: () => void } | undefined>(undefined);
  const key = `chatjipiti:v1:memory:${mode}:${mode === 'daily' ? seed : size}`;
  const [best] = useState(() => readBest(key));
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      const now = clock.now();
      if (started.current !== null) setSeconds(Math.floor((now - started.current) / 1000));
      if (timer.current && now >= timer.current.at) {
        const action = timer.current.run;
        timer.current = undefined;
        action();
      }
      if (celebrationTimer.current !== undefined && now >= celebrationTimer.current) {
        celebrationTimer.current = undefined;
        setCelebration(null);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [paused, clock]);
  function schedule(run: () => void, delay: number) {
    timer.current = { run, at: clock.now() + delay };
  }

  function flip(index: number) {
    if (paused || result || open.length === 2 || open.includes(index) || matched.includes(index) || timer.current) return;
    if (started.current === null) { markPlayed('memory'); started.current = clock.now(); }
    const next = [...open, index];
    setOpen(next);
    if (board[index] === null) {
      combo.current = 0;
      setNotice('Blank card. It cannot be matched.');
      setMoves(value => value + 1);
      schedule(() => { setOpen(open); timer.current = undefined; }, 700);
      return;
    }
    setNotice('Shape revealed. Find its pair.');
    if (next.length < 2) return;
    const totalMoves = moves + 1;
    setMoves(totalMoves);
    if (board[next[0]] === board[next[1]]) {
      schedule(() => {
        const pairs = [...matched, ...next];
        setMatched(pairs); setOpen([]);
        combo.current += 1;
        setNotice(`${getMatchPhrase(combo.current).announcement} ${combo.current > 1 ? `${combo.current} pairs in a row.` : 'Pair matched.'}`);
        setCelebration({ sequence: totalMoves, combo: combo.current });
        celebrationTimer.current = clock.now() + 1700;
        playSound('blessing', muted);
        timer.current = undefined;
        if (pairs.length === size * size - size % 2) {
          const elapsed = Math.floor((clock.now() - started.current!) / 1000);
          const completed = { seconds: elapsed, moves: totalMoves };
          started.current = null; setSeconds(elapsed); setResult(completed);
          setSaved(saveBest(key, completed));
        }
      }, 380);
    } else {
      combo.current = 0;
      setNotice('Different shapes. Try another pair.');
      schedule(() => { setOpen([]); timer.current = undefined; }, 850);
    }
  }

  useRoundShortcuts('memory', Boolean(result) && !paused, onRestart);
  return <>
    <div className="scoreboard"><span><strong>{seconds}s</strong> elapsed</span><span><strong>{moves}</strong> moves</span><span><strong>{matched.length / 2}/{Math.floor(size * size / 2)}</strong> pairs</span></div>
    <div className="memory-arena">
    <div className="memory-board" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }} aria-label={`${size} by ${size} memory board`}>
      {board.map((face, index) => {
        const isMatched = matched.includes(index);
        const visible = open.includes(index) || isMatched;
        const shape = face === null ? null : pack.id === 'prism' ? (face + 6) % SHAPE_NAMES.length : face;
        const label = face === null ? 'Blank card' : pack.url ? `Art symbol ${face + 1}` : SHAPE_NAMES[shape!];
        return <button key={index} className={`memory-card ${visible ? 'revealed' : ''} ${isMatched ? 'matched' : ''}`} aria-label={visible ? label : `Reveal card ${index + 1}`} disabled={paused || isMatched || Boolean(result)} onClick={() => flip(index)}>
          <span className="card-flip" aria-hidden="true">
            <span className="card-side card-back" style={{ backgroundSize: `${size * 100}% ${size * 100}%`, backgroundPosition: `${index % size / (size - 1) * 100}% ${Math.floor(index / size) / (size - 1) * 100}%` }}/>
            <span className="card-side card-front">
              {face !== null ? pack.url ? <span className="card-atlas-icon" style={{ backgroundImage: `url("${pack.url}")`, backgroundPosition: `${face % 6 / 5 * 100}% ${Math.floor(face / 6) / 2 * 100}%` }}/> : <AgentShape face={shape!} prism={pack.id === 'prism'}/> : <i className="blank-dot"/>}
              {isMatched && <i className="match-check"/>}
            </span>
          </span>
        </button>;
      })}
    </div>
    {celebration && <MatchCelebration sequence={celebration.sequence} combo={celebration.combo}/>}
    {result && <GameResultOverlay game="memory" summary={`Board cleared · ${result.seconds}s · ${result.moves} moves`} onReplay={onRestart} onNextBoard={onNext} delay={1200} paused={paused}/> }
    </div>
    <div className="memory-deck-meta">{pack.name}<i/>Astra poster edition</div>
    <p className="notice" aria-live="polite">{notice}</p>
    {result && <div className="result" role="status"><h2>You’re absolutely right!</h2><p>Cleared in {result.seconds}s · {result.moves} moves</p><div className="button-row">{onNext && <button className="primary" onClick={onNext}>Next board</button>}<GameRoundControls game="memory" onRestart={onRestart}/></div>{!saved && <p>Your browser could not save this score. You can still play.</p>}</div>}
    {best && <p className="muted">Previous best on this board: {best.seconds}s · {best.moves} moves</p>}
    <p className="muted">{mode === 'daily' ? 'Shared daily board · repeat attempts welcome.' : 'Free play · a fresh board each run.'} Scores stay on this device.</p>
    <KeyboardLegend shortcuts={result ? roundLegend : [
      { keys: ['Tab'], label: 'Next card or button' },
      { keys: ['Shift', 'Tab'], label: 'Previous' },
      { keys: ['Space', 'Enter'], separator: '/', label: 'Flip / select' },
    ]} note={result ? undefined : 'Use Tab to focus a card or button, then Space or Enter to select it.'} />
  </>;
}
