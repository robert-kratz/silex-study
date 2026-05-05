const CACHE_NAME = 'silex-study-v1'

// Precache the app shell on install
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) =>
            cache.addAll(['/'])
        )
    )
    self.skipWaiting()
})

// Remove old caches on activate
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            )
        )
    )
    self.clients.claim()
})

// Network-first strategy: always try the network, fall back to cache
self.addEventListener('fetch', (event) => {
    // Only handle GET requests for same-origin or same-site resources
    if (event.request.method !== 'GET') return
    if (!event.request.url.startsWith(self.location.origin)) return

    // Skip Next.js internal routes and API routes
    const url = new URL(event.request.url)
    if (
        url.pathname.startsWith('/_next/') ||
        url.pathname.startsWith('/api/')
    ) return

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Cache successful responses
                if (response.ok) {
                    const clone = response.clone()
                    caches.open(CACHE_NAME).then((cache) =>
                        cache.put(event.request, clone)
                    )
                }
                return response
            })
            .catch(() => caches.match(event.request))
    )
})
