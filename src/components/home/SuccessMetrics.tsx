
import React from "react";

const SuccessMetrics = () => {
  return (
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
  );
};

export default SuccessMetrics;
