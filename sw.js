/**
 * ================================================================
 * 🛍️ تەكلىماكان سودا سۇپىسى — Service Worker (sw.js)
 * تېلېفون خەۋەرلەندۈرۈشى (Web Push) ۋە كۆپ تىللىق ئەسكەرتىش بىر تەرەپ قىلغۇچ
 * ================================================================
 */

const CACHE_NAME = 'teklimakan-sw-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// 📲 تېلېفون ئېكرانىغا Push ئەسكەرتىشى كەلگەندە ئىجرا بولۇش
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = {
        title: 'تەكلىماكان سودا تورى',
        body: event.data.text()
      };
    }
  }

  const title = data.title || 'تەكلىماكان سودا تورى';
  const lang = data.lang || 'ug';
  const isRtl = lang === 'ug';

  const options = {
    body: data.body || 'يېڭى ئېتىبار پائالىيىتى ۋە يېڭى مەھسۇلاتلارنى كۆرۈپ بېقىڭ!',
    icon: data.icon || '/images/logo_circle.png',
    badge: data.badge || '/images/favicon-32x32.png',
    image: data.image || null,
    dir: isRtl ? 'rtl' : 'ltr',
    lang: lang,
    tag: data.tag || ('teklimakan-push-' + Date.now()),
    renotify: true,
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// 👆 خېرىدار خەۋەرلەندۈرۈشنى چەككەندە شۇ مەھسۇلات ياكى بەتكە ئېچىپ بېرىش
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = (event.notification.data && event.notification.data.url) 
    ? event.notification.data.url 
    : '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client && client.url.includes(self.location.origin)) {
          if ('navigate' in client) {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
