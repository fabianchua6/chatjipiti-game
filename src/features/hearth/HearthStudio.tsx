import { useEffect, useRef, useState } from 'react';
import Icon from '../../components/Icon';
import './hearth.css';

const HEARTH_URL = 'https://hearth-agent-office.rachiketarya.chatgpt.site/';

export function HearthMark() {
  return <svg className="icon hearth-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13 3c1 5-4 6-2 10 1-1 2-3 2-4 4 3 6 5 6 8a7 7 0 0 1-14 0c0-4 3-6 3-9 1 1 2 2 2 3 0-3 3-5 3-8Z"/></svg>;
}

const teammates = [
  { name: 'Maya', role: 'Product', color: '#d6a982', x: 100, y: 115 },
  { name: 'Luna', role: 'Design', color: '#b7a0ca', x: 260, y: 115 },
  { name: 'Theo', role: 'Backend', color: '#92b3bd', x: 100, y: 255 },
  { name: 'Finn', role: 'Frontend', color: '#a8b78d', x: 260, y: 255 },
  { name: 'Iris', role: 'QA', color: '#d2b66e', x: 535, y: 115 },
  { name: 'Alex', role: 'Engineering', color: '#c69291', x: 535, y: 255 },
];

function OfficePreview() {
  return <div className="hearth-preview">
    <div className="hearth-preview-copy"><span>Studio preview</span><h2>A place to build together.</h2><p>Bring your team into a shared office. Give your agents a mission and make your next game or mini app.</p></div>
    <svg className="hearth-office" viewBox="0 0 690 355" role="img" aria-label="An engineering office with six agent desks and a shared meeting table">
      <defs><pattern id="hearth-floor" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#3d3d38" strokeWidth=".7"/></pattern></defs>
      <rect x="5" y="5" width="680" height="345" rx="14" fill="#2d302d" stroke="#50564b"/>
      <rect x="6" y="6" width="678" height="343" rx="14" fill="url(#hearth-floor)"/>
      <path d="M371 5v124m0 101v120" stroke="#606456" strokeWidth="8"/>
      <rect x="348" y="156" width="116" height="57" rx="28" fill="#716150" stroke="#96816a"/>
      <path d="M387 143h39m-39 83h39" stroke="#8a8f77" strokeWidth="10" strokeLinecap="round"/>
      {teammates.map(person => <g key={person.name} transform={`translate(${person.x} ${person.y})`}>
        <rect x="-48" y="-52" width="96" height="44" rx="5" fill="#675a4b" stroke="#96816a"/>
        <rect x="-19" y="-49" width="38" height="23" rx="3" fill="#222925" stroke="#99ad9c"/>
        <path d="M-8-36h5m5 0h6" stroke={person.color} strokeWidth="3"/>
        <rect x="-12" y="-21" width="24" height="5" rx="2" fill="#b2a38b"/>
        <rect x="-14" y="0" width="28" height="23" rx="6" fill="#242824" stroke="#69745c"/>
        <path d="M-10 1h20v18h-20z" fill={person.color}/><path d="M-9-11h18V4H-9z" fill="#d7bd9e"/>
        <path d="M-10-14h20v7h-20z" fill="#4b403d"/><path d="M-5-4h2m6 0h2" stroke="#332c2a" strokeWidth="2"/>
        <text y="45" textAnchor="middle" fill="#f0ece3" fontSize="12" fontFamily="inherit">{person.name}</text>
        <text y="61" textAnchor="middle" fill="#b7bdb1" fontSize="10" fontFamily="inherit">{person.role}</text>
      </g>)}
      <path d="M634 44v21m-8-9 8 4 8-10" stroke="#9aa77b" strokeWidth="6" strokeLinecap="round"/><rect x="626" y="66" width="17" height="12" rx="2" fill="#9c7b59"/>
    </svg>
    <div className="hearth-preview-open"><a href={HEARTH_URL} target="_blank" rel="noopener noreferrer">Open App Studio <Icon name="chevron"/></a><p>The shared office opens in a new tab.</p></div>
  </div>;
}

function StudioFrame() {
  const [ready, setReady] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (ready) return;
    const timer = window.setTimeout(() => setFailed(true), 8000);
    return () => window.clearTimeout(timer);
  }, [ready]);
  function onLoad() {
    // Blocked frames can report a load for their initial empty document.
    try {
      if (frame.current?.contentDocument) { setFailed(true); return; }
    } catch { /* A loaded cross-origin office is expected. */ }
    setReady(true); setFailed(false);
  }
  return <div className={`hearth-frame ${ready ? 'is-ready' : ''}`}>
    {!ready && <OfficePreview/>}
    <iframe ref={frame} src={HEARTH_URL} title="App Studio collaborative agent office" tabIndex={ready ? 0 : -1} aria-hidden={!ready} onLoad={onLoad} onError={() => setFailed(true)} sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads"/>
    {failed && !ready && <span className="hearth-embed-note" role="status">Open the studio in a new tab to continue.</span>}
  </div>;
}

export default function HearthStudio({ active, onPlay }: { active: boolean; onPlay: () => void }) {
  const [frameVersion, setFrameVersion] = useState(0);
  return <section className="hearth-studio" hidden={!active} inert={!active} aria-label="App Studio">
    <header className="hearth-heading">
      <div className="hearth-title"><HearthMark/><div><h1>App Studio</h1><p>Build together. Games, mini apps, and your next idea.</p></div></div>
      <div className="hearth-actions"><button className="text-button" onClick={onPlay}><Icon name="games"/>Play games</button><a href={HEARTH_URL} target="_blank" rel="noopener noreferrer">Open in new tab <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 3h7v7m0-7L10 14M10 4H4v16h16v-6"/></svg></a></div>
    </header>
    <StudioFrame key={frameVersion}/>
    <footer className="hearth-footer"><span>Powered by Hearth · Your shared agent workspace.</span><button className="text-button" onClick={() => setFrameVersion(version => version + 1)}><Icon name="reset"/>Reload studio</button></footer>
  </section>;
}
