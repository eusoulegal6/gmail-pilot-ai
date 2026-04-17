import { Database, UserCog, Filter, Mail } from "lucide-react";
import Reveal from "./Reveal";

const features = [
  {
    icon: Database,
    title: "Business information",
    description: "Save your company details, products, and services so AI replies are always accurate and on-brand.",
    color: "text-brand-red",
    bg: "bg-brand-red/10",
  },
  {
    icon: UserCog,
    title: "Reply preferences",
    description: "Set your tone, formality level, and default response patterns to match how you actually write.",
    color: "text-brand-blue",
    bg: "bg-brand-blue/10",
  },
  {
    icon: Filter,
    title: "Sender filters",
    description: "Control which emails the extension processes. Filter by sender, domain, or subject line patterns.",
    color: "text-brand-yellow",
    bg: "bg-brand-yellow/10",
  },
  {
    icon: Mail,
    title: "CC/BCC defaults",
    description: "Automatically include team members or distribution lists on outgoing replies when needed.",
    color: "text-brand-green",
    bg: "bg-brand-green/10",
  },
];

const CustomizationSection = () => {
  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-yellow/20 bg-brand-yellow/5 px-4 py-1.5 text-sm text-brand-yellow mb-6">
            Coming with account support
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Make it yours
          </h2>
          <p className="text-muted-foreground text-lg">
            Upcoming account features will let you save settings, sync across devices, and fine-tune every aspect of your AI replies.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 80} className="card-lift flex gap-4 p-5 rounded-xl border border-border bg-card">
              <div className={`card-lift-icon flex h-9 w-9 items-center justify-center rounded-lg ${f.bg} shrink-0`}>
                <f.icon size={18} className={f.color} />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomizationSection;
