/* arga. Хувийн санхүү — офлайн кэш. Шинэ хувилбар гаргах бүрт VERSION-ийг өөрчилнө. */
const VERSION='arga-v5.0.0';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
  e.respondWith(caches.open(VERSION).then(async cache=>{
    const hit=await cache.match(req,{ignoreSearch:true})||(req.mode==='navigate'?await cache.match('./index.html'):undefined);
    const net=fetch(req).then(res=>{if(res&&res.ok)cache.put(req,res.clone());return res}).catch(()=>hit);
    return hit||net;
  }));
});
