
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Film, CheckCircle, TrendingUp, DollarSign } from "lucide-react";

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/90 to-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              How Film Fortune Foundry Works
            </h1>
            <p className="text-lg md:text-xl mb-6 opacity-90">
              Your step-by-step guide to monetizing your film with our platform
            </p>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 gap-12">
              {[
                {
                  step: 1,
                  title: "Submit Your Film",
                  description: "Upload your film, trailer, and basic metadata through our easy submission system. We accept short films, documentaries, feature films and trailers in various formats.",
                  icon: <Film className="h-10 w-10" />,
                  details: [
                    "Prepare your completed film in MP4, MOV, or AVI format",
                    "Gather promotional materials like posters, stills, and a synopsis",
                    "Create an account on our platform",
                    "Fill out the submission form with your film details"
                  ]
                },
                {
                  step: 2,
                  title: "Select Your Distribution Package",
                  description: "Choose the right distribution package for your needs. We offer Basic ($250), Premium ($500), and Elite ($1,000) packages with different levels of service and platform reach.",
                  icon: <CheckCircle className="h-10 w-10" />,
                  details: [
                    "Basic Package ($250): Distribution to 3 free platforms with standard optimization",
                    "Premium Package ($500): Distribution to 5 platforms with custom trailer and press kit",
                    "Elite Package ($1,000): Distribution to 7 platforms with full marketing support",
                    "Custom add-ons available for specialized needs"
                  ]
                },
                {
                  step: 3,
                  title: "We Distribute Your Film",
                  description: "Our team handles the technical aspects of distribution, platform submissions, SEO optimization, and marketing based on your selected package.",
                  icon: <TrendingUp className="h-10 w-10" />,
                  details: [
                    "Our distribution specialists prepare your film for each platform",
                    "We optimize titles, descriptions, and metadata for maximum visibility",
                    "Your film is submitted to all platforms included in your package",
                    "Marketing activities begin according to your package level"
                  ]
                },
                {
                  step: 4,
                  title: "You Track and Earn Revenue",
                  description: "Monitor your film's performance and revenue through our dashboard. Receive your share of the revenue according to your tier level (Standard: 75%, Gold: 80%, Platinum: 85%).",
                  icon: <DollarSign className="h-10 w-10" />,
                  details: [
                    "Access your filmmaker dashboard to track views and revenue",
                    "View detailed analytics across all distribution platforms",
                    "Receive regular payments of your revenue share",
                    "Upgrade your tier as your revenue grows for better commission rates"
                  ]
                },
              ].map((item) => (
                <div key={item.step} className="border rounded-lg p-6 shadow-sm">
                  <div className="flex items-start gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                        {item.icon}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                        {item.step}
                      </div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-3">{item.title}</h2>
                      <p className="text-muted-foreground mb-6">{item.description}</p>
                      <div className="bg-muted rounded-md p-4">
                        <h3 className="font-semibold mb-2">Getting Started:</h3>
                        <ul className="space-y-2">
                          {item.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-primary font-bold">•</span>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Join successful filmmakers who are already earning revenue through our platform. Start monetizing your creative work today!
              </p>
              <Button size="lg" className="gap-2">
                Submit Your Film <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
