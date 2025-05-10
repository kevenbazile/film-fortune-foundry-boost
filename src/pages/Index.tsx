
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Film, TrendingUp, DollarSign, BarChart } from "lucide-react";
import ServicePackageCard from "@/components/ServicePackageCard";

// Sample data for service packages
const servicePackages = [
  {
    id: "basic",
    title: "Basic Distribution",
    price: "$250",
    features: [
      "Distribution to 3 free platforms",
      "Basic SEO optimization",
      "Standard thumbnail creation",
      "Monthly performance reporting",
      "25% commission on revenue",
    ],
    platforms: ["YouTube", "Tubi", "SceneVox"],
    timeline: "2 weeks",
    highlighted: false,
  },
  {
    id: "premium",
    title: "Premium Distribution",
    price: "$500",
    features: [
      "Distribution to 5 platforms",
      "Custom trailer creation",
      "Press kit development",
      "2 film festival submissions",
      "Social media package (5 posts)",
      "20% commission on revenue",
    ],
    platforms: ["YouTube", "SceneVox", "Tubi", "Pluto TV"],
    timeline: "3 weeks",
    highlighted: true,
  },
  {
    id: "elite",
    title: "Elite Distribution",
    price: "$1,000",
    features: [
      "Distribution to 7 platforms",
      "Comprehensive marketing campaign",
      "5 film festival submissions",
      "Press outreach (10 outlets)",
      "Complete social media campaign",
      "Filmmaker feature interview",
      "15% commission on revenue",
    ],
    platforms: [
      "YouTube",
      "SceneVox",
      "Hulu",
      "Tubi",
      "Pluto TV", 
      "Amazon Prime",
      "Netflix",
    ],
    timeline: "4 weeks",
    highlighted: false,
  },
];

// Sample testimonial data
const testimonials = [
  {
    quote: "Film Fortune Foundry helped me earn over $3,000 with my short film in just 6 months. Their distribution network is unmatched!",
    author: "Maria Santiago",
    film: "The Last Echo",
    revenue: "$3,200",
  },
  {
    quote: "As a first-time filmmaker, I had no idea how to monetize my work. The Basic package paid for itself within weeks.",
    author: "James Chen",
    film: "Neon Dreams",
    revenue: "$2,800",
  },
  {
    quote: "We've tried multiple distribution services, but none delivered the ROI that Film Fortune Foundry has. The elite package was worth every penny.",
    author: "Alex Johnson",
    film: "Silent Road",
    revenue: "$4,100",
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/90 to-primary py-20 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Turn Your Film Into Fortune
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              We distribute and monetize your short films and trailers while you focus on creating.
              Join successful filmmakers who are earning real revenue through our platform.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="gap-2">
                Submit Your Project <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2 bg-white/10">
                Explore Our Services
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-lg">
              <div className="text-4xl font-bold text-primary mb-2">$280K+</div>
              <p className="text-muted-foreground">Revenue Generated For Filmmakers</p>
            </div>
            <div className="p-6 rounded-lg">
              <div className="text-4xl font-bold text-primary mb-2">350+</div>
              <p className="text-muted-foreground">Films Successfully Distributed</p>
            </div>
            <div className="p-6 rounded-lg">
              <div className="text-4xl font-bold text-primary mb-2">12+</div>
              <p className="text-muted-foreground">Distribution Platforms</p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Packages */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Service Packages</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect distribution package for your film and start earning revenue today.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {servicePackages.map((pkg) => (
              <ServicePackageCard key={pkg.id} package={pkg} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild>
              <Link to="/services">See Full Package Details</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: "Submit Your Film",
                description: "Upload your film, trailer, and metadata through our easy submission system",
                icon: <Film className="h-10 w-10" />,
              },
              {
                step: 2,
                title: "Select Your Package",
                description: "Choose from our distribution and marketing packages based on your needs",
                icon: <CheckCircle className="h-10 w-10" />,
              },
              {
                step: 3,
                title: "We Distribute",
                description: "Our team handles placement across multiple streaming platforms",
                icon: <TrendingUp className="h-10 w-10" />,
              },
              {
                step: 4,
                title: "You Earn",
                description: "Track your revenue and receive your share through our dashboard",
                icon: <DollarSign className="h-10 w-10" />,
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {item.icon}
                </div>
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Structure */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Clear Commission Structure</h2>
              <p className="text-xl text-muted-foreground">
                Our transparent commission system rewards your success with better rates as you grow.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  tier: "Standard Tier",
                  commission: "25%",
                  description: "For new filmmakers just starting their journey with us",
                  color: "border-gray-200",
                },
                {
                  tier: "Gold Tier",
                  commission: "20%",
                  description: "After your first successful project with us",
                  color: "border-yellow-500",
                },
                {
                  tier: "Platinum Tier",
                  commission: "15%",
                  description: "For established filmmakers with proven revenue history",
                  color: "border-purple-500",
                },
              ].map((tier) => (
                <div
                  key={tier.tier}
                  className={`border-2 ${tier.color} rounded-lg p-6 text-center hover:shadow-lg transition-shadow`}
                >
                  <h3 className="text-xl font-semibold mb-2">{tier.tier}</h3>
                  <div className="text-4xl font-bold text-primary my-4">{tier.commission}</div>
                  <p className="text-muted-foreground">{tier.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real filmmakers, real results. See how our platform is helping creators like you.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-background p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="italic mb-4">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-muted-foreground text-sm mb-2">
                    {testimonial.film}
                  </p>
                  <div className="flex items-center gap-1 text-primary">
                    <BarChart className="h-4 w-4" />
                    <span className="font-bold">{testimonial.revenue}</span> revenue generated
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Monetize Your Film?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8 opacity-90">
            Join our platform today and turn your creative work into a revenue stream.
            Our team of distribution experts is ready to help.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" className="gap-2">
              Submit Your Project <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 gap-2">
              Contact Our Team
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
