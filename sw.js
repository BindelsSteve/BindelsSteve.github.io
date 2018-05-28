/*// Chrome's currently missing some useful cache methods,
// this polyfill adds them.
importScripts('serviceworker-cache-polyfill.js');

// Here comes the install event!
// This only happens once, when the browser sees this
// version of the ServiceWorker for the first time.
self.addEventListener('install', function(event) {
  // We pass a promise to event.waitUntil to signal how 
  // long install takes, and if it failed
  event.waitUntil(
    // We open a cache…
    caches.open('simple-sw-v1').then(function(cache) {
      // And add resources to it
      return cache.addAll([
        './',
        'css/style.css',
        'js/index.js',
        'starwars.html',
        'css/starwarsintro.css',
        'manifest.json',
        'js/script.js',
        'icons/icon-72x72.png',
        'icons/icon-96x96.png',
        'icons/icon-128x128.png',
        'icons/icon-144x144.png',
        'icons/icon-152x152.png',
        'icons/icon-192x192.png',
        'icons/icon-384x384.png',
        'icons/icon-512x512.png'
      ]);
    })
  );
});

// The fetch event happens for the page request with the
// ServiceWorker's scope, and any request made within that
// page
self.addEventListener('fetch', function(event) {
  // Calling event.respondWith means we're in charge
  // of providing the response. We pass in a promise
  // that resolves with a response object
  event.respondWith(
    // First we look for something in the caches that
    // matches the request
    caches.match(event.request).then(function(response) {
      // If we get something, we return it, otherwise
      // it's null, and we'll pass the request to
      // fetch, which will use the network.
      return response || fetch(event.request);
    })
  );
});*/

const cacheFiles = [
  './',
  'css/style.css',
  'js/index.js',
  'starwars.html',
  'css/starwarsintro.css',
  'manifest.json',
  'js/script.js',
  'icons/icon-72x72.png',
  'icons/icon-96x96.png',
  'icons/icon-128x128.png',
  'icons/icon-144x144.png',
  'icons/icon-152x152.png',
  'icons/icon-192x192.png',
  'icons/icon-384x384.png',
  'icons/icon-512x512.png'];

const cacheName = 'v2';

self.addEventListener('install',function (e) {
e.waitUntil(
  caches.open(cacheName).then(function(cache){
      console.log("ServiceWorker Caching cache files");
      return cache.addAll(cacheFiles)
  })
)
});

self.addEventListener('activate', function(event) {
  // Delete all caches that aren't named in CURRENT_CACHES.
  // While there is only one cache in this example, the same logic will handle the case where
  // there are multiple versioned caches.
  var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function(key) {
      return CURRENT_CACHES[key];
  });

  event.waitUntil(
      caches.keys().then(function(cacheNames) {
          return Promise.all(
              cacheNames.map(function(cacheName) {
                  if (expectedCacheNames.indexOf(cacheName) === -1) {
                      // If this cache name isn't present in the array of "expected" cache names, then delete it.
                      console.log('Deleting out of date cache:', cacheName);
                      return caches.delete(cacheName);
                  }
              })
          );
      })
  );
});