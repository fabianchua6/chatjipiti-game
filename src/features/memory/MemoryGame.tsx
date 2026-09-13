import { useEffect, useRef, useState } from 'react';
import { BOARD_SIZES, dailySeed, makeBoard, readBest, saveBest } from '../../lib/game';
import type { BoardSize, MemoryResult } from '../../lib/game';

const AGENTS = ['Researcher', 'Coder', 'Writer', 'Designer', 'Planner', 'Analyst', 'Explorer', 'Teacher', 'Editor', 'Builder', 'Thinker', 'Debugger', 'Translator', 'Architect', 'Scientist', 'Composer', 'Navigator', 'Reviewer'];
const COLORS = ['#c7a9ff', '#8dddce', '#f6d772', '#ffb097', '#a9cafa', '#eaaaec'];
type Props = { mode: 'daily' | 'practice' };

export default function MemoryGame({ mode }: Props) {
  const [level, setLevel] = useState(0);
  const size = BOARD_SIZES[level];
  const [attempt, setAttempt] = useState(0);
  const [seed, setSeed] = useState(() => mode === 'daily' ? dailySeed() : crypto.randomUUID());
  function nextLevel() { setLevel(value => value + 1); }
  function restart() {
    setLevel(0); setAttempt(value => value + 1);
    setSeed(mode === 'daily' ? dailySeed() : crypto.randomUUID());
  }
  return <section className="game-surface">
    <div className="game-heading"><div><h1>You’re Absolutely Right!</h1><p>Match every pair. The blank card is a little unhelpful.</p></div><span className="badge">{size} × {size}</span></div>
    <MemoryBoard key={`${level}-${attempt}-${seed}`} size={size} seed={`${seed}:${size}`} mode={mode} onNext={level < 3 ? nextLevel : undefined} onRestart={restart} />
  </section>;
}

function MemoryBoard({ size, seed, mode, onNext, onRestart }: { size: BoardSize; seed: string; mode: Props['mode']; onNext?: () => void; onRestart: () => void }) {
  const [board] = useState(() => makeBoard(size, seed));
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [result, setResult] = useState<MemoryResult | null>(null);
  const [saved, setSaved] = useState(true);
  const [notice, setNotice] = useState('Choose a card to start.');
  const started = useRef<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const key = `chatjipiti:v1:memory:${mode}:${mode === 'daily' ? seed : size}`;
  const [best] = useState(() => readBest(key));
  useEffect(() => {
    const interval = setInterval(() => {
      if (started.current !== null) setSeconds(Math.floor((performance.now() - started.current) / 1000));
    }, 250);
    return () => { clearInterval(interval); clearTimeout(timer.current); };
  }, []);

  function flip(index: number) {
    if (result || open.length === 2 || open.includes(index) || matched.includes(index) || timer.current) return;
    if (started.current === null) started.current = performance.now();
    const next = [...open, index];
    setOpen(next);
    if (board[index] === null) {
      setNotice('Blank card. It cannot be matched.');
      setMoves(value => value + 1);
      timer.current = setTimeout(() => { setOpen(open); timer.current = undefined; }, 700);
      return;
    }
    setNotice(`${AGENTS[board[index]!]} revealed.`);
    if (next.length < 2) return;
    const totalMoves = moves + 1;
    setMoves(totalMoves);
    if (board[next[0]] === board[next[1]]) {
      const pairs = [...matched, ...next];
      setMatched(pairs); setOpen([]); setNotice('You’re absolutely right! Pair matched.');
      if (pairs.length === size * size - size % 2) {
        const elapsed = Math.floor((performance.now() - started.current) / 1000);
        const completed = { seconds: elapsed, moves: totalMoves };
        started.current = null; setSeconds(elapsed); setResult(completed);
        setSaved(saveBest(key, completed));
      }
    } else {
      setNotice('Different agents. Try another pair.');
      timer.current = setTimeout(() => { setOpen([]); timer.current = undefined; }, 850);
    }
  }

  return <>
    <div className="scoreboard"><span><strong>{seconds}s</strong> elapsed</span><span><strong>{moves}</strong> moves</span><span><strong>{matched.length / 2}/{Math.floor(size * size / 2)}</strong> pairs</span></div>
    <div className="memory-board" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }} aria-label={`${size} by ${size} memory board`}>
      {board.map((face, index) => {
        const visible = open.includes(index) || matched.includes(index);
        return <button key={index} className={`memory-card ${visible ? 'revealed' : ''} ${matched.includes(index) ? 'matched' : ''}`} aria-label={visible ? (face === null ? 'Blank card' : AGENTS[face]) : `Reveal card ${index + 1}`} disabled={matched.includes(index) || Boolean(result)} onClick={() => flip(index)} style={visible ? { background: face === null ? '#28302b' : COLORS[face % COLORS.length] } : { backgroundSize: `${size * 100}% ${size * 100}%`, backgroundPosition: `${index % size / (size - 1) * 100}% ${Math.floor(index / size) / (size - 1) * 100}%` }}>
          {visible && face !== null && <><svg viewBox="0 0 40 40" aria-hidden="true"><rect x="6" y="9" width="28" height="24" rx={face % 3 * 4} fill="none" stroke="currentColor" strokeWidth="3"/><path d={`M13 18h4m6 0h4M14 ${25 + face % 2}h12M20 3v6`} stroke="currentColor" strokeWidth="3"/></svg><span>{AGENTS[face]}</span></>}
        </button>;
      })}
    </div>
    <p className="notice" aria-live="polite">{notice}</p>
    {result && <div className="result" role="status"><h2>You’re absolutely right!</h2><p>Cleared in {result.seconds}s · {result.moves} moves</p><div className="button-row">{onNext && <button onClick={onNext}>Next board</button>}<button className="secondary" onClick={onRestart}>Play again</button></div>{!saved && <p>Your browser could not save this score. You can still play.</p>}</div>}
    {best && <p className="muted">Previous best on this board: {best.seconds}s · {best.moves} moves</p>}
    <p className="muted">{mode === 'daily' ? 'Shared daily board · repeatable while we build ranked attempts.' : 'Free play · a fresh board each run.'} Scores stay on this device.</p>
  </>;
}
