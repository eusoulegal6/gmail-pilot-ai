import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Open Gmail",
    description: "Send Smart works through a dedicated unread-only view in Gmail. This keeps the extension focused and prevents duplicate replies.",
  },
  {
    number: "02",
    title: "AI reads and drafts",
    description: "The extension picks up your first unread email, analyzes the content, and drafts a reply using your business context and writing style.",
  },
  {
    number: "03",
    title: "Review or auto-send",
    description: "In Review Mode, the draft appears in Gmail for you to approve or edit. In Auto-Send Mode, approved replies go out automatically.",
  },
  {
    number: "04",
    title: "Email disappears from view",
    description: "Once processed, the email leaves the unread view naturally. This built-in mechanism prevents the extension from replying twice or getting stuck.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            A focused workflow, not a messy inbox plugin
          </h2>
          <p className="text-muted-foreground text-lg">
            Send Smart doesn't try to manage your entire inbox. It works through a reliable, scoped process that handles one email at a time.
          </p>
        </div>

        {/* Demo video */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xl">
            <video
              className="w-full"
              controls
              playsInline
              preload="metadata"
              poster=""
            >
              <source src="/videos/send-smart-demo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

          <div className="space-y-8">
            {steps.map((step, i) => (
              <div key={step.number} className="flex gap-6 group">
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-sm font-bold text-primary shrink-0">
                    {step.number}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px flex-1 bg-border mt-3" />
                  )}
                </div>
                <div className="pb-8">
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
