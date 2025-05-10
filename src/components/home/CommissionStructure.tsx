
import React from "react";

const CommissionStructure = () => {
  const tiers = [
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
  ];

  return (
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
            {tiers.map((tier) => (
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
  );
};

export default CommissionStructure;
