import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { gameApiPlugin } from './server/vite.ts';
export default defineConfig({ plugins: [react(), gameApiPlugin()] });
