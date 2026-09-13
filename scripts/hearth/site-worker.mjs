const origin='https://raw.githubusercontent.com/fabianchua6/chatjipiti-game/hearth-published/';
const types={html:'text/html; charset=utf-8',js:'text/javascript; charset=utf-8',css:'text/css; charset=utf-8',json:'application/json',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',svg:'image/svg+xml',webp:'image/webp',woff2:'font/woff2',woff:'font/woff',ico:'image/x-icon'};
export default {async fetch(request){
 const url=new URL(request.url);
 if(!['GET','HEAD'].includes(request.method))return Response.json({error:'Live artwork generation is available only in the local studio.'},{status:405});
 if(url.pathname==='/api/status')return Response.json({configured:false});
 if(url.pathname==='/api/assets')return Response.json({assets:[]});
 if(url.pathname.startsWith('/api/'))return Response.json({error:'This hosted arcade serves tested games. Live artwork generation requires the local studio.'},{status:404});
 const path=url.pathname;
 if(!/^\/[a-zA-Z0-9_./@ -]*$/.test(path)||path.includes('..')||path.includes('//'))return new Response('Not found',{status:404});
 try{
  const pointer=await fetch(origin+'release.json?check='+Math.floor(Date.now()/15000),{cf:{cacheTtl:0},signal:AbortSignal.timeout(10000)});
  if(!pointer.ok)throw Error('Release unavailable');
  const release=await pointer.json();
  if(!/^[a-zA-Z0-9-]{1,80}$/.test(release.buildId)||!/^[a-f0-9]{40}$/.test(release.sourceSha))throw Error('Invalid release');
  const file=path==='/'||path==='/index.html'?`builds/${release.buildId}/index.html`:path.startsWith('/builds/')?path.slice(1):`builds/${release.buildId}${path}`;
  const ext=file.split('.').pop();if(!types[ext])return new Response('Not found',{status:404});
  const asset=await fetch(origin+file,{signal:AbortSignal.timeout(10000)});
  if(!asset.ok)return new Response('Not found',{status:404});
  return new Response(request.method==='HEAD'?null:asset.body,{headers:{'Content-Type':types[ext],'X-Content-Type-Options':'nosniff','X-Studio-Source-Sha':release.sourceSha,'Cache-Control':ext==='html'?'no-store':'public,max-age=300','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-src 'none'",'Referrer-Policy':'no-referrer'}});
 }catch{return new Response('The arcade release is temporarily unavailable. Please retry shortly.',{status:503,headers:{'Retry-After':'15'}});}
}};
