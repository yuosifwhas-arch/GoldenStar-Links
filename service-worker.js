const CACHE_NAME = 'golden-star-v1';
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './menu.json',
    // الأيقونات اللازمة لـ PWA
    './images/icon-192x192.png', 
    './images/icon-512x512.png',
    // المكتبات الأساسية (يمكن إضافة المزيد)
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap',
    'https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js'
];

// تثبيت عامل الخدمة وتخزين الملفات
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// اعتراض طلبات الشبكة وتقديم الملفات من التخزين المؤقت (Cache)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // تقديم الملف من التخزين المؤقت إذا كان متاحًا
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

// تفعيل عامل الخدمة وتنظيف التخزين المؤقت القديم
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
