import { Eye, Zap, Check } from "lucide-react";

const modes = [
  {
    icon: Eye,
    name: "Review Mode",
    tagline: "You approve every reply",
    color: "text-brand-blue",
    borderColor: "border-brand-blue/20",
    bgColor: "bg-brand-blue/5",
    features: [
      "AI drafts appear directly in Gmail",
      "Edit, approve, or discard before sending",
      "Full visibility into every outgoing reply",
      "Best for sensitive or high-value conversations",
    ],
  },
  {
    icon: Zap,
    name: "Auto-Send Mode",
    tagline: "Replies go out automatically",
    color: "text-brand-green",
    borderColor: "border-brand-green/20",
    bgColor: "bg-brand-green/5",
    features: [
      "Handles replies without manual intervention",
      "Ideal for repetitive inbound emails",
      "Works best with configured business rules",
      "Saves hours on high-volume support queues",
    ],
  },
];

const ProductModesSection = () => {
  return (
    <section id="modes" className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Two modes. Your level of control.
          </h2>
          <p className="text-muted-foreground text-lg">
            Choose oversight when it matters, automation when it doesn't.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {modes.map((mode) => (
            <div
              key={mode.name}
              className={`rounded-xl border ${mode.borderColor} ${mode.bgColor} p-8 transition-all hover:border-opacity-50`}
            >
              <mode.icon className={`h-8 w-8 ${mode.color} mb-4`} />
              <h3 className="text-xl font-bold mb-1">{mode.name}</h3>
              <p className="text-sm text-muted-foreground mb-6">{mode.tagline}</p>
              <ul className="space-y-3">
                {mode.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check size={16} className={`${mode.color} mt-0.5 shrink-0`} />
                    <span className="text-secondary-foreground">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductModesSection;
