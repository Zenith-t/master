import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Monitor, Apple, CheckCircle } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [deviceType, setDeviceType] = useState<'android' | 'ios' | 'desktop' | 'unknown'>('unknown');

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Detect device type
    const userAgent = navigator.userAgent.toLowerCase();
    if (/android/.test(userAgent)) {
      setDeviceType('android');
    } else if (/iphone|ipad|ipod/.test(userAgent)) {
      setDeviceType('ios');
    } else if (/windows|macintosh|linux/.test(userAgent)) {
      setDeviceType('desktop');
    }

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show install prompt after 2 seconds
      setTimeout(() => {
        if (!sessionStorage.getItem('installPromptDismissed')) {
          setShowInstallPrompt(true);
        }
      }, 2000);
    };

    // Handle successful installation
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      setInstallSuccess(true);
      setTimeout(() => setInstallSuccess(false), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // For browsers that don't support beforeinstallprompt
    const timer = setTimeout(() => {
      if (!isInstalled && !deferredPrompt && !sessionStorage.getItem('installPromptDismissed')) {
        setShowInstallPrompt(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(timer);
    };
  }, [isInstalled, deferredPrompt]);

  const handleInstallClick = async () => {
    setIsInstalling(true);

    try {
      if (deferredPrompt) {
        // Use native install prompt
        console.log('Showing native install prompt');
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        console.log('User choice:', outcome);
        if (outcome === 'accepted') {
          setDeferredPrompt(null);
          setShowInstallPrompt(false);
          // Don't set success here, wait for appinstalled event
        } else {
          setIsInstalling(false);
        }
      } else {
        // Fallback for browsers without native support
        console.log('Using fallback installation method');
        
        if (deviceType === 'ios') {
          // iOS Safari specific
          alert('To install:\n1. Tap the Share button (⬆️)\n2. Select "Add to Home Screen"\n3. Tap "Add"');
        } else {
          // Other browsers
          alert('To install:\n1. Click the install icon in your browser address bar\n2. Or use browser menu → "Install app"');
        }
        
        setShowInstallPrompt(false);
        setIsInstalling(false);
      }
    } catch (error) {
      console.error('Installation failed:', error);
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    sessionStorage.setItem('installPromptDismissed', 'true');
  };

  const getDeviceIcon = () => {
    switch (deviceType) {
      case 'android':
        return <Smartphone className="h-8 w-8 text-green-600" />;
      case 'ios':
        return <Apple className="h-8 w-8 text-gray-800" />;
      case 'desktop':
        return <Monitor className="h-8 w-8 text-blue-600" />;
      default:
        return <Download className="h-8 w-8 text-blue-600" />;
    }
  };

  const getInstallText = () => {
    if (isInstalling) return 'Installing...';
    
    switch (deviceType) {
      case 'android':
        return 'Install Android App';
      case 'ios':
        return 'Install iPhone App';
      case 'desktop':
        return 'Install Desktop App';
      default:
        return 'Install Native App';
    }
  };

  // Success message
  if (installSuccess) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50">
        <div className="bg-green-600 text-white rounded-xl shadow-2xl p-6 animate-slide-up">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 mr-4" />
            <div>
              <h3 className="font-bold text-lg">App Installed Successfully!</h3>
              <p className="text-sm opacity-90">Check your home screen or desktop</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Don't show if already installed
  if (isInstalled) {
    return null;
  }

  if (!showInstallPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6 animate-slide-up">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl mr-4 shadow-lg">
              {getDeviceIcon()}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Install Zenith Tutors</h3>
              <p className="text-sm text-gray-600">Get the native app experience</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
            Works offline
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
            Lightning fast
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
            Native app experience
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="w-3 h-3 bg-orange-500 rounded-full mr-3"></span>
            No app store needed
          </div>
        </div>
        
        <button
          onClick={handleInstallClick}
          disabled={isInstalling}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isInstalling ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Installing App...
            </>
          ) : (
            <>
              <Download className="h-5 w-5 mr-3" />
              {getInstallText()}
            </>
          )}
        </button>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center font-medium">
            {deviceType === 'android' && "✅ One-click installation on Android"}
            {deviceType === 'ios' && "📱 Add to Home Screen via Safari Share button"}
            {deviceType === 'desktop' && "💻 Install as desktop application"}
            {deviceType === 'unknown' && "📲 Install as native app on your device"}
          </p>
        </div>

        <div className="mt-3 text-center">
          <p className="text-xs text-blue-600 font-semibold">
            🚀 Click once to install automatically!
          </p>
        </div>
      </div>
    </div>
  );
}