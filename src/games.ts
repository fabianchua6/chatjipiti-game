import type { ComponentType, ComponentProps } from 'react';
import type Icon from './components/Icon';
import MemoryGame from './features/memory/MemoryGame';
import TypingGame from './features/typing/TypingGame';
import CircleGame from './features/circle/CircleGame';
export type StudioGame = { id: string; title: string; description: string; category: string; icon: ComponentProps<typeof Icon>['name']; color: 'purple' | 'coral' | 'gold'; component: ComponentType<{ mode: 'daily' | 'practice'; muted: boolean }> };
const additions = import.meta.glob<{ default: StudioGame }>('./features/*/studio-game.ts', { eager: true });
export const games: StudioGame[] = [
 { id: 'memory', title: 'You’re Absolutely Right!', description: 'Find your matching agents. An exercise in agreeable thinking.', category: 'Memory', icon: 'grid', color: 'purple', component: MemoryGame },
 { id: 'typing', title: 'Make No Mistakes', description: 'One wrong character and it’s over. How far can you go?', category: 'Typing', icon: 'type', color: 'coral', component: TypingGame },
 { id: 'circle', title: 'Draw Me a Yellow Circle', description: 'Remember it. Recreate it. Maybe receive a blessing.', category: 'Precision', icon: 'circle', color: 'gold', component: CircleGame },
 ...Object.keys(additions).sort().map(path => additions[path].default),
];
if (new Set(games.map(g => g.id)).size !== games.length) throw new Error('Duplicate studio game ID');
