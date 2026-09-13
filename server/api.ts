import { chmod, lstat, mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';

export type AssetKind = 'environment' | 'cards';
export type Asset = { id: string; kind: AssetKind; name: string; url: string; createdAt: string; model: string };
export type GenerationJob = { id: string; status: 'queued' | 'running' | 'completed' | 'failed'; asset?: Asset; error?: string };
type StoredAsset = Omit<Asset, 'url'> & { fileName: string };
type InternalGeneration = GenerationJob & { kind: AssetKind; prompt: string; name: string };
type FetchLike = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

const IMAGE_MODEL = 'gpt-image-2.5-sunburst';
const API = 'https://api.openai.com/v1';
const MAX_BODY = 12_000;
const MAX_IMAGE = 12 * 1024 * 1024;
const MAX_ASSETS = 30;
const MAX_UPSTREAM_RESPONSE = 20 * 1024 * 1024;

export type ApiOptions = { rootDir?: string; generatedDir?: string; manifestPath?: string; apiKey?: string; fetch?: FetchLike };
const apiJson = (value: unknown, status = 200) => new Response(JSON.stringify(value), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
const apiError = (status: number, message: string) => apiJson({ error: message }, status);
const assetKind = (value: unknown): value is AssetKind => value === 'environment' || value === 'cards';
const safeId = (value: string) => /^[A-Za-z0-9_-]{8,80}$/.test(value);
const nameOf = (value: unknown, fallback: string) => typeof value === 'string' && value.trim() ? value.trim().replace(/\s+/g, ' ').slice(0, 80) : fallback;
const publicAsset = ({ fileName: _fileName, ...asset }: StoredAsset): Asset => ({ ...asset, url: `/api/generated/${asset.id}.png` });

async function jsonBody(request: Request, max = MAX_BODY): Promise<Record<string, unknown> | null> {
  const length = Number(request.headers.get('content-length') || '0');
  if (Number.isFinite(length) && length > max) return null;
  const raw = await request.text();
  if (raw.length > max) return null;
  try { const value = JSON.parse(raw); return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null; } catch { return null; }
}
function redact(value: string) { return value.replace(/sk[-_][A-Za-z0-9_-]{8,}/g, '[redacted API key]'); }
function upstreamError(response: Response, text: string) {
  try { const detail = JSON.parse(text)?.error?.message; return `OpenAI request failed (${response.status})${typeof detail === 'string' ? `: ${redact(detail).slice(0, 240)}` : ''}`; } catch { return `OpenAI request failed (${response.status}).`; }
}
function cardsPrompt(prompt: string) { return `Create one 1536x1024 landscape pixel-art sprite atlas for a memory game. Lay out exactly 18 distinct icon-only rounded colorful geometric agent emblems in a strict 6-column by 3-row grid (each cell is 256 by 341 pixels). Give every cell a plain dark charcoal background with no inner border. Each icon must occupy only the central 50% of its cell so CSS crops are roomy. No text, letters, numbers, logos, faces, or watermarks. Art direction: ${prompt}`; }
function environmentPrompt(prompt: string) { return `Edit the supplied pixel-art room reference into a 3:2 1536x1024 retro arcade environment. Lock the blank board geometry at x=7.2%, y=7.4%, width=58.2%, height=69.4%; preserve its blank surface, perspective, and those exact bounds. Keep the chair and briefcase at their reference positions. The user theme may only change the area outside the board and the character's clothes. Do not add readable text, logos, people, or watermarks. Requested art direction: ${prompt}`; }
async function boundedResponseText(response: Response, limit = MAX_UPSTREAM_RESPONSE) { if (!response.body) { const text = await response.text(); if (Buffer.byteLength(text) > limit) throw new Error('OpenAI response exceeded the 20 MB limit.'); return text; } const reader = response.body.getReader(); const decoder = new TextDecoder(); let text = ''; let total = 0; while (true) { const { done, value } = await reader.read(); total += value?.byteLength || 0; if (total > limit) { await reader.cancel(); throw new Error('OpenAI response exceeded the 20 MB limit.'); } text += decoder.decode(value, { stream: !done }); if (done) return text; } }

export class GameApi {
  private readonly root: string; private readonly generated: string; private readonly manifest: string; private apiKey: string; private readonly fetcher: FetchLike;
  private readonly assets = new Map<string, StoredAsset>(); private readonly generations = new Map<string, InternalGeneration>(); private readonly pending = new Set<Promise<void>>(); private loaded: Promise<void>; private setupQueue: Promise<void> = Promise.resolve();
  constructor(options: ApiOptions = {}) { this.root = resolve(options.rootDir || process.cwd()); this.generated = resolve(options.generatedDir || join(this.root, '.generated')); this.manifest = resolve(options.manifestPath || join(this.generated, 'manifest.json')); this.apiKey = options.apiKey || process.env.OPENAI_API_KEY || ''; this.fetcher = options.fetch || fetch; this.loaded = this.load(); }
  async whenIdle() { await Promise.all([...this.pending]); }
  private async load() { await mkdir(this.generated, { recursive: true }); if (!this.apiKey) { try { const local = await readFile(join(this.root, '.env.local'), 'utf8'); const found = local.match(/^OPENAI_API_KEY=([^\r\n]+)$/m)?.[1]?.trim(); if (found) this.apiKey = found; } catch { /* optional local key */ } } try { const parsed = JSON.parse(await readFile(this.manifest, 'utf8')); for (const asset of Array.isArray(parsed?.assets) ? parsed.assets : []) if (asset && safeId(asset.id) && assetKind(asset.kind) && asset.fileName === `${asset.id}.png` && typeof asset.name === 'string' && typeof asset.createdAt === 'string' && asset.model === IMAGE_MODEL) this.assets.set(asset.id, asset); } catch { /* absent/malformed manifest is empty */ } }
  private track(work: Promise<void>) { this.pending.add(work); void work.finally(() => this.pending.delete(work)); }
  private configured() { return this.apiKey.trim().length > 0; }
  private headers() { return new Headers({ authorization: `Bearer ${this.apiKey}` }); }
  private async saveManifest() { const temporary = `${this.manifest}.${crypto.randomUUID()}.tmp`; await writeFile(temporary, JSON.stringify({ assets: [...this.assets.values()] }, null, 2), { encoding: 'utf8', mode: 0o600 }); await rename(temporary, this.manifest); }
  async handle(request: Request): Promise<Response | null> {
    await this.loaded; const url = new URL(request.url); const path = url.pathname; if (!path.startsWith('/api/')) return null;
    if (request.method === 'GET' && path === '/api/status') return apiJson({ configured: this.configured() });
    if (request.method === 'GET' && path === '/api/assets') return apiJson({ assets: [...this.assets.values()].map(publicAsset) });
    if (request.method === 'POST' && path === '/api/setup-key') return this.setupKey(request);
    const generated = path.match(/^\/api\/generated\/([A-Za-z0-9_-]+)\.png$/); if (request.method === 'GET' && generated) return this.getAsset(generated[1]);
    if (request.method === 'POST' && path === '/api/generate') return this.createGeneration(request);
    const job = path.match(/^\/api\/generations\/([A-Za-z0-9_-]+)$/); if (request.method === 'GET' && job) return this.getGeneration(job[1]);
    return apiError(404, 'Unknown API route.');
  }
  private async setupKey(request: Request) { const body = await jsonBody(request, 512); if (!body || typeof body.apiKey !== 'string' || !/^sk-[A-Za-z0-9_-]{16,480}$/.test(body.apiKey)) return apiError(400, 'Provide a valid OpenAI API key.'); const key = body.apiKey; const work = this.setupQueue.then(async () => { if (this.configured()) return false; const path = join(this.root, '.env.local'); let existing = ''; try { const info = await lstat(path); if (info.isSymbolicLink()) throw new Error('refusing symlink'); existing = await readFile(path, 'utf8'); } catch (cause) { if (cause instanceof Error && cause.message === 'refusing symlink') throw cause; if ((cause as NodeJS.ErrnoException).code !== 'ENOENT') throw cause; } const separator = existing && !existing.endsWith('\n') ? '\n' : ''; const temporary = `${path}.${crypto.randomUUID()}.tmp`; await writeFile(temporary, `${existing}${separator}OPENAI_API_KEY=${key}\n`, { encoding: 'utf8', mode: 0o600 }); await chmod(temporary, 0o600); await rename(temporary, path); this.apiKey = key; return true; }); this.setupQueue = work.then(() => undefined, () => undefined); let created: boolean; try { created = await work; } catch { return apiError(500, 'Could not securely save the server API key.'); } return created ? apiJson({ configured: true }, 201) : apiError(409, 'An OpenAI API key is already configured.'); }
  private async getAsset(id: string) { if (!safeId(id) || !this.assets.has(id)) return apiError(404, 'Asset not found.'); try { const bytes = await readFile(join(this.generated, `${id}.png`)); if (bytes.byteLength > MAX_IMAGE) return apiError(500, 'Stored asset is too large to serve.'); return new Response(bytes, { headers: { 'content-type': 'image/png', 'cache-control': 'private, max-age=3600', 'x-content-type-options': 'nosniff' } }); } catch { return apiError(404, 'Asset file is unavailable.'); } }
  private async createGeneration(request: Request) { const body = await jsonBody(request); if (!body || !assetKind(body.kind) || typeof body.prompt !== 'string' || body.prompt.trim().length < 3 || body.prompt.length > 1600) return apiError(400, 'Provide kind (environment or cards) and a prompt between 3 and 1600 characters.'); if (!this.configured()) return apiError(503, 'OPENAI_API_KEY is not configured. Add it to .env on the server and restart.'); if (this.assets.size >= MAX_ASSETS) return apiError(429, 'The local generated-asset cache is full (30 assets). Remove old generated files before creating another.'); if ([...this.generations.values()].some(item => item.status === 'queued' || item.status === 'running')) return apiError(429, 'An image generation is already running. Poll it before starting another.'); const item: InternalGeneration = { id: crypto.randomUUID(), kind: body.kind, prompt: body.prompt.trim(), name: nameOf(body.name, body.kind === 'cards' ? 'Agent emblem atlas' : 'Arcade environment'), status: 'queued' }; this.generations.set(item.id, item); this.track(this.runGeneration(item)); return apiJson(this.publicGeneration(item), 202); }
  private publicGeneration(item: InternalGeneration): GenerationJob { const { kind: _kind, prompt: _prompt, name: _name, ...result } = item; return result; }
  private async runGeneration(item: InternalGeneration) { item.status = 'running'; try { const bytes = item.kind === 'cards' ? await this.generateCards(item.prompt) : await this.editEnvironment(item.prompt); if (!bytes.length || bytes.length > MAX_IMAGE) throw new Error('The generated image was empty or too large.'); const asset: StoredAsset = { id: item.id, kind: item.kind, name: item.name, createdAt: new Date().toISOString(), model: IMAGE_MODEL, fileName: `${item.id}.png` }; await writeFile(join(this.generated, asset.fileName), bytes); this.assets.set(asset.id, asset); await this.saveManifest(); item.asset = publicAsset(asset); item.status = 'completed'; } catch (cause) { item.status = 'failed'; item.error = cause instanceof Error ? redact(cause.message).slice(0, 320) : 'Image generation failed.'; } }
  private async imageResult(response: Response, width: number, height: number) { const raw = await boundedResponseText(response); if (!response.ok) throw new Error(upstreamError(response, raw)); let encoded: unknown; try { encoded = JSON.parse(raw)?.data?.[0]?.b64_json; } catch { /* checked below */ } if (typeof encoded !== 'string' || !/^[A-Za-z0-9+/=]+$/.test(encoded)) throw new Error('OpenAI returned no base64 PNG data.'); const bytes = Buffer.from(encoded, 'base64'); const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]); if (bytes.length < 24 || !bytes.subarray(0, 8).equals(png) || bytes.subarray(12, 16).toString('ascii') !== 'IHDR') throw new Error('OpenAI returned data that is not a PNG image.'); if (bytes.readUInt32BE(16) !== width || bytes.readUInt32BE(20) !== height) throw new Error(`OpenAI returned PNG dimensions other than ${width}x${height}.`); return bytes; }
  private async generateCards(prompt: string) { const headers = this.headers(); headers.set('content-type', 'application/json'); return this.imageResult(await this.fetcher(`${API}/images/generations`, { method: 'POST', headers, signal: AbortSignal.timeout(240_000), body: JSON.stringify({ model: IMAGE_MODEL, prompt: cardsPrompt(prompt), size: '1536x1024', quality: 'high', output_format: 'png' }) }), 1536, 1024); }
  private async editEnvironment(prompt: string) { let bytes: Buffer | undefined; let filename = ''; for (const relative of ['public/environments/classic.png', 'public/circle-room.png']) try { const found = await readFile(join(this.root, relative)); if (found.length && found.length <= MAX_IMAGE) { bytes = found; filename = basename(relative); break; } } catch { /* try fallback */ } if (!bytes) throw new Error('No environment reference exists. Add public/environments/classic.png or public/circle-room.png.'); const form = new FormData(); form.set('model', IMAGE_MODEL); form.set('prompt', environmentPrompt(prompt)); form.set('size', '1536x1024'); form.set('quality', 'high'); form.set('output_format', 'png'); form.set('image[]', new Blob([new Uint8Array([...bytes])], { type: 'image/png' }), filename); return this.imageResult(await this.fetcher(`${API}/images/edits`, { method: 'POST', headers: this.headers(), signal: AbortSignal.timeout(240_000), body: form }), 1536, 1024); }
  private getGeneration(id: string) { const item = this.generations.get(id); return item ? apiJson(this.publicGeneration(item)) : apiError(404, 'Generation not found.'); }
}
export const createGameApi = (options?: ApiOptions) => new GameApi(options);
