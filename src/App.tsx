import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import MemoryGame from './features/memory/MemoryGame';
import TypingGame from './features/typing/TypingGame';
import CircleGame from './features/circle/CircleGame';
import Icon from './components/Icon';
import { resetBalance } from './lib/records';
import type { GameMode } from './lib/challenges';
import { useAgentTask } from './features/chat/useAgentTask';
import './shell.css';
import { games } from './lib/games';
import GamePicker from './features/chat/GamePicker';

type Page = 'chat' | 'games' | 'memory' | 'typing' | 'circle' | 'profile';

const suggestions = ['Build me a personal website', 'Plan a weekend in Tokyo', 'Explain why my code works'];
const validPages: Page[] = ['chat', 'games', 'memory', 'typing', 'circle', 'profile'];
function currentPage(): Page { const hash = location.hash.slice(1) as Page; return hash === ('studio' as string) ? 'circle' : validPages.includes(hash) ? hash : 'chat'; }
function readName() { try { return localStorage.getItem('chatjipiti:v1:nickname')?.slice(0, 24) || 'Player One'; } catch { return 'Player One'; } }
function readMuted() { try { return localStorage.getItem('chatjipiti:muted') !== 'false'; } catch { return true; } }

export default function App() {
  const [page, setPage] = useState<Page>(currentPage);
  const [name, setName] = useState(readName);
  const [nickname, setNickname] = useState(name);
  const [mode, setMode] = useState<GameMode>('daily');
  const [muted, setMuted] = useState(readMuted);
  const [balance, setBalance] = useState(resetBalance);
  const [composer, setComposer] = useState('');
  const { run, elapsed, start: startAgent, stop: stopAgent, clear: clearAgent } = useAgentTask();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [mobile, setMobile] = useState(() => matchMedia('(max-width: 800px)').matches);
  const [notice, setNotice] = useState('');
  const [dismissed, setDismissed] = useState(false);
  const content = useRef<HTMLElement>(null);
  const menu = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLElement>(null);
  const activeGame = games.find(game => game.id === page);

  useEffect(() => {
    const onHash = () => { const next = currentPage(); setPage(next); setDrawer(false); if (next !== 'chat') setPickerOpen(false); };
    const onWallet = () => setBalance(resetBalance());
    const media = matchMedia('(max-width: 800px)');
    const onResize = () => setMobile(media.matches);
    window.addEventListener('hashchange', onHash);
    window.addEventListener('storage', onWallet);
    window.addEventListener('chatjipiti:wallet', onWallet);
    media.addEventListener('change', onResize);
    return () => { window.removeEventListener('hashchange', onHash); window.removeEventListener('storage', onWallet); window.removeEventListener('chatjipiti:wallet', onWallet); media.removeEventListener('change', onResize); };
  }, []);
  useEffect(() => {
    content.current?.scrollTo({ top: 0 });
    if (location.hash) content.current?.focus({ preventScroll: true });
  }, [page]);
  useEffect(() => {
    if (mobile && drawer) sidebar.current?.querySelector<HTMLButtonElement>('button')?.focus();
  }, [mobile, drawer]);

  function navigate(next: Page) {
    setPage(next); setDrawer(false); if (next !== 'chat') setPickerOpen(false);
    if (location.hash !== `#${next}`) location.hash = next;
    if (mobile && drawer) requestAnimationFrame(() => content.current?.focus({ preventScroll: true }));
  }
  function send(prompt = composer) {
    if (!prompt.trim() || run?.status === 'working') return;
    void startAgent(prompt.trim().slice(0, 1200)); setComposer(''); setDismissed(false); navigate('chat'); setPickerOpen(true);
  }
  function newChat() { setPickerOpen(false); clearAgent(); setComposer(''); setDismissed(false); navigate('chat'); }
  function toggleMute() {
    setMuted(value => !value);
    try { localStorage.setItem('chatjipiti:muted', String(!muted)); } catch { /* Session preference still works. */ }
  }
  function saveProfile(event: FormEvent) {
    event.preventDefault(); const next = nickname.trim() || 'Player One'; setName(next);
    try { localStorage.setItem('chatjipiti:v1:nickname', next); setNotice('Demo profile saved.'); } catch { setNotice('Saved for this visit. Browser storage is unavailable.'); }
  }
  const agentBusy = run?.status === 'working';
  const agentPhase = elapsed < 8 ? 'Understanding your request' : elapsed < 16 ? 'Exploring a few approaches' : elapsed < 24 ? 'Putting the pieces together' : 'Checking the details';

  return <div className={`chat-shell ${sidebarCollapsed && !mobile ? 'sidebar-collapsed' : ''}`}>
    {mobile && drawer && <button className="sidebar-backdrop" aria-label="Close sidebar" onClick={() => { setDrawer(false); menu.current?.focus(); }}/>}
    <aside ref={sidebar} id="sidebar" className={`sidebar ${drawer ? 'is-open' : ''}`} aria-label="Main navigation" {...(mobile && drawer ? { role: 'dialog', 'aria-modal': true } : {})} onKeyDown={event => {
      if (!mobile || !drawer) return;
      if (event.key === 'Escape') { setDrawer(false); menu.current?.focus(); }
      if (event.key === 'Tab') {
        const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('button'));
        const first = buttons[0], last = buttons.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    }}>
      <div className="sidebar-brand"><button className="brand-mark icon-button" onClick={newChat} aria-label="ChatJiPiTi home"><Icon name="spark"/></button><span>ChatJiPiTi</span>{!mobile && <button className="icon-button sidebar-collapse" aria-label="Collapse sidebar" onClick={() => setSidebarCollapsed(true)}><Icon name="panel"/></button>}{mobile && <button className="icon-button" onClick={() => { setDrawer(false); menu.current?.focus(); }} aria-label="Close navigation"><Icon name="close"/></button>}</div>
      <nav className="primary-nav"><button onClick={newChat} className="nav-item"><Icon name="edit"/>New chat</button><button onClick={() => navigate('games')} className={`nav-item ${page === 'games' ? 'selected' : ''}`} aria-current={page === 'games' ? 'page' : undefined}><Icon name="games"/>ChatJiPiTi Game<span className="new-label">NEW</span></button></nav>
      <div className="sidebar-section"><p>Play while you wait</p><nav>{games.map(game => <button key={game.id} className={`nav-item game-nav ${page === game.id ? 'selected' : ''}`} onClick={() => navigate(game.id)} aria-current={page === game.id ? 'page' : undefined}><Icon name={game.icon} style={{ color: game.color === 'purple' ? '#d1b5fb' : game.color === 'coral' ? '#ffb4a2' : '#ffdb69' }}/><span>{game.title}</span></button>)}</nav></div>
      <div className="sidebar-section recent-chats"><p>Your chats</p>{run ? <button className={`nav-item recent-title ${page === 'chat' ? 'selected' : ''}`} onClick={() => navigate('chat')}>{run.prompt}</button> : <span className="empty-chats">Your next big idea starts here.</span>}</div>
      <div className="sidebar-bottom"><button className="wallet-link" onClick={() => navigate('profile')}><Icon name="reset"/><span><b>{balance} banked {balance === 1 ? 'reset' : 'resets'}</b><small>Demo wallet</small></span><Icon name="chevron"/></button><button className="profile-link" onClick={() => { setNickname(name); navigate('profile'); }}><span className="avatar">{name.slice(0, 1).toUpperCase()}</span><span><b>{name}</b><small>Personal · demo account</small></span></button></div>
    </aside>
    <div className="workspace" inert={mobile && drawer}>
      <header className="topbar"><div>{sidebarCollapsed && !mobile && <button className="icon-button" aria-label="Expand sidebar" onClick={() => setSidebarCollapsed(false)}><Icon name="panel"/></button>}<button ref={menu} className="icon-button mobile-menu" aria-label="Open sidebar" aria-expanded={drawer} aria-controls="sidebar" onClick={() => setDrawer(true)}><Icon name="menu"/></button><button className="topbar-title" onClick={() => navigate('chat')}>ChatJiPiTi <Icon name="down"/></button><span className="demo-pill">Demo</span></div><button className="icon-button" aria-label={muted ? 'Enable game sounds' : 'Mute game sounds'} aria-pressed={!muted} onClick={toggleMute}><Icon name={muted ? 'mute' : 'sound'}/></button></header>
      {run && run.status !== 'stopped' && page !== 'chat' && <div className="agent-strip">{agentBusy ? <span className="thinking-dot"/> : <Icon name="check"/>}<span>{agentBusy ? 'Demo agent is working' : 'Your demo is ready'} · {elapsed}s</span><button onClick={() => navigate('chat')}>View chat <Icon name="chevron"/></button></div>}
      <main ref={content} className="content-scroll" tabIndex={-1}>
        {page === 'chat' && <div className={`chat-page ${run ? 'has-conversation' : ''}`}>
          {!run ? <div className="chat-welcome"><h1>What can I help with?</h1></div> : <div className="conversation"><div className="user-message">{run.prompt}</div><div className="assistant-message"><span className="assistant-avatar"><Icon name="spark"/></span><div><p className="assistant-name">ChatJiPiTi</p>{agentBusy ? <><div className="thinking-label"><span className="thinking-dot"/>{agentPhase}<span>{elapsed}s</span></div><p>I’m on it. This might take a little thinking.</p><div className="game-invitation"><span className="invitation-art"><Icon name="games"/></span><div><h2>Fancy a game?</h2><p>I’ll keep working. You go beat your best.</p><button onClick={() => setPickerOpen(true)}>Choose a game <Icon name="chevron"/></button></div></div><p className="mock-note">Simulated agent · ready in about 30 seconds.</p></> : run.status === 'stopped' ? <p>Stopped. Ready when you are.</p> : <><p>Your demo task is ready. Here’s the direction I’d take:</p><ul className="demo-answer"><li>Start with one clear outcome and a small first version.</li><li>Make the main interaction feel good on a phone.</li><li>Test the whole experience, then share what you made.</li></ul><p className="mock-note">Scripted demo response. No model request was made.</p><button className="secondary" onClick={() => setPickerOpen(true)}>Choose a game <Icon name="games"/></button></>}</div></div></div>}
          <div className="composer-area"><form className="composer" onSubmit={event => { event.preventDefault(); send(); }}><label className="sr-only" htmlFor="chat-prompt">Message ChatJiPiTi</label><textarea id="chat-prompt" rows={2} value={composer} onChange={event => setComposer(event.target.value)} placeholder="Ask anything" maxLength={1200} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); send(); } }}/><div className="composer-controls"><div className="composer-tools"><span className="mock-note">Demo chat</span></div>{agentBusy ? <button type="button" className="send-button" aria-label="Stop demo" onClick={() => { setPickerOpen(false); stopAgent(); }}><Icon name="stop"/></button> : <button type="submit" className="send-button" aria-label="Send message" disabled={!composer.trim()}><Icon name="arrow"/></button>}</div></form>{!run && <div className="prompt-suggestions">{suggestions.map(prompt => <button key={prompt} onClick={() => send(prompt)}>{prompt}</button>)}</div>}<p className="composer-note">Independent ChatGPT-style prototype. Account resets are simulated.</p></div>
        </div>}
        {page === 'games' && <div className="games-page"><div className="arcade-intro"><span className="arcade-symbol"><Icon name="games"/></span><h1>ChatJiPiTi Game</h1><p>Play while your agents work.</p></div><fieldset className="mode-picker"><legend className="sr-only">Choose game mode</legend><label><input type="radio" name="mode" checked={mode === 'daily'} onChange={() => setMode('daily')}/>Daily Challenge</label><label><input type="radio" name="mode" checked={mode === 'practice'} onChange={() => setMode('practice')}/>Free Play</label></fieldset><p className="mode-note">{mode === 'daily' ? 'Same challenges for everyone. Your best scores stay on this device.' : 'Fresh challenges. Unlimited attempts. No pressure. Well, a little.'}</p><div className="game-list">{games.map(game => <button className={`game-entry ${game.color}`} key={game.id} onClick={() => navigate(game.id)}><div className={`game-art art-${game.id}`} aria-hidden="true">{game.id === 'memory' ? <div className="mini-board">{Array.from({ length: 9 }, (_, i) => <i key={i}/>)}</div> : game.id === 'typing' ? <span>Aa<span>_</span></span> : <div className="yellow-circle"/>}</div><div className="game-copy"><h2>{game.title}</h2><p>{game.description}</p><span>{game.category} <i/> {game.id === 'typing' ? mode === 'daily' ? '60 seconds' : 'Up to 5 minutes' : game.id === 'memory' ? '4 boards' : 'One perfect circle'}</span></div><Icon name="chevron"/></button>)}</div><div className="arcade-footnote"><Icon name="reset"/><p>Draw a 95+ daily circle to bank a simulated Astra reset.<br/><span>A blessing from Pope Tibo. Strictly for the demo.</span></p></div></div>}
        {activeGame && <div className="game-page"><div className="game-toolbar"><button className="text-button" onClick={() => navigate('games')}><Icon name="back"/>All games</button><span>{mode === 'daily' ? 'Daily Challenge' : 'Free Play'}</span></div>{page === 'memory' && <MemoryGame key={mode} mode={mode} muted={muted}/>}{page === 'typing' && <TypingGame key={mode} mode={mode} muted={muted}/>}{page === 'circle' && <CircleGame key={mode} mode={mode} muted={muted}/>}</div>}
        {page === 'profile' && <section className="profile-page"><h1>Your little corner</h1><p>A demo profile. All yours, on this browser.</p><form onSubmit={saveProfile}><label htmlFor="profile-name">Arcade name</label><input id="profile-name" value={nickname} onChange={event => setNickname(event.target.value)} maxLength={24}/><button type="submit" className="primary">Save demo profile</button></form>{notice && <p role="status">{notice}</p>}<div className="wallet-panel"><Icon name="reset"/><h2>{balance} banked Astra {balance === 1 ? 'reset' : 'resets'}</h2><p>Earn one by scoring 95 or higher in the daily yellow circle challenge. One reward per UTC day.</p><p className="muted">These are simulated rewards. They do not change your real ChatGPT usage limits.</p><button className="secondary" onClick={() => { setMode('daily'); navigate('circle'); }}>Try today’s circle <Icon name="circle"/></button></div></section>}
      </main>
      {run?.status === 'complete' && page !== 'chat' && !dismissed && <div className="completion-toast" role="status"><Icon name="check"/><div><b>Your agent is ready.</b><span>Finish your game. No rush.</span></div><button onClick={() => navigate('chat')}>View chat</button><button className="icon-button" aria-label="Dismiss agent completion" onClick={() => setDismissed(true)}><Icon name="close"/></button></div>}
    </div>
    <GamePicker open={pickerOpen && page === 'chat'} working={agentBusy} onDismiss={() => { setPickerOpen(false); requestAnimationFrame(() => document.getElementById('chat-prompt')?.focus()); }} onChoose={game => { setPickerOpen(false); navigate(game); requestAnimationFrame(() => content.current?.focus({preventScroll:true})); }}/>
  </div>;
}
