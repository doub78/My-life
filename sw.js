const CACHE = 'life-os-v5'
const BASE = '/My-life'
const ASSETS = [BASE+'/', BASE+'/index.html', BASE+'/manifest.json', BASE+'/icon.svg']

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)))
  self.skipWaiting()
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', e => {
  // Network-first: always try network, update cache, fall back to cache offline
  e.respondWith(
    fetch(e.request).then(res => {
      const clone = res.clone()
      caches.open(CACHE).then(c => c.put(e.request, clone))
      return res
    }).catch(() =>
      caches.match(e.request).then(r => r || caches.match(BASE + '/index.html'))
    )
  )
})
