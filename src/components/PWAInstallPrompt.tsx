
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
  const [debugInfo, setDebugInfo] = useState<string>("");
  const isMobile = useIsMobile();

  // Check if the app is already installed
  useEffect(() => {
    console.log("PWAInstallPrompt component mounted");
    
    // On iOS with Safari, we can check if the app is in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone || 
                        document.referrer.includes('android-app://');
    
    if (isStandalone) {
      console.log('App is already installed in standalone mode');
      setIsAppInstalled(true);
      setDebugInfo("App detected as installed (standalone mode)");
    }
    
    // Add listener for changes in display mode
    const displayModeMediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      console.log('Display mode changed:', e.matches ? 'standalone' : 'browser');
      setIsAppInstalled(e.matches);
    };
    
    displayModeMediaQuery.addEventListener('change', handleDisplayModeChange);
    
    // For Android and desktop, we can check through display mode
    window.addEventListener('appinstalled', () => {
      console.log('App successfully installed');
      setIsAppInstalled(true);
      setDebugInfo("App installed event fired");
      toast({
        title: "App Installed",
        description: "MoodSwang has been successfully installed on your device!",
      });
    });

    // Capture the install prompt event
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Prevent the default browser install prompt
      e.preventDefault();
      console.log('Before install prompt fired');
      setDebugInfo("Install prompt available");
      // Store the event for later use
      setInstallPrompt(e);
    };

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);

    // Debug info
    console.log('PWA install prompt initialized');
    console.log('Display mode:', window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser');
    console.log('User agent:', navigator.userAgent);

    // Check if we're on Chrome
    const isChrome = /Chrome/.test(navigator.userAgent) && !/Edge|Edg/.test(navigator.userAgent);
    // Check if we're on desktop
    const isDesktop = !isMobile && !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    
    if (isChrome && isDesktop) {
      console.log("Chrome on desktop detected, install prompt should be available");
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', () => setIsAppInstalled(true));
      displayModeMediaQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, [isMobile]);

  const handleInstallClick = async () => {
    if (!installPrompt) {
      console.log('No install prompt available');
      
      // Show manual installation instructions if no prompt is available
      if (navigator.userAgent.includes('Chrome') || navigator.userAgent.includes('Chromium')) {
        toast({
          title: "Installation Guide",
          description: "Click the menu button (⋮) in your browser and select 'Install MoodSwang'",
        });
      } else if (navigator.userAgent.includes('Firefox')) {
        toast({
          title: "Installation Guide",
          description: "Click the home icon in your address bar to install MoodSwang",
        });
      } else if (navigator.userAgent.includes('Safari')) {
        toast({
          title: "Installation Guide",
          description: "Click the share button and select 'Add to Home Screen'",
        });
      } else {
        toast({
          title: "Installation Guide",
          description: "Click the menu or settings button in your browser and look for 'Install' or 'Add to Home Screen'",
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
        description: "MoodSwang is being installed on your device.",
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

  // Force show the install button on desktop Chrome for testing
  const isDesktopChrome = 
    /Chrome/.test(navigator.userAgent) && 
    !/Edge|Edg|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  return (
    <Button 
      onClick={handleInstallClick} 
      size="sm" 
      variant="outline" 
      className="gap-2 border-primary"
    >
      <Download className="w-4 h-4" />
      Install App
      {process.env.NODE_ENV === "development" && debugInfo && (
        <span className="text-xs text-muted-foreground ml-1">({debugInfo})</span>
      )}
    </Button>
  );
};

export default PWAInstallPrompt;
