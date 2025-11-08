import React, { useState, useEffect } from 'react';
import { usePWA } from '../contexts/PWAContext';
import { Download, X } from 'lucide-react';

export function InstallPrompt() {
  const { isInstallable, installApp, dismissInstallPrompt } = usePWA();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isInstallable) {
      setShow(true);
    }
  }, [isInstallable]);

  if (!show) {
    return null;
  }

  const handleInstall = () => {
    installApp();
    setShow(false);
  };

  const handleDismiss = () => {
    dismissInstallPrompt();
    setShow(false);
  };

  return (
    <div className="fixed bottom-4 right-4 max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Download className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Install App</h3>
              <p className="text-sm text-gray-600">Get quick access on your device</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleInstall}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
}
