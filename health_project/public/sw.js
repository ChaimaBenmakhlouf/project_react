console.log('Service worker activé');

// Écouteur pour l'événement "push"
self.addEventListener('push', event => {
  console.log('Événement push reçu');

  const handlePush = async () => {
    // Vérifie si un payload (données) est reçu dans la notification
    if (event.data) {
      const payload = event.data.json();
      console.log('Payload reçu:', payload);

      // Options pour afficher la notification
      const options = {
        body: payload.notification.body || 'Message par défaut',
        icon: payload.notification.icon || 'assets/icons/icon-384x384.png', // Chemin vers ton icône
        badge: payload.notification.badge || 'assets/icons/badge-128x128.png', // Badge de notification
        data: payload.notification.data || {}, // Données associées à la notification
        vibrate: [200, 100, 200], // Exemple de vibration
        actions: payload.notification.actions || [], // Boutons d'action
      };

      // Affiche la notification
      return self.registration.showNotification(
        payload.notification.title || 'Notification',
        options
      );
    } else {
      console.error('Pas de données dans l\'événement push');
    }
  };

  // Gère les erreurs si quelque chose tourne mal
  event.waitUntil(
    handlePush().catch(error => console.error('Erreur dans handlePush:', error))
  );
});

// Écouteur pour gérer les clics sur les notifications
self.addEventListener('notificationclick', event => {
  console.log('Notification cliquée:', event);

  const notification = event.notification;
  const action = event.action;

  if (notification.data && notification.data.url) {
    event.waitUntil(
      clients.openWindow(notification.data.url)
    );
  }

  notification.close();
});
