
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Monetize Your Film?</h2>
        <p className="text-xl max-w-2xl mx-auto mb-8 opacity-90">
          Join our platform today and turn your creative work into a revenue stream.
          Our team of distribution experts is ready to help.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" variant="secondary" className="gap-2" asChild>
            <Link to="/submit-film">Submit Your Project <ArrowRight className="h-4 w-4" /></Link>
          </Button>
          <Button size="lg" variant="outline" className="bg-white/10 gap-2" asChild>
            <Link to="/contact">Contact Our Team</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
