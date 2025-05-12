
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import HowItWorks from "./pages/HowItWorks";
import FilmmakerDashboard from "./pages/FilmmakerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Auth from "./pages/Auth";
import AuthGuard from "./components/AuthGuard";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import { ensureStorageBuckets } from "./integrations/supabase/storage";
import PayPalSuccessHandler from "./components/PayPalSuccessHandler";
import { useAuth } from "./context/AuthContext";
import { supabase } from "./integrations/supabase/client";
import { toast } from "./components/ui/use-toast";
import Subscription from "./pages/Subscription";
import { AIChatBot } from "./components/dashboard/filmmaker/chat/AIChatBot";
import PWAInstallPrompt from "./components/PWAInstallPrompt";

const queryClient = new QueryClient();

const AppContent = () => {
  // Initialize storage buckets when app starts
  useEffect(() => {
    const initializeStorage = async () => {
      console.log("Initializing storage buckets...");
      await ensureStorageBuckets();
      console.log("Storage initialization completed");
    };

    initializeStorage();
  }, []);

  // Get actual userId from auth context
  const { user } = useAuth();

  // Setup real-time notification for new support agent messages
  useEffect(() => {
    if (!user?.id) return;
    
    const chatNotificationsChannel = supabase
      .channel('chat-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `sender_id=neq.${user.id}`
        },
        async (payload) => {
          const message = payload.new;
          
          // Check if this message is in a room for this user
          const { data: room } = await supabase
            .from('chat_rooms')
            .select('*')
            .eq('id', message.room_id)
            .eq('filmmaker_id', user.id)
            .single();
            
          if (room && message.sender_id) {
            // Get sender info if available
            const { data: profile } = await supabase
              .from('profiles')
              .select('first_name, last_name')
              .eq('id', message.sender_id)
              .single();
              
            const senderName = profile 
              ? `${profile.first_name || ''} ${profile.last_name || ''}`
              : 'Support agent';
              
            // Show notification
            toast({
              title: `New message from ${senderName}`,
              description: message.content.substring(0, 60) + (message.content.length > 60 ? '...' : ''),
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(chatNotificationsChannel);
    };
  }, [user?.id]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <PayPalSuccessHandler />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/subscription" element={
            <AuthGuard>
              <Subscription />
            </AuthGuard>
          } />
          <Route path="/dashboard" element={
            <AuthGuard>
              <FilmmakerDashboard />
            </AuthGuard>
          } />
          <Route path="/admin" element={
            <AuthGuard>
              <AdminDashboard />
            </AuthGuard>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <PWAInstallPrompt />
      {user?.id && (
        <Suspense fallback={<div className="fixed bottom-4 right-4 p-4 bg-background shadow-lg rounded-lg">Loading chat...</div>}>
          <AIChatBot userId={user.id} />
        </Suspense>
      )}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
