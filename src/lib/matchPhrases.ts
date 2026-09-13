export type MatchPhrase = {
  eyebrow: string;
  headline: readonly string[];
  announcement: string;
};

const amplifiers = [
  'ASTRONOMICALLY',
  'INFINITELY',
  'INTERGALACTICALLY',
  'MULTIVERSALLY',
  'OMNIVERSALLY',
  'TRANSCENDENTALLY',
  'UNFATHOMABLY',
  'ETERNALLY',
  'INCONCEIVABLY',
] as const;

export function getMatchPhrase(combo: number): MatchPhrase {
  const safeCombo = Number.isFinite(combo) ? Math.max(1, Math.floor(combo)) : 1;
  // Every two consecutive pairs adds a word, keeping all earlier words.
  const earned = amplifiers.slice(0, Math.floor(safeCombo / 2));
  const headline = ['ABSOLUTELY', ...earned, 'RIGHT'];
  return {
    eyebrow: 'YOU’RE',
    headline,
    announcement: `You're ${headline.join(' ').toLowerCase()}!`,
  };
}
