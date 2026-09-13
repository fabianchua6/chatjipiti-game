import { useEffect, useRef, useState } from 'react';
import { dailySeed } from '../../lib/game';
import { compareTyping, typingMetrics, typingPassage } from '../../lib/challenges';
import type { GameMode } from '../../lib/challenges';
import { isTypingRecord, readRecord, saveTypingRecord } from '../../lib/records';
import { playSound } from '../../lib/sound';
import Icon from '../../components/Icon';
import './typing.css';

type Phase = 'idle' | 'armed' | 'running' | 'finished';
type Result = ReturnType<typeof typingMetrics> & { seconds: number; reason: string; expected: string | null; received: string | null };
const printable = (character: string | null) => character === ' ' ? 'a space' : character === '\n' ? 'a line break' : character;

export default function TypingGame({ mode, muted }: { mode: GameMode; muted: boolean }) {
  const [seed, setSeed] = useState(() => mode === 'daily' ? dailySeed() : crypto.randomUUID());
  const [passage, setPassage] = useState(() => typingPassage(seed));
  const [phase, setPhase] = useState<Phase>('idle');
  const [draft, setDraft] = useState('');
  const [correct, setCorrect] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [hint, setHint] = useState('');
  const [saved, setSaved] = useState(true);
  const input = useRef<HTMLTextAreaElement>(null);
  const prefix = useRef('');
  const started = useRef<number | null>(null);
  const finished = useRef(false);
  const composing = useRef(false);
  const deadline = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const finishRef = useRef<(reason: string) => void>(() => {});
  const limit = mode === 'daily' ? 60 : 300;
  const recordKey = `typing:${mode}:${mode === 'daily' ? seed : 'all'}`;
  const best = readRecord(recordKey, isTypingRecord);

  function finish(reason: string, expected: string | null = null, received: string | null = null) {
    if (finished.current) return;
    finished.current = true;
    clearTimeout(deadline.current);
    const duration = started.current === null ? 0 : Math.min(limit * 1000, performance.now() - started.current);
    const metrics = typingMetrics(prefix.current, duration);
    setResult({ ...metrics, seconds: Math.round(duration / 100) / 10, reason, expected, received });
    setElapsed(duration); setPhase('finished');
    setSaved(metrics.correct > 0 ? saveTypingRecord(recordKey, metrics) : true);
    if (received !== null) playSound('fail', muted);
  }
  useEffect(() => { finishRef.current = finish; });
  useEffect(() => {
    const tick = setInterval(() => {
      if (started.current !== null && !finished.current) {
        const time = performance.now() - started.current;
        setElapsed(Math.min(limit * 1000, time));
        if (time >= limit * 1000) finishRef.current('Time’s up. Clean run.');
      }
    }, 100);
    return () => { clearInterval(tick); clearTimeout(deadline.current); };
  }, [limit]);

  function start() {
    clearTimeout(deadline.current);
    const nextSeed = mode === 'daily' ? dailySeed() : crypto.randomUUID();
    setSeed(nextSeed); setPassage(typingPassage(nextSeed));
    prefix.current = ''; started.current = null; finished.current = false; composing.current = false;
    setDraft(''); setCorrect(0); setElapsed(0); setResult(null); setHint(''); setSaved(true); setPhase('armed');
    requestAnimationFrame(() => input.current?.focus());
  }
  function accept(next: string) {
    if (finished.current || phase === 'idle' || phase === 'finished') return;
    if (started.current !== null && performance.now() - started.current >= limit * 1000) { finish('Time’s up. Clean run.'); return; }
    if (next === prefix.current) return;
    if (started.current === null) {
      started.current = performance.now(); setPhase('running');
      deadline.current = setTimeout(() => finishRef.current('Time’s up. Clean run.'), limit * 1000);
    }
    const outcome = compareTyping(prefix.current, next, passage);
    prefix.current = passage.slice(0, outcome.correct); setCorrect(outcome.correct); setDraft(prefix.current);
    if (outcome.mistake !== null) { finish('One mistake. That’s the game.', outcome.expected, outcome.mistake); return; }
    if (outcome.correct === passage.length) finish('You typed the entire challenge. Unreal.');
  }
  const remaining = Math.max(0, limit - Math.floor(elapsed / 1000));
  const active = phase === 'armed' || phase === 'running';
  const metrics = typingMetrics(passage.slice(0, correct), elapsed);
  const lookBehind = Math.max(0, correct - 42);
  return <section className="game-surface typing-game">
    <div className="game-heading"><div><h1>Make No Mistakes</h1><p>One wrong character. Game over. You’ve been warned.</p></div><span className="game-glyph coral"><Icon name="type"/></span></div>
    <div className="scoreboard"><span><strong>{remaining}s</strong> left</span><span><strong>{correct}</strong> characters</span><span><strong>{metrics.wpm}</strong> WPM</span></div>
    <div className={`typing-stage ${result && result.received !== null ? 'has-mistake' : ''}`}>
      <div className="typing-passage" aria-hidden="true"><span className="typed">{passage.slice(lookBehind, correct)}</span><mark className={result?.received ? 'fatal-character' : ''}>{passage[correct] ?? ' '}</mark><span>{passage.slice(correct + 1, correct + 240)}</span></div>
      <p className="sr-only" id="typing-prompt">Type exactly: {passage.slice(correct, correct + 240)}</p>
      <label htmlFor="typing-input" className="typing-label">{phase === 'armed' ? 'Ready. Your first character starts the clock.' : phase === 'running' ? 'Keep going. No backspaces.' : 'Type the passage exactly as shown.'}</label>
      <textarea ref={input} id="typing-input" rows={2} disabled={!active} value={draft} onChange={event => { setDraft(event.target.value); if (!composing.current) accept(event.target.value); }} onCompositionStart={() => { composing.current = true; }} onCompositionEnd={event => { composing.current = false; accept(event.currentTarget.value); }} onPaste={event => { event.preventDefault(); setHint('No pasting. This one is all you.'); }} onDrop={event => event.preventDefault()} spellCheck={false} autoCorrect="off" autoComplete="off" autoCapitalize="none" inputMode="text" aria-describedby="typing-prompt typing-rules" placeholder={active ? 'Start typing here…' : 'Start a run to type…'} />
    </div>
    <p id="typing-rules" className="muted">{mode === 'daily' ? 'Same daily text for everyone · 60 seconds.' : 'Fresh text each run · up to 5 minutes.'} Letters, spaces and punctuation all count. Edits end the run.</p>
    {hint && <p role="status" className="inline-notice">{hint}</p>}
    {!active && !result && <button className="primary game-start" onClick={start}>Start typing <Icon name="chevron"/></button>}
    {active && <button className="secondary game-start" disabled={phase === 'armed'} onClick={() => finish('Run banked. Nicely done.')}>Finish run</button>}
    {result && <div className={`result ${result.received ? 'failure' : ''}`} role="status"><h2>{result.reason}</h2><div className="result-metrics"><span><strong>{result.correct}</strong> correct characters</span><span><strong>{result.words}</strong> completed words</span><span><strong>{result.wpm}</strong> WPM</span></div>{result.received !== null && <p>Expected <b>{printable(result.expected)}</b>, got <b>{printable(result.received)}</b>.</p>}<p className="muted">{result.seconds}s played · {saved ? 'Best score saved on this device.' : 'Browser storage is unavailable; this result was not saved.'}</p><button className="primary" onClick={start}>Another run <Icon name="reset"/></button></div>}
    {best && <p className="personal-best">Personal best: <b>{best.correct} characters</b> · {best.wpm} WPM</p>}
  </section>;
}
