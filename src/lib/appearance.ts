import { useEffect, useState } from 'react';

export type ArtKind = 'environment' | 'cards';
export type ArtAsset = { id: string; kind: ArtKind; name: string; url: string; model?: string; createdAt?: string };
export const environments: ArtAsset[] = [
  { id: 'classic', kind: 'environment', name: 'The original room', url: '/environments/classic.png' },
  { id: 'forest', kind: 'environment', name: 'Forest retreat', url: '/environments/forest.png' },
  { id: 'moon', kind: 'environment', name: 'Moon base', url: '/environments/moon.png' },
];
export const cardPacks: ArtAsset[] = [
  { id: 'agents', kind: 'cards', name: 'Agent originals', url: '' },
  { id: 'prism', kind: 'cards', name: 'Prism collection', url: '' },
];
const eventName = 'chatjipiti:appearance';
const key = (kind: ArtKind) => `chatjipiti:art:${kind}`;
export function selectArt(asset: ArtAsset) {
  try { localStorage.setItem(key(asset.kind), asset.id); } catch { /* Selection still updates this visit. */ }
  window.dispatchEvent(new CustomEvent(eventName, { detail: asset }));
}
export async function apiRequest<T>(url: string, body?: object, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { method: body ? 'POST' : 'GET', headers: body ? { 'Content-Type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined, signal });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(typeof data.error === 'string' ? data.error : data.error?.message || `Request failed (${response.status}). Please try again.`);
  }
  return await response.json() as T;
}
export function useArtLibrary(kind: ArtKind) {
  const defaults = kind === 'environment' ? environments : cardPacks;
  const [assets, setAssets] = useState<ArtAsset[]>(defaults);
  const [selectedId, setSelectedId] = useState(() => { try { return localStorage.getItem(key(kind)) || defaults[0].id; } catch { return defaults[0].id; } });
  useEffect(() => {
    const controller = new AbortController();
    const refresh = () => { void apiRequest<{ assets: ArtAsset[] }>('/api/assets', undefined, controller.signal).then(data => setAssets([...defaults, ...data.assets.filter(asset => asset.kind === kind)])).catch(() => {}); };
    const change = (event: Event) => {
      const detail = (event as CustomEvent<ArtAsset>).detail;
      if (detail?.kind === kind) { setSelectedId(detail.id); refresh(); }
      else if (event.type === 'storage') { try { setSelectedId(localStorage.getItem(key(kind)) || defaults[0].id); } catch { /* Keep session selection. */ } }
    };
    refresh(); window.addEventListener(eventName, change); window.addEventListener('storage', change); window.addEventListener('chatjipiti:asset-created', refresh);
    return () => { controller.abort(); window.removeEventListener(eventName, change); window.removeEventListener('storage', change); window.removeEventListener('chatjipiti:asset-created', refresh); };
  }, [kind, defaults]);
  return { assets, selected: assets.find(asset => asset.id === selectedId) || defaults[0], select: selectArt };
}
