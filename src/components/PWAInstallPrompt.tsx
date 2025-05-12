
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

// Define the PWA install event type
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

const PWAInstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const isMobile = useIsMobile();

  // Check if the app is already installed
  useEffect(() => {
    // On iOS with Safari, we can check if the app is in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone || 
                        document.referrer.includes('android-app://');
    
    if (isStandalone) {
      console.log('App is already installed in standalone mode');
      setIsAppInstalled(true);
    }
    
    // For Android and desktop, we can check through display mode
    window.addEventListener('appinstalled', () => {
      console.log('App successfully installed');
      setIsAppInstalled(true);
      toast({
        title: "App Installed",
        description: "SceneVox has been successfully installed on your device!",
      });
    });

    // Capture the install prompt event
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Prevent the default browser install prompt
      e.preventDefault();
      console.log('Before install prompt fired');
      // Store the event for later use
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Debug info
    console.log('PWA install prompt initialized');
    console.log('Display mode:', window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser');

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', () => setIsAppInstalled(true));
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) {
      console.log('No install prompt available');
      
      // Show manual installation instructions if no prompt is available
      if (navigator.userAgent.includes('Chrome')) {
        toast({
          title: "Installation Guide",
          description: "Click the menu button (⋮) in your browser and select 'Install SceneVox'",
        });
      } else if (navigator.userAgent.includes('Firefox')) {
        toast({
          title: "Installation Guide",
          description: "Click the home icon in your address bar to install SceneVox",
        });
      } else if (navigator.userAgent.includes('Safari')) {
        toast({
          title: "Installation Guide",
          description: "Click the share button and select 'Add to Home Screen'",
        });
      } else {
        toast({
          title: "Installation Not Available",
          description: "Your browser doesn't support automatic PWA installation. Please use Chrome, Firefox or Safari.",
          variant: "destructive",
        });
      }
      return;
    }

    // Show the install prompt
    console.log('Triggering install prompt');
    installPrompt.prompt();

    // Wait for the user to respond to the prompt
    const choiceResult = await installPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
      toast({
        title: "Installation Started",
        description: "SceneVox is being installed on your device.",
      });
      setInstallPrompt(null);
    } else {
      console.log('User dismissed the install prompt');
      toast({
        title: "Installation Declined",
        description: "You can install the app later from the header menu.",
      });
    }
  };

  // We'll always show the install button if we're in a browser context
  // unless we've specifically detected the app is already installed
  if (isAppInstalled) {
    console.log('App is installed, hiding install button');
    return null;
  }

  return (
    <Button 
      onClick={handleInstallClick} 
      size="sm" 
      variant="outline" 
      className="gap-2 border-primary"
    >
      <Download className="w-4 h-4" />
      Install App
    </Button>
  );
};

export default PWAInstallPrompt;
