import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const tiers = [
  {
    name: "Free / Early Access",
    price: "$0",
    description: "Get started now while Send Smart is in early access.",
    features: [
      "AI-generated replies",
      "Review Mode",
      "Auto-Send Mode",
      "Business context configuration",
      "Manual extension install",
    ],
    cta: "Get Started Free",
    href: "#install",
    highlight: false,
  },
  {
    name: "Pro",
    price: "Coming soon",
    description: "Account-based features, higher limits, and priority support.",
    features: [
      "Everything in Free",
      "Cloud-synced settings",
      "Higher daily reply quotas",
      "Advanced sender filters",
      "Priority support",
      "Team features",
    ],
    cta: "Join Waitlist",
    href: "#final-cta",
    highlight: true,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Free while in early access
          </h2>
          <p className="text-muted-foreground text-lg">
            Start using Send Smart today at no cost. Paid plans with expanded features are on the way.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-xl border p-8 ${
                tier.highlight
                  ? "border-primary/30 bg-primary/5"
                  : "border-border bg-card"
              }`}
            >
              <h3 className="font-bold text-lg mb-1">{tier.name}</h3>
              <div className="text-2xl font-extrabold mb-2">{tier.price}</div>
              <p className="text-sm text-muted-foreground mb-6">{tier.description}</p>
              <ul className="space-y-3 mb-8">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check size={14} className="text-primary shrink-0" />
                    <span className="text-secondary-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant={tier.highlight ? "hero" : "hero-outline"}
                className="w-full"
                asChild
              >
                <a href={tier.href}>{tier.cta}</a>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
