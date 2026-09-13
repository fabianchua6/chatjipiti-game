// Retired demo choices remain on disk; saved selections now point at Pets.
export const RETIRED_CARD_PACK_IDS = new Set(['prism', '4c081aaa-5ef1-4beb-b0b9-18ff324e3f37']);
export function cardPackSelection(id: string) {
  return RETIRED_CARD_PACK_IDS.has(id) ? 'pets' : id;
}
export function isRetiredCardPack(asset: { id: string; kind: string; name: string }) {
  return asset.kind === 'cards' && (RETIRED_CARD_PACK_IDS.has(asset.id) || /^sea[ -]?glass agents$/i.test(asset.name.trim()));
}
