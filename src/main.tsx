import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { setupPWAInstall } from './pwa-install.tsx';

// ✅ Notifications
import { setupRealtimeNotifications } from './notifications/setupRealtimeNotifications';
import InAppToast from './components/InAppToast';

// ------------------------------
// ✅ Register Service Worker
// ------------------------------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration);

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                if (confirm('New version available! Reload to update?')) {
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  window.location.reload();
                }
              }
            });
          }
        });
      })
      .catch((error) => console.error('Service Worker registration failed:', error));
  });
}

// ✅ Setup PWA install prompt
setupPWAInstall();

// ✅ Setup Realtime Notifications
setupRealtimeNotifications();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <>
      {/* ✅ Toast for fallback (if notification permission denied) */}
      <InAppToast />

      <App />
    </>
  </StrictMode>
);
