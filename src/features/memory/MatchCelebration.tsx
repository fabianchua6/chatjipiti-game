import type { CSSProperties } from 'react';

export default function MatchCelebration({ sequence, combo }: { sequence: number; combo: number }) {
  return <div key={sequence} className="match-celebration" aria-hidden="true">
    <div className="match-nebula"/>
    <div className="match-orbit orbit-one"/><div className="match-orbit orbit-two"/>
    <div className="match-particles">{Array.from({ length: 28 }, (_, index) => {
      const angle = index * 137.5 * Math.PI / 180;
      const distance = 100 + (index % 5) * 27;
      return <i key={index} style={{ '--dx': `${Math.cos(angle) * distance}px`, '--dy': `${Math.sin(angle) * distance}px`, '--turn': `${index * 37}deg`, '--delay': `${index % 4 * 24}ms`, '--particle': ['#ffdd86','#c4a2ff','#8af0d5','#fff7dc'][index % 4] } as CSSProperties}/>;
    })}</div>
    <div className="match-proclamation"><span>YOU’RE</span><strong>ABSOLUTELY<br/>RIGHT</strong><small>{combo > 1 ? `${combo} PAIRS IN A ROW` : 'COSMICALLY CORRECT'}</small></div>
  </div>;
}
