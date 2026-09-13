import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import { dailySeed } from '../../lib/game';
import { circleTarget, constrainCircle, scoreCircle } from '../../lib/challenges';
import type { Circle, CircleScore, GameMode } from '../../lib/challenges';
import { claimResetSafely, isScore, readRecord, writeRecord } from '../../lib/records';
import { playSound } from '../../lib/sound';
import Icon from '../../components/Icon';
import './circle.css';

type Phase = 'idle' | 'reveal' | 'draw' | 'result';
type Reward = 'earned' | 'claimed' | 'unavailable' | null;
export default function CircleGame({ mode, muted }: { mode: GameMode; muted: boolean }) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [seed, setSeed] = useState(() => mode === 'daily' ? dailySeed() : crypto.randomUUID());
  const [target, setTarget] = useState(() => circleTarget(seed));
  const [drawn, setDrawn] = useState<Circle | null>(null);
  const [score, setScore] = useState<CircleScore | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [reward, setReward] = useState<Reward>(null);
  const [saved, setSaved] = useState(true);
  const [hint, setHint] = useState('');
  const stage = useRef<SVGSVGElement>(null);
  const activePointer = useRef<number | null>(null);
  const stroke = useRef<Circle | null>(null);
  const submitted = useRef(false);
  const attempt = useRef(0);
  const recordKey = `circle:${mode}:${mode === 'daily' ? seed : 'all'}`;
  const best = readRecord(recordKey, isScore);

  useEffect(() => {
    if (phase !== 'reveal') return;
    const until = performance.now() + 3000;
    const timer = setInterval(() => {
      const remaining = Math.ceil((until - performance.now()) / 1000);
      setCountdown(Math.max(0, remaining));
      if (remaining <= 0) { setPhase('draw'); setHint('Your turn. Press where the centre was, then drag.'); clearInterval(timer); }
    }, 50);
    return () => clearInterval(timer);
  }, [phase]);

  function start() {
    attempt.current++;
    const nextSeed = mode === 'daily' ? dailySeed() : crypto.randomUUID();
    setSeed(nextSeed); setTarget(circleTarget(nextSeed));
    setDrawn(null); setScore(null); setReward(null); setSaved(true); setCountdown(3);
    activePointer.current = null; stroke.current = null; submitted.current = false;
    setHint('Look closely. Centre and size. Three seconds.'); setPhase('reveal');
    requestAnimationFrame(() => stage.current?.focus());
  }
  function position(event: PointerEvent<SVGSVGElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    return { x: Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width)), y: Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height)) };
  }
  function updatePointer(event: PointerEvent<SVGSVGElement>) {
    if (activePointer.current !== event.pointerId || !stroke.current || phase !== 'draw') return null;
    const point = position(event);
    const next = constrainCircle({ ...stroke.current, radius: Math.hypot(point.x - stroke.current.x, point.y - stroke.current.y) });
    stroke.current = next; setDrawn(next); return next;
  }
  function submit(circle: Circle) {
    if (submitted.current || phase !== 'draw') return;
    submitted.current = true;
    const result = scoreCircle(target, circle);
    setDrawn(circle); setScore(result); setPhase('result');
    if (best === null || result.total > best) setSaved(writeRecord(recordKey, result.total));
    if (result.total >= 95) {
      if (mode === 'daily') {
        const finishedAttempt = attempt.current;
        void claimResetSafely(seed).then(value => { if (finishedAttempt === attempt.current) setReward(value); });
      }
      playSound('blessing', muted);
    } else playSound('match', muted);
    setHint(result.total >= 95 ? 'A divine circle. Pope Tibo approves.' : 'Your circle is yellow. That’s a start.');
  }
  function cancel() {
    if (phase !== 'draw') return;
    activePointer.current = null; stroke.current = null; setDrawn(null);
    setHint('Stroke cancelled. Try again without lifting until you’re done.');
  }
  function keyboard(event: KeyboardEvent<SVGSVGElement>) {
    if (phase !== 'draw' || activePointer.current !== null) return;
    const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '=', '-', '_', 'Enter', 'Escape'];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Escape') { cancel(); return; }
    const current = stroke.current ?? { x: 0.5, y: 0.5, radius: 0.12 };
    if (event.key === 'Enter') { submit(current); return; }
    const step = event.shiftKey ? 0.002 : 0.01;
    const next = constrainCircle({ x: current.x + (event.key === 'ArrowRight' ? step : event.key === 'ArrowLeft' ? -step : 0), y: current.y + (event.key === 'ArrowDown' ? step : event.key === 'ArrowUp' ? -step : 0), radius: current.radius + (['+', '='].includes(event.key) ? step : ['-', '_'].includes(event.key) ? -step : 0) });
    stroke.current = next; setDrawn(next);
    setHint('Arrows move the centre. + / − change size. Enter submits.');
  }
  const blessed = score !== null && score.total >= 95;
  return <section className="game-surface circle-game">
    <div className="game-heading"><div><h1>Draw Me a Yellow Circle</h1><p>A tiny test of memory. A chance of divine intervention.</p></div><span className="game-glyph gold"><Icon name="circle"/></span></div>
    <div className="circle-layout">
      <div className="circle-play">
        <div className="circle-stage-label" aria-live="polite"><span>{phase === 'idle' ? 'A simple request' : phase === 'reveal' ? 'Remember this circle' : phase === 'draw' ? 'Now, draw it from memory' : 'The moment of truth'}</span>{phase === 'reveal' && <b>{countdown}</b>}</div>
        <div className={`circle-canvas ${blessed ? 'is-blessed' : ''}`}>
          <svg ref={stage} className="drawing-surface" viewBox="0 0 1000 1000" tabIndex={0} role="application" aria-label="Circle drawing area" aria-describedby="circle-keyboard" onKeyDown={keyboard} onPointerDown={event => {
            if (phase !== 'draw' || !event.isPrimary || event.button !== 0 || activePointer.current !== null) return;
            event.preventDefault(); event.currentTarget.focus();
            activePointer.current = event.pointerId; event.currentTarget.setPointerCapture(event.pointerId);
            stroke.current = { ...position(event), radius: 0 }; setDrawn(stroke.current);
          }} onPointerMove={updatePointer} onPointerUp={event => {
            if (activePointer.current !== event.pointerId) return;
            const final = updatePointer(event); activePointer.current = null;
            if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
            if (final) submit(final);
          }} onPointerCancel={cancel} onLostPointerCapture={() => { if (activePointer.current !== null) cancel(); }}>
            <defs><pattern id="dot-grid" width="50" height="50" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1.7" fill="#5b5744"/></pattern></defs>
            <rect width="1000" height="1000" fill="url(#dot-grid)"/>
            {phase === 'idle' && <g aria-hidden="true"><circle cx="500" cy="500" r="195" fill="none" stroke="#746940" strokeWidth="6" strokeDasharray="13 16"/><path d="M485 500h30m-15-15v30" stroke="#746940" strokeWidth="4"/></g>}
            {(phase === 'reveal' || phase === 'result') && <circle className="target-circle" cx={target.x * 1000} cy={target.y * 1000} r={target.radius * 1000} fill={phase === 'reveal' ? '#f8d55d20' : 'none'} stroke={phase === 'reveal' ? '#ffdb69' : '#f2eee3'} strokeWidth="7" strokeDasharray={phase === 'result' ? '15 12' : undefined}/>}
            {drawn && <g><circle className="drawn-circle" cx={drawn.x * 1000} cy={drawn.y * 1000} r={drawn.radius * 1000} fill="#ffd85115" stroke="#ffda63" strokeWidth="8"/><circle cx={drawn.x * 1000} cy={drawn.y * 1000} r="5" fill="#ffda63"/></g>}
          </svg>
        </div>
        {phase === 'result' && <div className="circle-legend"><span><i className="legend-line yellow-line"/> Your circle</span><span><i className="legend-line target-line"/> Target</span></div>}
        <p className="circle-hint" role="status">{hint || 'The target appears for 3 seconds. Then it’s all you.'}</p>
        {(phase === 'idle' || phase === 'result') && <button className="primary" onClick={start}>{phase === 'idle' ? 'Show me the circle' : 'Try another circle'}<Icon name={phase === 'idle' ? 'circle' : 'reset'}/></button>}
        <details className="keyboard-help"><summary>Keyboard controls</summary><p id="circle-keyboard">After the target disappears, focus the drawing area. Arrow keys move the centre; + and − resize. Hold Shift for finer steps. Enter submits. Escape cancels. On touch or mouse, press for the centre, drag for radius, then release.</p></details>
      </div>
      <aside className={`tibo-scene ${blessed ? 'blessed' : ''}`} aria-label={blessed ? 'Pope Tibo blessing your circle' : 'Tibo seated in a chair'}>
        <div className={`tibo-sprite ${blessed ? 'pope' : 'seated'}`} role="img" aria-label={blessed ? 'Pixel-art Pope Tibo with open arms' : 'Pixel-art Tibo wearing a hoodie and sitting in a chair'}/>
        <div className="tibo-dialogue"><span>{blessed ? 'Pope Tibo' : 'Tibo'}</span><p>{blessed ? '“May your context be long and your limits be reset.”' : '“Draw me a yellow circle.”'}</p></div>
        <p className="muted">95 points unlocks a blessing.</p>
      </aside>
    </div>
    {score && <div className={`result circle-result ${blessed ? 'divine-result' : ''}`} role="status"><div><h2>{blessed ? 'You have been blessed.' : score.total >= 75 ? 'Pretty close. Pretty yellow.' : 'A circle of possibility.'}</h2><div className="result-metrics"><span><strong>{score.total}<small>/100</small></strong> total</span><span><strong>{score.position}<small>/50</small></strong> position</span><span><strong>{score.size}<small>/50</small></strong> size</span></div></div>{blessed && <div className="reset-reward"><Icon name="spark"/><strong>{mode === 'practice' ? 'A practice blessing' : reward === null ? 'Banking your reset…' : reward === 'earned' ? '+1 BANKED ASTRA RESET' : reward === 'claimed' ? 'Today’s reset is already banked' : 'Reward could not be saved'}</strong><p>{mode === 'practice' ? 'Play the Daily Challenge to earn a simulated reset.' : reward === 'unavailable' ? 'Browser storage is unavailable. Your score still counts for this run.' : 'Demo reward only. Your real ChatGPT usage is unchanged.'}</p></div>}{!saved && <p className="inline-notice">Your browser could not save this score.</p>}</div>}
    <p className="personal-best">{best !== null ? <>Personal best: <b>{best}/100</b> · </> : null}{mode === 'daily' ? 'One simulated reset per UTC day. Repeat attempts welcome.' : 'Unlimited practice. No reset rewards in this mode.'}</p>
  </section>;
}
