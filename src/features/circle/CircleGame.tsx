import { useGameClock } from '../../lib/useGameClock';
import TiboBlessing from './TiboBlessing';
import { playCircleBlessing } from './blessingSound';
import { markPlayed } from '../../lib/playedToday';
import { useEffect, useRef, useState } from 'react';
import CircleResult from './CircleResult';
import type { PointerEvent } from 'react';
import { dailySeed } from '../../lib/game';
import { CIRCLE_BOARD_ASPECT, circleTarget, constrainCircle, scoreCircle } from '../../lib/challenges';
import type { Circle, CircleScore, GameMode } from '../../lib/challenges';
import { claimResetSafely, isScore, readRecord, writeRecord } from '../../lib/records';
import { playSound } from '../../lib/sound';
import Icon from '../../components/Icon';
import './circle.css';
import './circle-console.css';
import { useRoundShortcuts } from '../../components/GameRoundControls';
import { Keycap } from '../../components/KeyboardLegend';
import ArtworkSettings from '../studio/ArtworkSettings';
import { useArtLibrary } from '../../lib/appearance';
import type { CSSProperties } from 'react';

type Phase = 'idle' | 'reveal' | 'draw' | 'result';
type Reward = 'earned' | 'claimed' | 'unavailable' | null;
export default function CircleGame({ mode, muted, paused = false }: { mode: GameMode; muted: boolean; paused?: boolean }) {
  const clock = useGameClock(paused);
  const revealUntil = useRef(0);
  const { selected: world } = useArtLibrary('environment');
  const [phase, setPhase] = useState<Phase>('idle');
  const [seed, setSeed] = useState(() => mode === 'daily' ? dailySeed() : crypto.randomUUID());
  const [target, setTarget] = useState(() => circleTarget(undefined, CIRCLE_BOARD_ASPECT));
  const [drawn, setDrawn] = useState<Circle | null>(null);
  const [score, setScore] = useState<CircleScore | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [reward, setReward] = useState<Reward>(null);
  const [saved, setSaved] = useState(true);
  const [hint, setHint] = useState('');
  const stage = useRef<SVGSVGElement>(null);
  const surface = useRef<HTMLElement>(null);
  const startRef = useRef<() => void>(() => {});
  const activePointer = useRef<number | null>(null);
  const stroke = useRef<Circle | null>(null);
  const submitted = useRef(false);
  const attempt = useRef(0);
  const stopBlessing = useRef<() => void>(() => {});
  useEffect(() => () => stopBlessing.current(), []);
  useEffect(() => { if (muted || paused) stopBlessing.current(); }, [muted, paused]);
  useEffect(() => {
    if (!paused || activePointer.current === null) return;
    const pointer = activePointer.current;
    activePointer.current = null;
    if (stage.current?.hasPointerCapture(pointer)) stage.current.releasePointerCapture(pointer);
    stroke.current = null;
    setDrawn(null);
    setHint('Round resumed. Draw your circle when you’re ready.');
  }, [paused]);
  const recordKey = `circle:${mode}:${mode === 'daily' ? seed : 'all'}`;
  const best = readRecord(recordKey, isScore);

  useEffect(() => {
    if (phase !== 'reveal' || paused) return;
    const until = revealUntil.current;
    const timer = setInterval(() => {
      const remaining = Math.ceil((until - clock.now()) / 1000);
      setCountdown(Math.max(0, remaining));
      if (remaining <= 0) { setPhase('draw'); setHint('Press at the centre, drag to size, then release.'); clearInterval(timer); }
    }, 50);
    return () => clearInterval(timer);
  }, [phase, paused, clock]);

  function start() {
    if (paused) return;
    revealUntil.current = clock.now() + 3000;
    stopBlessing.current();
    markPlayed('circle');
    attempt.current++;
    const nextSeed = mode === 'daily' ? dailySeed() : crypto.randomUUID();
    // Keep daily records tied to the date; give every attempt a fresh target.
    setSeed(nextSeed); setTarget(circleTarget(undefined, CIRCLE_BOARD_ASPECT));
    setDrawn(null); setScore(null); setReward(null); setSaved(true); setCountdown(3);
    activePointer.current = null; stroke.current = null; submitted.current = false;
    setHint('Look closely. Centre and size. Three seconds.'); setPhase('reveal');
    requestAnimationFrame(() => stage.current?.focus());
  }
  useEffect(() => { startRef.current = start; });
  useEffect(() => {
    if (phase !== 'idle' || paused) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.defaultPrevented || event.repeat || event.isComposing || event.metaKey || event.ctrlKey || event.altKey || (event.code !== 'Space' && event.key !== ' ')) return;
      const target = event.target;
      if (target instanceof Element) {
        if (target.closest('input, textarea, select, button, a, [contenteditable="true"], [role="button"], dialog, [role="dialog"]')) return;
        if (!surface.current?.contains(target) && target !== document.body && !target.matches('main')) return;
      }
      event.preventDefault();
      startRef.current();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [phase, paused]);
  function position(event: PointerEvent<SVGSVGElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    return { x: Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width)), y: Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height)) };
  }
  function updatePointer(event: PointerEvent<SVGSVGElement>) {
    if (activePointer.current !== event.pointerId || !stroke.current || paused || phase !== 'draw') return null;
    const point = position(event);
    const next = constrainCircle({ ...stroke.current, radius: Math.hypot((point.x - stroke.current.x) * CIRCLE_BOARD_ASPECT, point.y - stroke.current.y) }, CIRCLE_BOARD_ASPECT);
    stroke.current = next; setDrawn(next); return next;
  }
  function submit(circle: Circle) {
    if (submitted.current || paused || phase !== 'draw') return;
    submitted.current = true;
    const result = scoreCircle(target, circle, CIRCLE_BOARD_ASPECT);
    setDrawn(circle); setScore(result); setPhase('result');
    if (best === null || result.total > best) setSaved(writeRecord(recordKey, result.total));
    if (result.total >= 95) {
      if (mode === 'daily') {
        const finishedAttempt = attempt.current;
        void claimResetSafely(seed).then(value => { if (finishedAttempt === attempt.current) setReward(value); });
      }
      stopBlessing.current();
      stopBlessing.current = playCircleBlessing(muted);
    } else playSound('match', muted);
    setHint(result.total >= 95 ? 'Hallelujah! Pope Tibo approves.' : 'Your circle is yellow. That’s a start.');
  }
  function cancel() {
    if (phase !== 'draw') return;
    activePointer.current = null; stroke.current = null; setDrawn(null);
    setHint('Stroke cancelled. Try again without lifting until you’re done.');
  }
  useRoundShortcuts('circle', Boolean(score) && !paused, start);
  const blessed = score !== null && score.total >= 95;
  return <section ref={surface} className="game-surface circle-game">
    <div className="game-heading"><div><h1>Draw Me a Yellow Circle</h1><p>A tiny test of memory. A chance of divine intervention.</p></div><span className="game-glyph gold"><Icon name="circle"/></span></div>
    <ArtworkSettings kind="environment" disabled={phase === 'reveal' || phase === 'draw'}/>
    <div className="circle-layout">
      <div className="circle-play">
        <div className="circle-stage-label" aria-live="polite"><span>{phase === 'idle' ? 'A simple request' : phase === 'reveal' ? 'Remember this circle' : phase === 'draw' ? 'Now, draw it from memory' : 'The moment of truth'}</span>{phase === 'reveal' && <b>{countdown}</b>}</div>
        <div className={`retro-room ${blessed ? 'blessed' : ''}`} style={{ '--environment-image': `url("${world.url}")` } as CSSProperties} role="group" aria-label={`${world.name}, with a seated man, briefcase and a large screen`}>
        <div className={`circle-canvas ${blessed ? 'is-blessed' : ''}`}>
          <svg ref={stage} className="drawing-surface" viewBox={`0 0 ${1000 * CIRCLE_BOARD_ASPECT} 1000`} tabIndex={-1} role="img" aria-label="Circle drawing area" aria-describedby={score ? 'circle-result-summary' : 'circle-instructions'} onPointerDown={event => {
            if (paused || phase !== 'draw' || !event.isPrimary || event.button !== 0 || activePointer.current !== null) return;
            event.preventDefault(); event.currentTarget.focus();
            activePointer.current = event.pointerId; event.currentTarget.setPointerCapture(event.pointerId);
            stroke.current = { ...position(event), radius: 0 }; setDrawn(stroke.current);
          }} onPointerMove={updatePointer} onPointerUp={event => {
            if (activePointer.current !== event.pointerId) return;
            const final = updatePointer(event); activePointer.current = null;
            if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
            if (final) submit(final);
          }} onPointerCancel={cancel} onLostPointerCapture={() => { if (activePointer.current !== null) cancel(); }}>
            {(phase === 'reveal' || phase === 'result') && <circle className="target-circle" cx={target.x * 1000 * CIRCLE_BOARD_ASPECT} cy={target.y * 1000} r={target.radius * 1000} fill={phase === 'reveal' ? '#f8d55d20' : 'none'} stroke={phase === 'reveal' ? '#ffdb69' : '#f2eee3'} strokeWidth="7" strokeDasharray={phase === 'result' ? '15 12' : undefined}/>}
            {drawn && <g><circle className="drawn-circle" cx={drawn.x * 1000 * CIRCLE_BOARD_ASPECT} cy={drawn.y * 1000} r={drawn.radius * 1000} fill="#ffd85115" stroke="#ffda63" strokeWidth="8"/><circle cx={drawn.x * 1000 * CIRCLE_BOARD_ASPECT} cy={drawn.y * 1000} r="5" fill="#ffda63"/></g>}
          </svg>
        </div>
        {blessed && <TiboBlessing paused={paused}/>}
        </div>
        <div className="circle-console" role="group" aria-label={score ? 'Round result and actions' : 'Tibo’s instructions and game controls'}>
          {score ? <CircleResult score={score} best={best} mode={mode} reward={reward} saved={saved} onRestart={start}/> : <>
            {phase === 'idle' && <div className="tibo-dialogue"><span>TIBO</span><p>“Draw me a yellow circle.”</p></div>}
            <p id="circle-instructions" className="circle-hint" role="status">{phase === 'idle' ? 'Memorise the circle. You have 3 seconds.' : phase === 'reveal' ? 'Remember its centre and size.' : hint}</p>
            {phase === 'idle' && <button className="primary" onClick={start}>Show me the circle <Keycap>Space</Keycap></button>}
            {best !== null && phase === 'idle' && <p className="circle-console-best">Personal best <strong>{best}<small>/100</small></strong></p>}
          </>}
          {score && <div className="circle-legend"><span><i className="legend-line yellow-line"/> Your circle</span><span><i className="legend-line target-line"/> Target</span></div>}
          {mode === 'practice' && <p className="circle-console-rule">Practice round</p>}
        </div>
      </div>

    </div>
  </section>;
}
