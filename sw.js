var V="zmanim-v8";
var SHELL=["./","index.html","manifest.webmanifest","icon.svg"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(V).then(function(c){return c.addAll(SHELL)}).then(function(){return self.skipWaiting()}))});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==V}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener("fetch",function(e){
 var r=e.request;if(r.method!=="GET")return;
 var u=new URL(r.url);
 if(u.origin===location.origin){
  e.respondWith(fetch(r).then(function(res){var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp)});return res}).catch(function(){return caches.match(r,{ignoreSearch:true}).then(function(m){return m||caches.match("index.html")})}));
 }else if(u.hostname==="www.hebcal.com"){
  e.respondWith(fetch(r).then(function(res){if(res.ok){var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp)})}return res}).catch(function(){return caches.match(r).then(function(m){return m||new Response("{}",{status:503})})}));
 }
});

function zmDis(e){var d=e.notification.data||{};if(!d.key)return Promise.resolve();
 return caches.open("zm-dis").then(function(c){return c.put(self.registration.scope+"dis?k="+encodeURIComponent(d.key),new Response("1"))}).then(function(){return self.clients.matchAll({includeUncontrolled:true}).then(function(cs){cs.forEach(function(c){c.postMessage({zmDismiss:1,key:d.key})})})})}
self.addEventListener("notificationclick",function(e){e.notification.close();
 if(e.action==="dav"){e.waitUntil(zmDis(e));return}
 e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(function(cs){if(cs.length)return cs[0].focus();return self.clients.openWindow("./")}))});
self.addEventListener("notificationclose",function(e){e.waitUntil(zmDis(e))});
