import type { CSSProperties } from 'react';
import './tibo-blessing.css';

const tokens = Array.from({ length: 42 }, (_, index) => ({
  id: index,
  left: `${(index * 37 + 7) % 100}%`,
  delay: `${0.45 + index % 14 * 0.12}s`,
  duration: `${2.2 + index % 5 * 0.18}s`,
  drift: `${(index % 7 - 3) * 16}px`,
  spin: `${index % 2 ? 540 : -540}deg`,
  size: `${19 + index % 4 * 5}px`,
}));

function TokenMark() {
  return <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
    {[0, 60, 120, 180, 240, 300].map(angle => <path key={angle} transform={`rotate(${angle} 32 32)`} d="M32 10C41 5 51 11 51 21V34L40 40V23L29 17" stroke="currentColor" strokeWidth="4.1" strokeLinejoin="round" strokeLinecap="round"/>)}
  </svg>;
}

export default function TiboBlessing({ paused = false }: { paused?: boolean }) {
  return <div className="tibo-blessing" data-paused={paused || undefined} aria-hidden="true">
    <div className="blessing-light"/>
    <div className="blessing-arrival"><div className="blessing-pope"/></div>
    <div className="blessing-token-rain">{tokens.map(token => <span key={token.id} className="blessing-token" style={{
      left: token.left, '--token-delay': token.delay, '--token-duration': token.duration,
      '--token-drift': token.drift, '--token-spin': token.spin, '--token-size': token.size,
    } as CSSProperties}><span><TokenMark/></span></span>)}</div>
    <div className="blessing-proclamation"><span>HALLELUJAH!</span><strong>CODEX RESET<br/>BLESSED</strong><span>+1 DEMO RESET</span></div>
  </div>;
}
