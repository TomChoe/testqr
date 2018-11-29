const cacheName = "To-Do-App-v1";      // cache for local assets
const dataCacheName = "toDoApp-data";  // cache for dynamic data

const filesToCache = [				   // local assets 
	'/',
	'/index.html',
	'/bootstrap.min.css',
	'/main.js',
	'/bootstrap.min.js',
	'/qr-scanner.js',
	'/qr-scanner.min.js',
	'/qr-scanner-worker.min.js'
];

self.addEventListener('install', async e => {
	console.log('service worker install');
	const cache = await caches.open(cacheName);
	await cache.addAll(filesToCache);
})

self.addEventListener('activate', async e => {
	console.log('service worker activating');
	const keys = await caches.keys();

	await keys.map(key => {
		if (key !== cacheName) {
			console.log('removing old cache', key);
			caches.delete(key);
		}
	});
	return self.clients.claim();
})

self.addEventListener('fetch', async e => {
	const req = e.request;
	const dataUrl = 'https://tomchoe.github.io/testqr';

	if(req.url.indexOf(dataUrl) > -1) {
		e.respondWith(networkFirst(req));
	} else {
		e.respondWith(cacheFirst(req));
	}
});

async function cacheFirst(req) {
	const cache = await caches.open(cacheName);
	const cachedResponse = await cache.match(req);
	return cachedResponse || networkFirst(req);
};

async function networkFirst(req) {
	const cache = await caches.open(cacheName);
	try {
		console.log('fetching fresh data')
		const fresh = await fetch(req);
		cache.put(req, fresh.clone());
		return fresh;
	} catch (e) {
		console.log('falling back to cached data')
		const cachedResponse = await cache.match(req);
		return cachedResponse
	}
};

// interacting with the push notification api
self.addEventListener('notificationclose', (e) => {
	let notification = e.notification;
	let primaryKey = notification.data.primaryKey;

	console.log('Closed notification: ' + primaryKey);
});

// listening for push event
self.addEventListener('push', e => {
	console.log('this is from the server');
	const data = e.data.json();
	self.registration.showNotification(data.title, {
		body: 'this from the server!!!!!!'
	})
});

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
});
