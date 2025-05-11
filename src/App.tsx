import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import { useEffect } from "react";
import { ensureStorageBuckets } from "./integrations/supabase/storage";
import PayPalSuccessHandler from "./components/PayPalSuccessHandler";
import { AIChatBot } from "./components/dashboard/filmmaker/AIChatBot";
import { useAuth } from "./context/AuthContext";

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
              <Navigate to="/dashboard?tab=packages" replace />
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
      <AuthGuard>
        <AIChatBot userId={user?.id || ""} /> {/* Use actual user ID from auth context */}
      </AuthGuard>
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
