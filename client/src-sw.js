const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

//Registers the service worker's routes, using the CacheFirst strategy above, then falls back to the offlineFallback page if the user is offline
registerRoute(({ request }) => request.mode === 'navigate', async ({ event }) => {
  try {
    return await pageCache.handle({ event });
  } catch {
    return await caches.match(offlineFallback);
  }
});

// This will cache assets like scripts, styles, and images so that they can be served from the cache when the user is offline.
registerRoute(
  ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
  
  // This will cache the assets using the StaleWhileRevalidate strategy, which will return the cached response immediately if available, falling back to the network if it's not cached.
  new StaleWhileRevalidate({
    cacheName: 'asset-cache',
    // This changes the default maximum age of entries in the cache to 30 days
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);
