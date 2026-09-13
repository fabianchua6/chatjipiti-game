export type MatchPhrase = {
  eyebrow: string;
  headline: readonly string[];
  announcement: string;
};

const amplifiers = [
  '',
  'ASTRONOMICALLY',
  'INTERGALACTICALLY',
  'MULTIVERSALLY',
  'OMNIVERSALLY',
  'TRANSCENDENTALLY',
  'UNFATHOMABLY',
  'INFINITELY',
] as const;

export function getMatchPhrase(combo: number): MatchPhrase {
  const safeCombo = Number.isFinite(combo) ? Math.max(1, Math.floor(combo)) : 1;
  // Hold the biggest superlative on long streaks instead of cycling back down.
  const amplifier = amplifiers[Math.min(safeCombo - 1, amplifiers.length - 1)];
  const headline = ['ABSOLUTELY', ...(amplifier ? [amplifier] : []), 'RIGHT'];
  return {
    eyebrow: 'YOU’RE',
    headline,
    announcement: `You're ${headline.join(' ').toLowerCase()}!`,
  };
}
