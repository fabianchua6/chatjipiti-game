import test from 'node:test';
import assert from 'node:assert/strict';
import { cardPackSelection, isRetiredCardPack } from './cardPackMigration.ts';

test('saved Sea Glass and Prism choices become Pets without changing other selections', () => {
  for (const id of ['prism', '4c081aaa-5ef1-4beb-b0b9-18ff324e3f37']) assert.equal(cardPackSelection(id), 'pets');
  for (const id of ['agents', 'pets', 'zootopia', 'new-user-pack']) assert.equal(cardPackSelection(id), id);
});
test('the retired generated pack stays out of the picker while other artwork remains available', () => {
  assert.equal(isRetiredCardPack({id:'legacy',kind:'cards',name:'Sea Glass Agents'}), true);
  assert.equal(isRetiredCardPack({id:'legacy',kind:'cards',name:'sea-glass agents'}), true);
  assert.equal(isRetiredCardPack({id:'new',kind:'cards',name:'Woodland friends'}), false);
  assert.equal(isRetiredCardPack({id:'new',kind:'environment',name:'Sea Glass Agents'}), false);
});
