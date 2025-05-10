
import React from "react";
import { BarChart } from "lucide-react";

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

const Testimonials = () => {
  return (
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
  );
};

export default Testimonials;
