import type { Plugin } from 'vite';
import { createGameApi } from './api.ts';
import { serveApi } from './node.ts';
export function gameApiPlugin(): Plugin { const api = createGameApi(); return { name: 'chatjipiti-game-api', configureServer(server) { server.middlewares.use((request, response, next) => { void serveApi(api, request, response).then(handled => { if (!handled) next(); }).catch(next); }); } }; }
