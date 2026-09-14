const V='ocs-v6';
const CORE=['./','./index.html','./logo-ocs.png','./manifest.json'];
self.addEventListener('install',e=>{
 e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
 e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const u=new URL(e.request.url);
 if(u.origin.includes('firebasedatabase')||u.origin.includes('firebaseio'))return;
 e.respondWith(
  caches.match(e.request).then(hit=>{
   const net=fetch(e.request).then(res=>{
    if(res&&res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(e.request,cp));}
    return res;
   }).catch(()=>hit);
   return hit||net;
  })
 );
});
