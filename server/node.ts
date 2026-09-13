import type { IncomingMessage, ServerResponse } from 'node:http';
import type { GameApi } from './api.ts';

const MAX_BODY = 12_000;
const loopback = (address: string | undefined) => address === '127.0.0.1' || address === '::1' || address === '::ffff:127.0.0.1';
const localHost = (host: string | undefined) => Boolean(host && /^(localhost|127\.0\.0\.1)(:\d+)?$|^\[::1\](:\d+)?$/i.test(host));
async function bodyOf(request: IncomingMessage) { if (request.method === 'GET' || request.method === 'HEAD') return undefined; const chunks: Buffer[] = []; let length = 0; for await (const chunk of request) { const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk); length += bytes.length; if (length > MAX_BODY) throw new Error('too-large'); chunks.push(bytes); } return Buffer.concat(chunks); }
function protectedPost(pathname: string, method: string | undefined) { return method === 'POST' && (pathname === '/api/setup-key' || pathname === '/api/generate'); }

export async function serveApi(api: GameApi, request: IncomingMessage, response: ServerResponse) {
  let url: URL; try { const host = request.headers.host || 'localhost'; url = new URL(request.url || '/', `http://${host}`); } catch { response.writeHead(400, { 'content-type': 'application/json; charset=utf-8' }); response.end(JSON.stringify({ error: 'Malformed request URL.' })); return true; }
  if (!url.pathname.startsWith('/api/')) return false;
  if (protectedPost(url.pathname, request.method)) { const requestOrigin = request.headers.origin; const origin = `http://${request.headers.host || 'localhost'}`; if (!loopback(request.socket.remoteAddress) || !localHost(request.headers.host) || (requestOrigin && requestOrigin !== origin)) { response.writeHead(403, { 'content-type': 'application/json; charset=utf-8' }); response.end(JSON.stringify({ error: 'This write endpoint accepts same-origin requests from an approved loopback host only.' })); return true; } }
  try { const body = await bodyOf(request); const headers = new Headers(); for (const [key, value] of Object.entries(request.headers)) if (typeof value === 'string') headers.set(key, value); const apiResponse = await api.handle(new Request(url, { method: request.method, headers, body: body ? new Uint8Array(body) : undefined })); if (!apiResponse) return false; response.statusCode = apiResponse.status; apiResponse.headers.forEach((value, key) => response.setHeader(key, value)); response.end(Buffer.from(await apiResponse.arrayBuffer())); } catch { response.writeHead(400, { 'content-type': 'application/json; charset=utf-8' }); response.end(JSON.stringify({ error: 'Invalid API request.' })); }
  return true;
}
