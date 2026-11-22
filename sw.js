const V='bayan-202611220950';
const FILES=['./','./index.html','./app.js?v=202611220950','./lex.js','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin)return;
  const isPage=e.request.mode==='navigate';
  e.respondWith(caches.open(V).then(async c=>{
    const hit=await c.match(isPage?'./index.html':e.request);
    const net=fetch(e.request).then(r=>{if(r.ok)c.put(isPage?'./index.html':e.request,r.clone());return r;}).catch(()=>hit);
    return isPage?(net.then(r=>r||hit)):(hit||net);
  }));
});
