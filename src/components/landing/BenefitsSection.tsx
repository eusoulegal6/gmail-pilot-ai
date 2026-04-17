import { Clock, MessageSquare, Fingerprint, Shield, PenTool, Settings } from "lucide-react";
import Reveal from "./Reveal";

const benefits = [
  {
    icon: Clock,
    title: "Fewer repetitive tasks",
    description: "Stop typing the same answers to the same questions. Let AI handle the patterns you've already solved.",
    color: "text-brand-red",
    bg: "bg-brand-red/10",
  },
  {
    icon: MessageSquare,
    title: "More consistent replies",
    description: "Every response follows your tone and includes the right information — no off-days or missed details.",
    color: "text-brand-blue",
    bg: "bg-brand-blue/10",
  },
  {
    icon: Fingerprint,
    title: "Your business context",
    description: "Replies are generated using your products, services, policies, and writing style — not generic templates.",
    color: "text-brand-yellow",
    bg: "bg-brand-yellow/10",
  },
  {
    icon: PenTool,
    title: "Signatures & knowledge",
    description: "Attach your email signature, business info, and key details so replies always feel complete and professional.",
    color: "text-brand-green",
    bg: "bg-brand-green/10",
  },
  {
    icon: Shield,
    title: "Built for reliability",
    description: "The unread-only workflow ensures each email is processed once. No duplicate replies, no stuck automation.",
    color: "text-brand-red",
    bg: "bg-brand-red/10",
  },
  {
    icon: Settings,
    title: "Configurable rules",
    description: "Set sender filters, CC/BCC defaults, and reply preferences to match your operational needs.",
    color: "text-brand-blue",
    bg: "bg-brand-blue/10",
  },
];

const BenefitsSection = () => {
  return (
    <section id="benefits" className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Built for people who actually use email to run a business
          </h2>
          <p className="text-muted-foreground text-lg">
            Not another inbox widget. A focused tool for operational email.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {benefits.map((b, i) => (
            <Reveal
              key={b.title}
              delay={i * 80}
              className="card-lift rounded-xl border border-border bg-card p-6"
            >
              <div className={`card-lift-icon inline-flex h-9 w-9 items-center justify-center rounded-lg ${b.bg} mb-4`}>
                <b.icon className={`h-5 w-5 ${b.color}`} />
              </div>
              <h3 className="font-semibold mb-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
