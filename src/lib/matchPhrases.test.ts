import test from 'node:test';
import assert from 'node:assert/strict';
import { getMatchPhrase } from './matchPhrases.ts';

test('each consecutive match adds one distinct word through all 18 pairs', () => {
  let previous = getMatchPhrase(1).headline.slice(1, -1);
  assert.deepEqual(getMatchPhrase(1).headline, ['ABSOLUTELY', 'RIGHT']);
  for (let combo = 2; combo <= 18; combo += 1) {
    const phrase = getMatchPhrase(combo);
    const earned = phrase.headline.slice(1, -1);
    assert.equal(earned.length, combo - 1);
    assert.deepEqual(earned.slice(0, -1), previous);
    assert.equal(new Set(earned).size, earned.length);
    assert.equal(phrase.announcement, `You're ${phrase.headline.join(' ').toLowerCase()}!`);
    previous = earned;
  }
});

test('the third combo gets its own word and the fourth keeps the full stack', () => {
  assert.deepEqual(getMatchPhrase(2).headline, ['ABSOLUTELY', 'COSMICALLY', 'RIGHT']);
  assert.deepEqual(getMatchPhrase(3).headline, ['ABSOLUTELY', 'COSMICALLY', 'ASTRONOMICALLY', 'RIGHT']);
  assert.deepEqual(getMatchPhrase(4).headline, ['ABSOLUTELY', 'COSMICALLY', 'ASTRONOMICALLY', 'INFINITELY', 'RIGHT']);
  for (const invalid of [0, -1, NaN, Infinity]) assert.deepEqual(getMatchPhrase(invalid), getMatchPhrase(1));
});
