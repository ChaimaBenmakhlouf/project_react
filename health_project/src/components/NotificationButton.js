import React, { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";

const publicVapidKey = 'BOb3wLZU9LkI4s0le38GSF26ItYtASTBEq1ZGy_3eP4SICVZNYSINcG1PLMirb3IToJ2KBs_mgr3ICO2DRk8Ajs';

const NotificationButton = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const subscribeUser = async () => {
    try {
      // Attendre que le Service Worker soit prêt
      const registration = await navigator.serviceWorker.ready;
      if (!registration) {
        console.error('Service Worker n\'est pas prêt pour la souscription');
        return;
      }
  
      // Vérification de la permission de notification
      if (Notification.permission === 'denied') {
        console.error('Les notifications sont bloquées par l\'utilisateur');
        return;
      } else if (Notification.permission !== 'granted') {
        await Notification.requestPermission();
      }
  
      // Créer la souscription
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      });
  
      // Récupérer le token pour l'authentification
      const token = await getAccessTokenSilently();
  
      // Envoyer la souscription au backend
      await fetch('http://localhost:3001/api/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log('Souscription réussie:', subscription);
      setIsSubscribed(true);
    } catch (error) {
      console.error('Erreur lors de la souscription:', error);
    }
  };

  return (
    <button onClick={subscribeUser} disabled={isSubscribed}>
      {isSubscribed ? 'Souscrit aux Notifications' : 'S’abonner aux Notifications'}
    </button>
  );
};

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default NotificationButton;
