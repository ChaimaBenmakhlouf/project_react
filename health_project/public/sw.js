console.log('Service worker activé');

// Gérer l'événement `push`
self.addEventListener('push', (event) => {
  console.log('Push reçu:', event.data ? event.data.text() : 'Pas de données');
  const data = event.data ? event.data.json() : {};

  const options = {
    body: data.notification.body || 'Notification sans contenu',
    icon: data.notification.icon || '/icon.png',
    vibrate: [200, 100, 200],
    badge: '/badge.png',
    actions: data.notification.actions || [],
    data: data.notification.data || {}
  };

  event.waitUntil(
    self.registration.showNotification(data.notification.title || 'Titre manquant', options)
  );
});

// Gérer les clics sur la notification
self.addEventListener('notificationclick', (event) => {
  console.log('Notification cliquée:', event.notification);
  event.notification.close();

  // Gestion de l'action ou navigation vers une URL
  const url = event.notification.data.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (let client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
