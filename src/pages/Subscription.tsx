
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { SUBSCRIPTION_PLANS } from "@/config/paypal";
import PayPalDirectButton from "@/components/paypal-direct/PayPalDirectButton";

const Subscription = () => {
  // Debug info to console
  React.useEffect(() => {
    console.log("PayPal Subscription Plan IDs:");
    console.log("BASIC:", SUBSCRIPTION_PLANS.BASIC.buttonId);
    console.log("PREMIUM:", SUBSCRIPTION_PLANS.PREMIUM.buttonId);
    console.log("ELITE:", SUBSCRIPTION_PLANS.ELITE.buttonId);
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Subscription Plans</h1>
        <p className="text-center text-muted-foreground mb-8">
          Choose a subscription plan to get the most out of our distribution services.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic Distribution Plan */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Basic Distribution</CardTitle>
              <CardDescription>
                Affordable distribution for independent filmmakers
              </CardDescription>
              <div className="text-2xl font-bold mt-2">
                ${SUBSCRIPTION_PLANS.BASIC.price}
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Distribution to 3 free platforms</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Basic SEO optimization</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Standard thumbnail creation</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Monthly performance reporting</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>25% commission on revenue</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <PayPalDirectButton 
                buttonId={SUBSCRIPTION_PLANS.BASIC.buttonId} 
                className="w-full"
              />
            </CardFooter>
          </Card>

          {/* Premium Distribution Plan */}
          <Card className="flex flex-col border-primary/50 shadow-md">
            <CardHeader className="bg-primary/5">
              <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Most Popular</div>
              <CardTitle>Premium Distribution</CardTitle>
              <CardDescription>
                Enhanced distribution and marketing
              </CardDescription>
              <div className="text-2xl font-bold mt-2">
                ${SUBSCRIPTION_PLANS.PREMIUM.price}
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Distribution to 5 platforms</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Custom trailer creation</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Press kit development</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>2 film festival submissions</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Social media package (5 posts)</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>20% commission on revenue</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <PayPalDirectButton 
                buttonId={SUBSCRIPTION_PLANS.PREMIUM.buttonId} 
                className="w-full"
              />
            </CardFooter>
          </Card>

          {/* Elite Distribution Plan */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Elite Distribution</CardTitle>
              <CardDescription>
                Complete distribution and marketing solution
              </CardDescription>
              <div className="text-2xl font-bold mt-2">
                ${SUBSCRIPTION_PLANS.ELITE.price}
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Distribution to 7 platforms</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Comprehensive marketing campaign</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>5 film festival submissions</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Press outreach (10 outlets)</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Complete social media campaign</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Filmmaker feature interview</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>15% commission on revenue</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <PayPalDirectButton 
                buttonId={SUBSCRIPTION_PLANS.ELITE.buttonId} 
                className="w-full"
              />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
