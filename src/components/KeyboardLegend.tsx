import type { ReactNode } from 'react';
import './keyboard-legend.css';

type Shortcut = { keys: string[]; label: string; separator?: string };

export function Keycap({ children }: { children: ReactNode }) {
  return <kbd className="keyboard-key">{children}</kbd>;
}

export default function KeyboardLegend({ id, shortcuts, note }: { id?: string; shortcuts: Shortcut[]; note?: string }) {
  return <aside id={id} className="keyboard-legend" aria-label="Keyboard controls">
    <span className="keyboard-legend-title"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="3"/><path d="M6 9h1m4 0h1m4 0h1M6 12h1m4 0h1m4 0h1M7 16h10" strokeLinecap="round"/></svg>Keyboard</span>
    <ul>{shortcuts.map(shortcut => <li key={shortcut.label}>
      <span className="keyboard-combo">{shortcut.keys.map((key, index) => <span className="keyboard-combo-part" key={key}>{index > 0 && <span className="keyboard-separator">{shortcut.separator ?? '+'}</span>}<Keycap>{key}</Keycap></span>)}</span>
      <span>{shortcut.label}</span>
    </li>)}</ul>
    {note && <p className="keyboard-legend-note">{note}</p>}
  </aside>;
}
