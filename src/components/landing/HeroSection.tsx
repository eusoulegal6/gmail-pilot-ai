import { Mail, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EXTENSION_DOWNLOAD_URL } from "@/lib/constants";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background glows — four colors */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-brand-blue/8 blur-[120px] animate-pulse-glow" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-brand-green/6 blur-[100px] animate-pulse-glow" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-brand-red/5 blur-[100px] animate-pulse-glow" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] rounded-full bg-brand-yellow/5 blur-[100px] animate-pulse-glow" style={{ animationDelay: "0.5s" }} />

      <div className="container mx-auto px-6 py-24 md:py-32 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground mb-8 opacity-0 animate-fade-up">
            <Zap size={14} className="text-brand-yellow" />
            Gmail AI Auto-Reply Extension
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight mb-6 opacity-0 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Your inbox replies itself.{" "}
            <span className="text-gradient">Intelligently.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed opacity-0 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Send Smart drafts AI-powered replies to your Gmail emails using your business context. Review each one before sending, or let it handle everything automatically.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Button variant="hero" size="lg" asChild>
              <a href={EXTENSION_DOWNLOAD_URL} download className="gap-2">
                <Mail size={18} />
                Get the Extension
              </a>
            </Button>
            <Button variant="hero-outline" size="lg" asChild>
              <a href="#how-it-works">See How It Works</a>
            </Button>
          </div>
        </div>

        {/* Mock extension popup */}
        <div className="mt-16 md:mt-24 max-w-lg mx-auto opacity-0 animate-fade-up" style={{ animationDelay: "0.5s" }}>
          <div className="rounded-xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-3 w-3 rounded-full bg-brand-green" />
              <span className="text-sm font-medium text-foreground">Send Smart — Active</span>
              <span className="ml-auto text-xs text-muted-foreground">Review Mode</span>
            </div>
            <div className="space-y-3">
              <div className="rounded-lg bg-muted p-3">
                <div className="text-xs text-muted-foreground mb-1">From: customer@example.com</div>
                <div className="text-sm text-foreground">"Hi, do you offer bulk pricing for orders over 500 units?"</div>
              </div>
              <div className="rounded-lg border border-brand-blue/20 bg-brand-blue/5 p-3">
                <div className="text-xs text-brand-blue mb-1">AI Draft Reply</div>
                <div className="text-sm text-foreground">"Thank you for your interest! Yes, we offer tiered pricing for bulk orders. For 500+ units, we can offer a 15% discount. I'll send over a detailed quote shortly."</div>
              </div>
              <div className="flex gap-2 justify-end">
                <span className="text-xs px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground">Edit</span>
                <span className="text-xs px-3 py-1.5 rounded-md bg-brand-blue text-primary-foreground font-medium">Send Reply</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
