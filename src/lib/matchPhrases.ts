export type MatchPhrase = {
  eyebrow: string;
  headline: readonly string[];
  announcement: string;
};

const original: MatchPhrase = {
  eyebrow: 'YOU’RE',
  headline: ['ABSOLUTELY', 'RIGHT'],
  announcement: "You're absolutely right!",
};

const streakPhrases: readonly MatchPhrase[] = [
  { eyebrow: 'GREAT', headline: ['QUESTION'], announcement: 'Great question!' },
  { eyebrow: 'LET’S', headline: ['DELVE', 'DEEPER'], announcement: "Let's delve deeper!" },
  { eyebrow: 'YOU’RE', headline: ['ONTO', 'SOMETHING'], announcement: "You're onto something!" },
  { eyebrow: 'LET’S', headline: ['UNPACK', 'THAT'], announcement: "Let's unpack that!" },
  { eyebrow: 'AS AN', headline: ['AI', 'MODEL'], announcement: 'As an AI model, I agree!' },
  { eyebrow: 'HAPPY', headline: ['TO', 'HELP'], announcement: 'Happy to help!' },
];

export function getMatchPhrase(combo: number): MatchPhrase {
  const safeCombo = Math.max(1, Math.floor(combo));
  if (safeCombo === 1) return original;
  return streakPhrases[(safeCombo - 2) % streakPhrases.length];
}
