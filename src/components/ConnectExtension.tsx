import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, Loader2, RefreshCw, Trash2, Smartphone } from "lucide-react";

interface ExtensionToken {
  id: string;
  device_label: string | null;
  created_at: string;
  last_used_at: string | null;
  revoked_at: string | null;
}

const ConnectExtension = () => {
  const { user } = useAuth();
  const [code, setCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [tokens, setTokens] = useState<ExtensionToken[]>([]);
  const [loadingTokens, setLoadingTokens] = useState(true);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const fetchTokens = async () => {
    if (!user) return;
    setLoadingTokens(true);
    const { data, error } = await supabase
      .from("extension_tokens")
      .select("id, device_label, created_at, last_used_at, revoked_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (!error && data) setTokens(data as ExtensionToken[]);
    setLoadingTokens(false);
  };

  useEffect(() => {
    fetchTokens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const generateCode = async () => {
    setGenerating(true);
    setCode(null);
    setExpiresAt(null);
    const { data, error } = await supabase.functions.invoke("pair-create");
    setGenerating(false);
    if (error || !data?.code) {
      toast.error(error?.message ?? "Failed to generate code");
      return;
    }
    setCode(data.code);
    setExpiresAt(data.expiresAt);
  };

  const copyCode = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    toast.success("Code copied");
  };

  const revokeToken = async (id: string) => {
    const { error } = await supabase
      .from("extension_tokens")
      .update({ revoked_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Device disconnected");
    fetchTokens();
  };

  const secondsLeft = expiresAt
    ? Math.max(0, Math.floor((new Date(expiresAt).getTime() - now) / 1000))
    : 0;
  const codeExpired = !!expiresAt && secondsLeft === 0;

  const activeTokens = tokens.filter((t) => !t.revoked_at);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Pairing code</CardTitle>
          <CardDescription>
            Generate a one-time code, then paste it into the extension popup. Codes expire in 10 minutes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {code ? (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-muted/40 py-8">
              <div className="font-mono text-4xl font-semibold tracking-[0.4em] text-foreground">
                {code}
              </div>
              <div className="text-sm text-muted-foreground">
                {codeExpired
                  ? "Expired — generate a new one"
                  : `Expires in ${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")}`}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyCode} disabled={codeExpired}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={generateCode} disabled={generating}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  New code
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={generateCode} disabled={generating} className="w-full sm:w-auto">
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

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Connected devices</CardTitle>
          <CardDescription>
            {activeTokens.length === 0
              ? "No devices connected yet."
              : `${activeTokens.length} device${activeTokens.length === 1 ? "" : "s"} connected.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingTokens ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </div>
          ) : activeTokens.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Once you redeem a pairing code from the extension, it will appear here.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {activeTokens.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-md border border-border bg-muted p-2">
                      <Smartphone className="h-4 w-4 text-foreground" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {t.device_label || "Chrome extension"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Connected {new Date(t.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => revokeToken(t.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Disconnect
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectExtension;
