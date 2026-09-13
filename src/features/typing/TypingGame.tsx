import { markPlayed } from '../../lib/playedToday';
import { useEffect, useRef, useState } from 'react';
import GameResultOverlay from '../../components/GameResultOverlay';
import { dailySeed } from '../../lib/game';
import { compareTyping, typingMetrics, typingPassage } from '../../lib/challenges';
import type { GameMode } from '../../lib/challenges';
import { isTypingRecord, readRecord, saveTypingRecord } from '../../lib/records';
import { playSound } from '../../lib/sound';
import Icon from '../../components/Icon';
import './typing.css';
import GameRoundControls, { roundLegend, useRoundShortcuts } from '../../components/GameRoundControls';
import KeyboardLegend, { Keycap } from '../../components/KeyboardLegend';

type Phase = 'idle' | 'armed' | 'running' | 'finished';
type Result = ReturnType<typeof typingMetrics> & { seconds: number; reason: string; expected: string | null; received: string | null };
type TypingGameProps = { mode: GameMode; muted: boolean; paused?: boolean };

export default function TypingGame({ mode, muted, paused = false }: TypingGameProps) {
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
  const surface = useRef<HTMLElement>(null);
  const startShortcutHeld = useRef(false);
  const startRef = useRef<() => void>(() => {});
  const prefix = useRef('');
  const started = useRef<number | null>(null);
  const finished = useRef(false);
  const composing = useRef(false);
  const finishRef = useRef<(reason: string) => void>(() => {});
  const pausedRef = useRef(paused);
  const pausedAt = useRef<number | null>(null);
  const pausedTotal = useRef(0);
  const limit = 30;
  const recordKey = `typing:short:${mode}:${mode === 'daily' ? seed : 'all'}`;
  const best = readRecord(recordKey, isTypingRecord);

  function currentElapsed(now = performance.now()) {
    if (started.current === null) return 0;
    const pausedDuration = pausedAt.current === null ? 0 : now - pausedAt.current;
    return Math.min(limit * 1000, Math.max(0, now - started.current - pausedTotal.current - pausedDuration));
  }

  function finish(reason: string, expected: string | null = null, received: string | null = null) {
    if (finished.current) return;
    finished.current = true;
    const duration = started.current === null ? 0 : currentElapsed();
    const metrics = typingMetrics(prefix.current, duration, prefix.current.length === passage.length);
    setResult({ ...metrics, seconds: Math.round(duration / 100) / 10, reason, expected, received });
    setElapsed(duration); setPhase('finished');
    setSaved(metrics.correct > 0 ? saveTypingRecord(recordKey, metrics) : true);
    if (received !== null) playSound('fail', muted);
  }
  useEffect(() => { finishRef.current = finish; startRef.current = start; });
  useEffect(() => {
    const tick = setInterval(() => {
      if (started.current !== null && !finished.current) {
        if (pausedRef.current) return;
        const time = currentElapsed();
        setElapsed(Math.min(limit * 1000, time));
        if (time >= limit * 1000) finishRef.current('Time’s up. Clean run.');
      }
    }, 100);
    return () => { clearInterval(tick); };
  }, [limit]);

  useEffect(() => {
    const wasPaused = pausedRef.current;
    if (wasPaused === paused) return;
    pausedRef.current = paused;
    if (paused) {
      if (started.current !== null && !finished.current) {
        const frozen = currentElapsed();
        setElapsed(frozen);
        pausedAt.current = performance.now();
      }
      return;
    }
    if (pausedAt.current !== null) {
      pausedTotal.current += performance.now() - pausedAt.current;
      pausedAt.current = null;
    }
    if (started.current !== null && !finished.current) {
      const resumed = currentElapsed();
      setElapsed(resumed);
      if (resumed >= limit * 1000) finishRef.current('Time’s up. Clean run.');
      requestAnimationFrame(() => input.current?.focus());
    } else if (phase === 'armed') {
      requestAnimationFrame(() => input.current?.focus());
    }
  }, [paused, limit, phase]);

  function start() {
    if (pausedRef.current) return;
    const nextSeed = mode === 'daily' ? dailySeed() : crypto.randomUUID();
    setSeed(nextSeed); setPassage(typingPassage(nextSeed));
    prefix.current = ''; started.current = null; pausedAt.current = null; pausedTotal.current = 0; finished.current = false; composing.current = false;
    setDraft(''); setCorrect(0); setElapsed(0); setResult(null); setHint(''); setSaved(true); setPhase('armed');
    requestAnimationFrame(() => input.current?.focus());
  }
  function accept(next: string) {
    if (pausedRef.current || finished.current || phase === 'idle' || phase === 'finished') return;
    if (started.current !== null && currentElapsed() >= limit * 1000) { finish('Time’s up. Clean run.'); return; }
    if (next === prefix.current) return;
    if (started.current === null) {
      markPlayed('typing');
      started.current = performance.now(); setPhase('running');
    }
    const outcome = compareTyping(prefix.current, next, passage);
    prefix.current = passage.slice(0, outcome.correct); setCorrect(outcome.correct); setDraft(prefix.current);
    if (outcome.mistake !== null) { finish('One mistake. That’s the game.', outcome.expected, outcome.mistake); return; }
    if (outcome.correct === passage.length) finish('You typed the entire challenge. Unreal.');
  }
  const remaining = Math.max(0, limit - Math.floor(elapsed / 1000));
  const active = phase === 'armed' || phase === 'running';
  useEffect(() => {
    const isSpace = (event: globalThis.KeyboardEvent) => event.code === 'Space' || event.key === ' ';
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (paused || event.defaultPrevented || event.isComposing) return;
      const target = event.target;
      if (target instanceof HTMLElement && target !== input.current) {
        if (target.closest('input, textarea, select, button, a, [contenteditable="true"], [role="button"], [role="dialog"]')) return;
        if (!surface.current?.contains(target) && target !== document.body && !target.matches('main')) return;
      }
      if (isSpace(event) && startShortcutHeld.current) { event.preventDefault(); return; }
      if (event.repeat) return;
      if (isSpace(event) && phase === 'idle' && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault(); startShortcutHeld.current = true; startRef.current();
      } else if (event.key === 'Enter' && (event.metaKey || event.ctrlKey) && phase === 'running') {
        event.preventDefault(); finishRef.current('Run banked. Nicely done.');
      }
    };
    const onKeyUp = (event: globalThis.KeyboardEvent) => { if (isSpace(event)) startShortcutHeld.current = false; };
    const onBlur = () => { startShortcutHeld.current = false; };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    return () => { window.removeEventListener('keydown', onKeyDown); window.removeEventListener('keyup', onKeyUp); window.removeEventListener('blur', onBlur); };
  }, [active, phase, paused]);
  useRoundShortcuts('typing', Boolean(result) && !paused, () => {
    startShortcutHeld.current = true;
    start();
  });
  const metrics = typingMetrics(passage.slice(0, correct), elapsed, correct === passage.length);
  const lookBehind = Math.max(0, correct - 18);
  return <section ref={surface} className="game-surface typing-game">
    <div className="game-heading"><div><h1>Make No Mistakes</h1><p>One wrong character. Game over. You’ve been warned.</p></div><span className="game-glyph coral"><Icon name="type"/></span></div>
    {best && <p className="personal-best">Personal best: <b>{best.correct} characters</b> · {best.wpm} WPM</p>}
    <div className="scoreboard"><span><strong>{remaining}s</strong> left</span><span><strong>{correct}</strong> characters</span><span><strong>{metrics.wpm}</strong> WPM</span></div>
    <div className={`typing-stage ${result && result.received !== null ? 'has-mistake' : ''}`}>
      <div className="typing-inline">
      <div className="typing-passage" aria-hidden="true"><span className="typed">{passage.slice(lookBehind, correct)}</span><mark className={result?.received ? 'fatal-character' : ''}>{passage[correct] ?? ' '}</mark><span>{passage.slice(correct + 1, correct + 240)}</span></div>
      <p className="sr-only" id="typing-prompt">Type exactly: {passage.slice(correct, correct + 240)}</p>
      <label htmlFor="typing-input" className="sr-only">Type the passage</label>
      <textarea ref={input} id="typing-input" onClick={event => { const field = event.currentTarget; field.setSelectionRange(field.value.length, field.value.length); }} rows={2} disabled={!active || paused} value={draft} onChange={event => { setDraft(event.target.value); if (!composing.current) accept(event.target.value); }} onCompositionStart={() => { composing.current = true; }} onCompositionEnd={event => { composing.current = false; accept(event.currentTarget.value); }} onPaste={event => { event.preventDefault(); setHint('No pasting. This one is all you.'); }} onDrop={event => event.preventDefault()} spellCheck={false} autoCorrect="off" autoComplete="off" autoCapitalize="none" inputMode="text" aria-describedby="typing-prompt typing-shortcuts" />
      </div>
      <div className="typing-status"><span aria-hidden="true">{active && !paused ? ">" : "·"}</span> {paused ? 'PAUSED · RESUME TO PLAY' : phase === 'armed' ? 'TYPE TO BEGIN' : phase === 'running' ? 'KEEP GOING_' : phase === 'finished' ? 'SPACE TO TRY AGAIN' : 'SPACE TO START'}</div>
      {result && <GameResultOverlay game="typing" summary={`${result.correct} characters · ${result.wpm} WPM`} onReplay={start}/> }
    </div>
    {hint && <p role="status" className="inline-notice">{hint}</p>}
    {!active && !result && <button className="primary game-start" disabled={paused} onClick={start}>Start typing <Keycap>Space</Keycap></button>}
    {active && <button className="secondary game-start" disabled={paused || phase === 'armed'} onClick={() => finish('Run banked. Nicely done.')}>Finish run <Keycap>⌘ / Ctrl + Enter</Keycap></button>}
    {result && <div className={`result ${result.received ? 'failure' : ''}`} role="status"><h2>{result.reason}</h2><div className="result-metrics"><span><strong>{result.correct}</strong> correct characters</span><span><strong>{result.words}</strong> completed words</span><span><strong>{result.wpm}</strong> WPM</span></div><p className="muted">{result.seconds}s played · {saved ? 'Best score saved on this device.' : 'Browser storage is unavailable; this result was not saved.'}</p><div className="button-row"><GameRoundControls game="typing" onRestart={start}/></div></div>}
    <KeyboardLegend id="typing-shortcuts" shortcuts={result ? roundLegend : active ? [
      { keys: ['⌘ / Ctrl', 'Enter'], label: 'Finish run' },
    ] : [{ keys: ['Space'], label: 'Start typing' }]} note={phase === 'armed' ? 'Start typing to begin your run.' : undefined} />
  </section>;
}
