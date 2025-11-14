import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { setupPWAInstall } from './pwa-install.tsx';
import { setupRealtimeNotifications } from './notifications/setupRealtimeNotifications';
import InAppToast from './components/InAppToast';

let updateToast: HTMLDivElement | null = null;
const showUpdateToast = () => {
  if (updateToast) return;

  updateToast = document.createElement('div');
  updateToast.innerHTML = `
    <div style="position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#1d4ed8;color:white;padding:12px 24px;border-radius:12px;z-index:9999;font-family:system-ui;box-shadow:0 4px 20px rgba(0,0,0,0.3);display:flex;gap:12px;align-items:center;">
      <span>New version available!</span>
      <button id="reload-btn" style="background:white;color:#1d4ed8;font-weight:600;padding:6px 12px;border:none;border-radius:8px;cursor:pointer;">Reload</button>
    </div>
  `;
  document.body.appendChild(updateToast);

  document.getElementById('reload-btn')?.addEventListener('click', () => {
    navigator.serviceWorker.getRegistration().then(reg => {
      reg?.waiting?.postMessage({ type: 'SKIP_WAITING' });
    });
    window.location.reload();
  });
};

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('SW registered:', registration);

        setInterval(() => registration.update(), 20 * 1000);

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                showUpdateToast();
              }
            });
          }
        });
      })
      .catch((error) => console.error('SW registration failed:', error));
  });
}

setupPWAInstall();
setupRealtimeNotifications();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <>
      <InAppToast />
      <App />
    </>
  </StrictMode>
);