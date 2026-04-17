import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, Loader2, RefreshCw } from "lucide-react";

const SENDSMART_PAIR_CREATE_URL =
  "https://uexdjvbdqwrzlgfrpgbl.supabase.co/functions/v1/pair-create";
const SENDSMART_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVleGRqdmJkcXdyemxnZnJwZ2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2NzE2NDEsImV4cCI6MjA5MDI0NzY0MX0.-BAr2q1F_2Kn-v0foNSfSvuRbGEnaom_kPZI-r7f6Nw";

const ConnectExtension = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [generating, setGenerating] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const secondsLeft = expiresAt
    ? Math.max(0, Math.floor((expiresAt.getTime() - now) / 1000))
    : 0;

  useEffect(() => {
    if (expiresAt && secondsLeft === 0) {
      setCode(null);
      setExpiresAt(null);
    }
  }, [secondsLeft, expiresAt]);

  const generateCode = async () => {
    setGenerating(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      const res = await fetch(SENDSMART_PAIR_CREATE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SENDSMART_ANON_KEY,
          Authorization: `Bearer ${session.access_token}`,
        },
        body: "{}",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? "Failed to generate code");
        return;
      }
      setCode(data.code);
      setExpiresAt(new Date(data.expiresAt));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Network error");
    } finally {
      setGenerating(false);
    }
  };

  const copyCode = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    toast.success("Code copied");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Pairing code</CardTitle>
        <CardDescription>
          Generate a one-time code, then paste it into the extension popup.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {code ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-muted/40 py-8">
            <div className="font-mono text-4xl font-semibold tracking-[0.2em] text-foreground">
              {code}
            </div>
            <div className="text-sm text-muted-foreground">
              Expires in {Math.floor(secondsLeft / 60)}:
              {String(secondsLeft % 60).padStart(2, "0")}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyCode}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={generateCode}
                disabled={generating}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                New code
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="hero"
            size="lg"
            onClick={generateCode}
            disabled={generating}
            className="w-full sm:w-auto"
          >
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating…
              </>
            ) : (
              "Generate pairing code"
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ConnectExtension;
