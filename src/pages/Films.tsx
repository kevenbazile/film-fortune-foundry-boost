
import React from "react";
import { Link } from "react-router-dom";
import FilmCard from "@/components/FilmCard";
import ServicePackageCard from "@/components/ServicePackageCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Clapperboard, TrendingUp } from "lucide-react";

// Sample data - in a real app, this would come from your database
const featuredFilms = [
  {
    id: 1,
    title: "The Last Echo",
    director: "Maria Santiago",
    duration: "18 min",
    thumbnail: "/lovable-uploads/18a9774a-40a2-4f04-ae41-6477388e7107.png",
    revenue: "$3,200",
    platforms: ["Amazon Prime", "Tubi", "YouTube"],
    genre: "Drama",
  },
  {
    id: 2,
    title: "Neon Dreams",
    director: "James Chen",
    duration: "12 min",
    thumbnail: "/lovable-uploads/6c50ca2a-f540-4f64-96d0-a86f487346da.png",
    revenue: "$2,800",
    platforms: ["Vimeo", "TikTok", "Pluto TV"],
    genre: "Sci-Fi",
  },
  {
    id: 3,
    title: "Silent Road",
    director: "Alex Johnson",
    duration: "22 min",
    thumbnail: "/placeholder.svg",
    revenue: "$4,100",
    platforms: ["Amazon Prime", "Xumo", "Tubi"],
    genre: "Thriller",
  },
];

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
    platforms: ["YouTube", "Vimeo", "TikTok"],
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
    platforms: ["YouTube", "Vimeo", "TikTok", "Tubi", "Pluto TV"],
    timeline: "3 weeks",
    highlighted: true,
  },
  {
    id: "elite",
    title: "Elite Distribution & Marketing",
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
      "Vimeo",
      "TikTok",
      "Tubi",
      "Pluto TV",
      "Amazon Prime",
      "Xumo",
    ],
    timeline: "4 weeks",
    highlighted: false,
  },
];

const Films = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-6">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-primary">
            Turn Your Film Into Fortune
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            We distribute and monetize your short films and trailers - you focus on creating.
            Join successful filmmakers who are earning revenue through our platform.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="gap-2">
              Submit Your Project <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              Explore Our Services
            </Button>
          </div>
        </section>

        {/* Featured Films */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Featured Success Stories</h2>
            <Link to="/success-stories" className="text-primary flex items-center gap-2 hover:underline">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredFilms.map((film) => (
              <FilmCard key={film.id} film={film} />
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-muted p-8 rounded-2xl mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: "Submit",
                description:
                  "Filmmakers submit their short film or trailer",
                icon: <Clapperboard className="h-10 w-10" />,
              },
              {
                step: 2,
                title: "Select Services",
                description: "Choose from our distribution and marketing packages",
                icon: <TrendingUp className="h-10 w-10" />,
              },
              {
                step: 3,
                title: "We Distribute",
                description: "We handle placement on multiple platforms",
                icon: <ArrowRight className="h-10 w-10" />,
              },
              {
                step: 4,
                title: "You Earn",
                description:
                  "Receive your share of revenue (after our commission)",
                icon: <TrendingUp className="h-10 w-10" />,
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex flex-col items-center text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Service Packages</h2>
          
          <Tabs defaultValue="packages" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="packages">Distribution Packages</TabsTrigger>
              <TabsTrigger value="addons">À La Carte Services</TabsTrigger>
            </TabsList>
            
            <TabsContent value="packages">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {servicePackages.map((pkg) => (
                  <ServicePackageCard key={pkg.id} package={pkg} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="addons">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    title: "Festival Submission",
                    price: "$75",
                    description: "Per festival submission including selection, application preparation, and submission fee handling",
                  },
                  {
                    title: "Enhanced Press Kit",
                    price: "$200",
                    description: "Professional press release, filmmaker bio, high-quality stills, press-ready trailer",
                  },
                  {
                    title: "Social Media Campaign",
                    price: "$150",
                    description: "10 posts across platforms with targeted hashtag strategy",
                  },
                  {
                    title: "Sales Agent Representation",
                    price: "$350 + 5%",
                    description: "Pitch your film to distributors and negotiate licensing deals",
                  },
                ].map((addon, idx) => (
                  <div key={idx} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold">{addon.title}</h3>
                      <div className="text-xl font-bold text-primary">{addon.price}</div>
                    </div>
                    <p className="text-muted-foreground mb-4">{addon.description}</p>
                    <Button variant="outline" className="w-full">Add to Package</Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Testimonials */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-center">Filmmaker Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                quote:
                  "Film Fortune Foundry helped me earn over $3,000 with my short film in just 6 months. Their distribution network is unmatched!",
                author: "Maria Santiago",
                film: "The Last Echo",
                revenue: "$3,200",
              },
              {
                quote:
                  "As a first-time filmmaker, I had no idea how to monetize my work. The Basic package paid for itself within weeks.",
                author: "James Chen",
                film: "Neon Dreams",
                revenue: "$2,800",
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-muted p-6 rounded-lg border border-border"
              >
                <p className="italic mb-4">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-muted-foreground text-sm">
                    {testimonial.film} • Revenue: {testimonial.revenue}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary text-primary-foreground p-8 rounded-2xl text-center mt-16">
          <h2 className="text-3xl font-bold mb-4">Ready to Monetize Your Film?</h2>
          <p className="text-lg max-w-2xl mx-auto mb-6 opacity-90">
            Join our platform today and turn your creative work into a revenue stream. Our team of distribution experts is ready to help.
          </p>
          <Button size="lg" variant="secondary" className="gap-2">
            Submit Your Project Now <ArrowRight className="h-4 w-4" />
          </Button>
        </section>
      </div>
    </div>
  );
};

export default Films;
