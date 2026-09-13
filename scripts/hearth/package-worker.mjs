import {mkdir,copyFile} from 'node:fs/promises';
await mkdir('dist/server',{recursive:true});
await copyFile('scripts/hearth/site-worker.mjs','dist/server/index.js');
await mkdir('dist/.openai',{recursive:true});
await copyFile('.openai/hosting.json','dist/.openai/hosting.json');
