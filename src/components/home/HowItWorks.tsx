
import React from "react";
import { Film, CheckCircle, TrendingUp, DollarSign } from "lucide-react";

const HowItWorks = () => {
  const steps = [
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
  ];

  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item) => (
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
  );
};

export default HowItWorks;
