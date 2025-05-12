
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Define the PWA install event type
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  // Check if the app is already installed
  useEffect(() => {
    // On iOS with Safari, we can check if the app is in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsAppInstalled(true);
    }
    
    // For Android, we can check through display mode
    window.addEventListener('appinstalled', () => {
      setIsAppInstalled(true);
      toast({
        title: "App Installed",
        description: "SceneVox has been successfully installed on your device!",
      });
    });

    // Capture the install prompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the default browser install prompt
      e.preventDefault();
      // Store the event for later use
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', () => setIsAppInstalled(true));
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) {
      toast({
        title: "Installation Not Available",
        description: "Your browser doesn't support PWA installation or the app is already installed.",
        variant: "destructive",
      });
      return;
    }

    // Show the install prompt
    installPrompt.prompt();

    // Wait for the user to respond to the prompt
    const choiceResult = await installPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      toast({
        title: "Installation Started",
        description: "SceneVox is being installed on your device.",
      });
      setInstallPrompt(null);
    } else {
      toast({
        title: "Installation Declined",
        description: "You can install the app later from the header menu.",
      });
    }
  };

  // Don't show install button if the app is already installed or can't be installed
  if (isAppInstalled || !installPrompt) {
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
