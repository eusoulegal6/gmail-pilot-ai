import { useEffect, useState } from "react";

type EmailItem = {
  from: string;
  subject: string;
  body: string;
  reply: string;
};

const EMAILS: EmailItem[] = [
  {
    from: "customer@example.com",
    subject: "Bulk pricing question",
    body: "Hi, do you offer bulk pricing for orders over 500 units?",
    reply:
      "Thank you for your interest! Yes, we offer tiered pricing — 15% off on 500+ units. I'll send a detailed quote shortly.",
  },
  {
    from: "sarah@acme.co",
    subject: "Demo request",
    body: "Could we schedule a 20-minute demo this week?",
    reply:
      "Absolutely, Sarah! I have Thursday 2pm or Friday 10am open. Which works best for you?",
  },
  {
    from: "mike@startup.io",
    subject: "Refund inquiry",
    body: "I'd like to request a refund for my last invoice — wrong plan selected.",
    reply:
      "Sorry about that, Mike. I've initiated the refund — you'll see it in 3–5 business days. Switching you to the correct plan now.",
  },
  {
    from: "lisa@brand.com",
    subject: "Partnership proposal",
    body: "We'd love to explore a co-marketing partnership with your team.",
    reply:
      "Hi Lisa! Sounds promising. I've looped in our partnerships lead — expect an intro within 24 hours.",
  },
];

// Phases (in ms): incoming -> thinking -> typing -> sent -> next
const PHASE_DURATIONS = {
  incoming: 900,
  thinking: 1100,
  typing: 2200,
  sent: 1100,
};
const TOTAL_PER_EMAIL =
  PHASE_DURATIONS.incoming +
  PHASE_DURATIONS.thinking +
  PHASE_DURATIONS.typing +
  PHASE_DURATIONS.sent;

type Phase = "incoming" | "thinking" | "typing" | "sent";

const useTypewriter = (text: string, active: boolean, durationMs: number) => {
  const [out, setOut] = useState("");
  useEffect(() => {
    if (!active) {
      setOut("");
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const len = Math.floor(t * text.length);
      setOut(text.slice(0, len));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, active, durationMs]);
  return out;
};

const AnimatedInbox = () => {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("incoming");
  const [repliedCount, setRepliedCount] = useState(0);

  useEffect(() => {
    const timers: number[] = [];
    setPhase("incoming");
    timers.push(
      window.setTimeout(() => setPhase("thinking"), PHASE_DURATIONS.incoming),
    );
    timers.push(
      window.setTimeout(
        () => setPhase("typing"),
        PHASE_DURATIONS.incoming + PHASE_DURATIONS.thinking,
      ),
    );
    timers.push(
      window.setTimeout(
        () => setPhase("sent"),
        PHASE_DURATIONS.incoming +
          PHASE_DURATIONS.thinking +
          PHASE_DURATIONS.typing,
      ),
    );
    timers.push(
      window.setTimeout(() => {
        setRepliedCount((c) => c + 1);
        setIndex((i) => (i + 1) % EMAILS.length);
      }, TOTAL_PER_EMAIL),
    );
    return () => timers.forEach(clearTimeout);
  }, [index]);

  const email = EMAILS[index];
  const typedReply = useTypewriter(
    email.reply,
    phase === "typing" || phase === "sent",
    PHASE_DURATIONS.typing - 200,
  );

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full rounded-full bg-brand-green animate-ping-ring" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-green" />
        </span>
        <span className="text-sm font-medium text-foreground">
          Send Smart — Active
        </span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-blue" />
          Auto-Reply Mode
        </span>
      </div>

      {/* Stats bar */}
      <div className="mb-4 flex items-center justify-between rounded-lg border border-border/60 bg-muted/40 px-3 py-2 text-xs">
        <span className="text-muted-foreground">
          Processing inbox
          <span className="mx-2 text-foreground/40">•</span>
          <span className="text-foreground font-medium tabular-nums">
            {repliedCount}
          </span>{" "}
          replied
        </span>
        <span className="inline-flex gap-1">
          {EMAILS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-4 rounded-full transition-colors duration-500 ${
                i === index
                  ? "bg-brand-blue"
                  : i < index
                    ? "bg-brand-green/70"
                    : "bg-border"
              }`}
            />
          ))}
        </span>
      </div>

      {/* Email card with key remount for slide animation */}
      <div key={index} className="space-y-3 animate-fade-in">
        {/* Incoming email */}
        <div
          className="rounded-lg bg-muted p-3 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.05s", animationFillMode: "forwards" }}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs text-muted-foreground truncate">
              From: {email.from}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-brand-blue/80 font-medium">
              New
            </div>
          </div>
          <div className="text-xs text-muted-foreground/80 mb-1 truncate">
            {email.subject}
          </div>
          <div className="text-sm text-foreground">"{email.body}"</div>
        </div>

        {/* AI Reply */}
        <div
          className="rounded-lg border border-brand-blue/20 bg-brand-blue/5 p-3 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
        >
          <div className="text-xs text-brand-blue mb-1 flex items-center gap-2">
            {phase === "thinking" ? "AI Thinking" : "AI Draft Reply"}
            <span className="inline-flex gap-0.5">
              <span
                className="h-1 w-1 rounded-full bg-brand-blue animate-typing-dot"
                style={{ animationDelay: "0s" }}
              />
              <span
                className="h-1 w-1 rounded-full bg-brand-blue animate-typing-dot"
                style={{ animationDelay: "0.2s" }}
              />
              <span
                className="h-1 w-1 rounded-full bg-brand-blue animate-typing-dot"
                style={{ animationDelay: "0.4s" }}
              />
            </span>
            {phase === "sent" && (
              <span className="ml-auto inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-brand-green font-medium">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Sent
              </span>
            )}
          </div>
          <div className="text-sm text-foreground min-h-[3.5rem]">
            {phase === "thinking" ? (
              <span className="text-muted-foreground italic">
                Analyzing context and drafting reply…
              </span>
            ) : (
              <>
                {typedReply}
                {phase === "typing" && (
                  <span className="inline-block w-[2px] h-4 bg-brand-blue/80 align-middle ml-0.5 animate-pulse" />
                )}
              </>
            )}
          </div>
        </div>

        {/* Action row */}
        <div className="flex gap-2 justify-end items-center">
          <span className="text-xs text-muted-foreground mr-auto">
            {phase === "sent" ? "Reply delivered" : "Auto-sending in moments…"}
          </span>
          <span className="text-xs px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground">
            Edit
          </span>
          <span
            className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors duration-300 ${
              phase === "sent"
                ? "bg-brand-green text-primary-foreground"
                : "bg-brand-blue text-primary-foreground"
            }`}
          >
            {phase === "sent" ? "Sent ✓" : "Send Reply"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnimatedInbox;
