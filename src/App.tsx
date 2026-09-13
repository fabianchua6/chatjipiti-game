import { useState } from 'react';
import MemoryGame from './features/memory/MemoryGame';
import TypingGame from './features/typing/TypingGame';
import CircleGame from './features/circle/CircleGame';

type Page = 'hub' | 'memory' | 'typing' | 'circle' | 'waiting';
const games = [
  { id: 'memory', title: 'You’re Absolutely Right!', description: 'A little memory. A lot of agreeable agents.', category: 'MATCH PAIRS', status: 'Play the starter', color: 'purple' },
  { id: 'typing', title: 'Make No Mistakes', description: 'Your next typo is your last. No pressure.', category: 'TYPE PERFECTLY', status: 'View game brief', color: 'red' },
  { id: 'circle', title: 'Draw Me a Yellow Circle', description: 'How hard could one yellow circle be?', category: 'REMEMBER & DRAW', status: 'View game brief', color: 'yellow' },
] as const;

function storedName() { try { return localStorage.getItem('chatjipiti:v1:nickname')?.slice(0, 24) || ''; } catch { return ''; } }
export default function App() {
  const [page, setPage] = useState<Page>('hub');
  const [name, setName] = useState(storedName);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'daily' | 'practice'>('practice');
  const [storageError, setStorageError] = useState(false);
  function signIn(event: React.FormEvent) {
    event.preventDefault(); const nickname = input.trim() || 'Player One'; setName(nickname);
    try { localStorage.setItem('chatjipiti:v1:nickname', nickname); } catch { setStorageError(true); }
  }
  return <div className="arcade">
    <header><button className="brand" onClick={() => setPage('hub')} aria-label="ChatJiPiTi Games home"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M3 4h26v19H16l-8 6v-6H3z" fill="currentColor"/><path d="M9 10h4v4H9zm10 0h4v4h-4z" fill="#101813"/></svg><span>ChatJiPiTi<span className="brand-sub">GAMES</span></span></button><span className="profile">{name || 'PLAYER ONE'}<span className="muted">0 resets · demo</span></span></header>
    <main>
      {!name ? <section className="login"><h1>Play while your<br/>agents work.</h1><p>Three tiny games for the space between prompts.</p><form onSubmit={signIn}><label htmlFor="nickname">Your arcade name</label><input id="nickname" value={input} onChange={event => setInput(event.target.value)} maxLength={24} placeholder="Player One" autoComplete="nickname"/><button type="submit">Continue with ChatGPT <span aria-hidden="true">↗</span></button></form><p className="muted">Demo sign-in. No ChatGPT account connection.</p></section> : <>
        {page !== 'hub' && <button className="text-button" onClick={() => setPage('hub')}>← Back to arcade</button>}
        {page === 'hub' && <>
          <div className="hub-heading"><div><h1>Your agent’s working.<br/><span>You’ve got next.</span></h1><p>Pick a game. Make the wait a little less boring.</p></div><button className="secondary small" onClick={() => setPage('waiting')}>Try “Fancy a game?”</button></div>
          <fieldset className="mode-picker"><legend className="sr-only">Game mode</legend><label><input type="radio" name="mode" checked={mode === 'daily'} onChange={() => setMode('daily')}/>Daily Challenge</label><label><input type="radio" name="mode" checked={mode === 'practice'} onChange={() => setMode('practice')}/>Free Play</label></fieldset>
          <div className="game-list">{games.map(game => <button className={`game-entry ${game.color}`} key={game.id} onClick={() => setPage(game.id)}><div className={`game-art art-${game.id}`} aria-hidden="true">{game.id === 'memory' ? <div className="mini-board">{Array.from({length:9},(_,i)=><i key={i}/>)}</div> : game.id === 'typing' ? <span>Aa<span className="cursor">_</span></span> : <div className="yellow-circle"/>}</div><div className="game-copy"><h2>{game.title}</h2><p>{game.description}</p><span className="game-meta">{game.category} · {game.status}</span></div><span className="entry-arrow" aria-hidden="true">↗</span></button>)}</div>
        </>}
        {page === 'waiting' && <section className="waiting"><span className="badge">Integration demo</span><h1>Thinking things through…</h1><p>Your agent is working on something good.</p><div className="waiting-prompt"><h2>Fancy a game?</h2><p>A tiny break while the big thoughts happen.</p><button onClick={() => setPage('hub')}>Open the arcade</button></div><p className="muted">This waiting screen is simulated. It is not connected to a running agent.</p></section>}
        {page === 'memory' && <MemoryGame mode={mode}/>}{page === 'typing' && <TypingGame/>}{page === 'circle' && <CircleGame/>}
      </>}
      {storageError && <p role="status">Your name will last for this visit. Browser storage is unavailable.</p>}
    </main><footer><span>Small games. Big thinking.</span><span>Hackathon build · v0.1</span></footer>
  </div>;
}
