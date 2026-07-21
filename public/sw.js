// Service Worker for CareerPath Web Push Reminders
self.addEventListener('push', function (event) {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = {
        title: 'Roadmap.DEV - Nhắc Học',
        body: event.data.text() || 'Đã đến giờ luyện tập bài học hôm nay!',
        url: '/dashboard'
      };
    }
  }

  const title = data.title || 'Roadmap.DEV - Nhắc Học';
  const options = {
    body: data.body || 'Đã đến giờ giữ streak bài học hôm nay! Đừng bỏ lỡ nhé!',
    icon: data.icon || '/favicon.svg',
    badge: '/favicon.svg',
    data: {
      url: data.url || '/dashboard'
    },
    vibrate: [200, 100, 200],
    actions: [
      { action: 'open', title: 'Học ngay' },
      { action: 'close', title: 'Để sau' }
    ]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  if (event.action === 'close') return;

  const targetUrl = event.notification.data && event.notification.data.url ? event.notification.data.url : '/dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
