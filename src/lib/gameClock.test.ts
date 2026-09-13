import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameClock } from './gameClock.ts';

test('minimising freezes elapsed time and preserves a pending action deadline', () => {
  let wall = 0;
  const clock = createGameClock(() => wall);
  const deadline = clock.now() + 850;
  wall = 300;
  clock.setPaused(true);
  wall = 10000;
  assert.equal(clock.now(), 300);
  assert.equal(deadline - clock.now(), 550);
  clock.setPaused(false);
  wall = 10549;
  assert.ok(clock.now() < deadline);
  wall = 10550;
  assert.equal(clock.now(), deadline);
});

test('repeated pauses and duplicate resume calls never add paused time', () => {
  let wall = 0;
  const clock = createGameClock(() => wall);
  clock.setPaused(true);
  wall = 1000;
  clock.setPaused(true);
  clock.setPaused(false);
  clock.setPaused(false);
  assert.equal(clock.now(), 0);
  wall = 1100;
  clock.setPaused(true);
  wall = 3000;
  clock.setPaused(false);
  wall = 3200;
  assert.equal(clock.now(), 300);
});
