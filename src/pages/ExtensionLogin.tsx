import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const ExtensionLogin = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [code, setCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [issuing, setIssuing] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  const issueCode = async () => {
    setIssuing(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "issue-extension-code",
      );
      if (error) throw error;
      setCode(data.code);
      setExpiresAt(data.expires_at);
    } catch (e: any) {
      toast({
        title: "Could not generate code",
        description: e.message ?? "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIssuing(false);
    }
  };

  // Auto-issue once user is authenticated
  useEffect(() => {
    if (!authLoading && user && !code && !issuing) {
      issueCode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

  // Countdown
  useEffect(() => {
    if (!expiresAt) return;
    const tick = () => {
      const diff = Math.max(
        0,
        Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000),
      );
      setSecondsLeft(diff);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  const copyCode = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    toast({ title: "Copied", description: "Code copied to clipboard." });
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${r.toString().padStart(2, "0")}`;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center space-y-4">
          <h1 className="text-2xl font-bold text-gradient">Send Smart</h1>
          <p className="text-muted-foreground text-sm">
            You need to sign in first to get an extension code.
          </p>
          <Button
            variant="hero"
            className="w-full"
            onClick={() => navigate("/auth")}
          >
            Sign in
          </Button>
        </div>
      </div>
    );
  }

  const expired = secondsLeft === 0 && code !== null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gradient mb-2">Send Smart</h1>
          <p className="text-muted-foreground text-sm">
            Your one-time extension sign-in code
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-8 space-y-6">
          {!code ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                {issuing ? "Generating your code..." : "Click below to generate a code."}
              </p>
              {!issuing && (
                <Button variant="hero" className="w-full" onClick={issueCode}>
                  Generate code
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="text-center">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                  Enter this code in the extension
                </p>
                <div
                  className="font-mono text-5xl font-bold tracking-[0.4em] text-foreground select-all"
                  aria-label="Verification code"
                >
                  {code}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  {expired
                    ? "This code has expired."
                    : `Expires in ${formatTime(secondsLeft)}`}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={copyCode}
                  disabled={expired}
                >
                  Copy code
                </Button>
                <Button
                  variant="hero"
                  className="flex-1"
                  onClick={issueCode}
                  disabled={issuing}
                >
                  {issuing ? "..." : "New code"}
                </Button>
              </div>

              <p className="text-center text-xs text-muted-foreground">
                Open the Send Smart extension and paste this 6-digit code into
                the sign-in screen. The code can only be used once.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExtensionLogin;
