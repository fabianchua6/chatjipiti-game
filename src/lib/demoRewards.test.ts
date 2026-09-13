import test from 'node:test';
import assert from 'node:assert/strict';
import { awardDemoReset, resetBalance } from './records.ts';

test('each winning demo round earns a reset; duplicate submissions do not and blocked storage keeps session rewards', () => {
  const storageDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const windowDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const records = new Map([['chatjipiti:v2:circle-reset:2026-09-13', 'claimed']]);
  const target = new EventTarget();
  let blocked = false;
  let updates = 0;
  target.addEventListener('chatjipiti:wallet', () => updates++);
  Object.defineProperty(globalThis, 'window', { configurable: true, value: target });
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    get length() { return records.size; },
    key: (index: number) => [...records.keys()][index] ?? null,
    getItem: (key: string) => records.get(key) ?? null,
    setItem: (key: string, value: string) => { if (blocked) throw Error('Storage blocked'); records.set(key, value); },
  } });
  try {
    const first = '11111111-1111-4111-8111-111111111111';
    const second = '22222222-2222-4222-8222-222222222222';
    const third = '33333333-3333-4333-8333-333333333333';
    assert.equal(resetBalance(), 1, 'Existing daily rewards survive');
    awardDemoReset(first);
    assert.equal(resetBalance(), 2);
    assert.equal(records.get(`chatjipiti:v2:circle-demo-reset:${first}`), 'claimed');
    awardDemoReset(first);
    assert.equal(resetBalance(), 2, 'The same round never credits twice');
    assert.equal(updates, 1);
    awardDemoReset(second);
    assert.equal(resetBalance(), 3, 'A repeat win earns another reward');
    blocked = true;
    awardDemoReset(third);
    assert.equal(resetBalance(), 4, 'A demo reward survives a failed storage write');
    assert.equal(records.has(`chatjipiti:v2:circle-demo-reset:${third}`), false);
    awardDemoReset(third);
    awardDemoReset('invalid-round');
    assert.equal(resetBalance(), 4);
    assert.equal(updates, 3);
  } finally {
    if (storageDescriptor) Object.defineProperty(globalThis, 'localStorage', storageDescriptor); else Reflect.deleteProperty(globalThis, 'localStorage');
    if (windowDescriptor) Object.defineProperty(globalThis, 'window', windowDescriptor); else Reflect.deleteProperty(globalThis, 'window');
  }
});
