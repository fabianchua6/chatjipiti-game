export type MatchPhrase = {
  eyebrow: string;
  headline: readonly string[];
  announcement: string;
};

const amplifiers = [
  'COSMICALLY',
  'ASTRONOMICALLY',
  'INFINITELY',
  'INTERGALACTICALLY',
  'MULTIVERSALLY',
  'OMNIVERSALLY',
  'TRANSCENDENTALLY',
  'UNFATHOMABLY',
  'ETERNALLY',
  'INCONCEIVABLY',
  'SPECTACULARLY',
  'PHENOMENALLY',
  'STUPENDOUSLY',
  'OUTRAGEOUSLY',
  'GLORIOUSLY',
  'DIVINELY',
  'ULTIMATELY',
] as const;

export function getMatchPhrase(combo: number): MatchPhrase {
  const safeCombo = Number.isFinite(combo) ? Math.max(1, Math.floor(combo)) : 1;
  // Each consecutive pair after the first adds a word, keeping all earlier words.
  const earned = amplifiers.slice(0, safeCombo - 1);
  const headline = ['ABSOLUTELY', ...earned, 'RIGHT'];
  return {
    eyebrow: 'YOU’RE',
    headline,
    announcement: `You're ${headline.join(' ').toLowerCase()}!`,
  };
}
