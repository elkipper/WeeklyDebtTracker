const CACHE_NAME =
"weekly-debt-tracker-v1";

const urlsToCache = [

"/",
"/index.html",
"/css/style.css",
"/js/app.js",
"/js/debts.js",
"/js/storage.js"

];

self.addEventListener(
"install",
event => {

event.waitUntil(

caches.open(CACHE_NAME)
.then(cache => {

return cache.addAll(
urlsToCache
);

})

);

});