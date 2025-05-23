
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogIn, User as UserIcon, Download } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";
import PWAInstallPrompt from "./PWAInstallPrompt";

const Header = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log out",
        variant: "destructive",
      });
    }
  };

  const isAuthenticated = !!session;

  // Navigation items for all users - public routes
  const publicNavItems = [
    { name: "Home", path: "/" },
    { name: "How It Works", path: "/how-it-works" },
  ];

  // Additional navigation items for authenticated users
  const authenticatedNavItems = [
    ...publicNavItems,
    { name: "My Dashboard", path: "/dashboard" },
  ];

  const navItems = isAuthenticated ? authenticatedNavItems : publicNavItems;

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border/40 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="font-bold text-xl text-primary flex items-center">
            <img 
              src="/lovable-uploads/130ac2b7-3097-4b9f-91af-63edb898f0eb.png" 
              alt="MoodSwang Logo" 
              className="h-8 mr-2" 
            />
            <span>SceneVox</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <PWAInstallPrompt />
            {isAuthenticated ? (
              <>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
                <Button size="sm" asChild>
                  <Link to="/dashboard">
                    <UserIcon className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/auth">
                    <LogIn className="w-4 h-4 mr-2" />
                    Login / Sign Up
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/how-it-works">
                    Learn More
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col space-y-4 mt-8">
                  <div className="flex items-center mb-4">
                    <img 
                      src="/lovable-uploads/0d52698e-5b20-4505-a780-227a7f6d6a1a.png" 
                      alt="MoodSwang Logo" 
                      className="h-10 mr-2" 
                    />
                    <span className="font-bold text-xl">SceneVox</span>
                  </div>
                  
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="text-lg font-medium hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="pt-4 space-y-4">
                    <div className="mb-2">
                      <PWAInstallPrompt />
                    </div>
                    {isAuthenticated ? (
                      <>
                        <Button variant="outline" className="w-full" onClick={handleLogout}>
                          Logout
                        </Button>
                        <Button className="w-full" asChild>
                          <Link to="/dashboard">
                            <UserIcon className="w-4 h-4 mr-2" />
                            Dashboard
                          </Link>
                        </Button>
                      </>
                    ) : (
                      <Button className="w-full" asChild>
                        <Link to="/auth">
                          <LogIn className="w-4 h-4 mr-2" />
                          Login / Sign Up
                        </Link>
                      </Button>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
