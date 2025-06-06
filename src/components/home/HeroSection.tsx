
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Info } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-r from-primary/90 to-primary py-20 text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Turn Your Film Into Fortune
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            We distribute and monetize your films, short films and trailers while you focus on creating.
            Join successful filmmakers who are earning real revenue through our platform.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="gap-2" asChild>
              <Link to="/how-it-works">Learn How It Works <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2 bg-white/10" asChild>
              <Link to="/auth">
                Sign Up to Submit Your Film <Info className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
