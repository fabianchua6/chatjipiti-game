export const games = [
  { id: 'memory', title: 'You’re Absolutely Right!', description: 'Find your matching agents. An exercise in agreeable thinking.', category: 'Memory', icon: 'grid', color: 'purple' },
  { id: 'typing', title: 'Make No Mistakes', description: 'One wrong character and it’s over. How far can you go?', category: 'Typing', icon: 'type', color: 'coral' },
  { id: 'circle', title: 'Draw Me a Yellow Circle', description: 'Remember it. Recreate it. Maybe receive a blessing.', category: 'Precision', icon: 'circle', color: 'gold' },
] as const;
export type GameId = (typeof games)[number]['id'];
