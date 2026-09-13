import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { createGameApi } from './api.ts';
import { serveApi } from './node.ts';
const root = resolve(process.cwd()), dist = resolve(root, 'dist'), api = createGameApi({ rootDir: root });
const types: Record<string, string> = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json; charset=utf-8', '.woff2': 'font/woff2' };
async function staticFile(pathname: string) { let decoded: string; try { decoded = decodeURIComponent(pathname === '/' ? '/index.html' : pathname); } catch { return null; } const candidate = resolve(dist, `.${decoded}`); if ((!candidate.startsWith(`${dist}/`) && candidate !== join(dist, 'index.html'))) return null; try { if ((await stat(candidate)).isFile()) return { bytes: await readFile(candidate), type: types[extname(candidate)] || 'application/octet-stream' }; } catch { /* SPA fallback */ } try { return { bytes: await readFile(join(dist, 'index.html')), type: types['.html'] }; } catch { return null; } }
const port = Math.max(1, Math.min(65535, Number(process.env.PORT) || 4173));
createServer(async (request, response) => { if (await serveApi(api, request, response)) return; const file = await staticFile(new URL(request.url || '/', 'http://localhost').pathname); if (!file) { response.statusCode = 404; response.end('Build not found. Run npm run build first.'); return; } response.writeHead(200, { 'content-type': file.type, 'x-content-type-options': 'nosniff' }); response.end(file.bytes); }).listen(port, '127.0.0.1', () => console.log(`ChatJiPiTi Games listening on http://127.0.0.1:${port}`));
