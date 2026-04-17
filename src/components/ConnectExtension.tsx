import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Copy, Loader2, RefreshCw, LogOut } from "lucide-react";
import {
  sendsmartSupabase,
  SENDSMART_URL,
  SENDSMART_ANON_KEY,
} from "@/lib/sendsmartClient";

type SsUser = { id: string; email?: string | null } | null;

const ConnectExtension = () => {
  const [ssUser, setSsUser] = useState<SsUser>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Sign-in form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);

  // Pairing code state
  const [code, setCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const { data: sub } = sendsmartSupabase.auth.onAuthStateChange((_event, session) => {
      setSsUser(session?.user ? { id: session.user.id, email: session.user.email } : null);
    });
    sendsmartSupabase.auth.getSession().then(({ data }) => {
      setSsUser(data.session?.user ? { id: data.session.user.id, email: data.session.user.email } : null);
      setAuthLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError(null);
    setSigningIn(true);
    const { error } = await sendsmartSupabase.auth.signInWithPassword({ email, password });
    setSigningIn(false);
    if (error) {
      setSignInError(error.message);
      return;
    }
    setPassword("");
    toast.success("Signed in to Send Smart");
  };

  const handleSignOut = async () => {
    await sendsmartSupabase.auth.signOut();
    setCode(null);
    setExpiresAt(null);
    toast.success("Signed out of Send Smart");
  };

  const generateCode = async () => {
    setGenerating(true);
    setCode(null);
    setExpiresAt(null);

    const { data: sessionData } = await sendsmartSupabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;
    if (!accessToken) {
      setGenerating(false);
      toast.error("Send Smart session expired. Please sign in again.");
      await sendsmartSupabase.auth.signOut();
      return;
    }

    try {
      const res = await fetch(`${SENDSMART_URL}/functions/v1/pair-create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SENDSMART_ANON_KEY,
          Authorization: `Bearer ${accessToken}`,
        },
        body: "{}",
      });

      const json = await res.json().catch(() => ({}));

      if (res.status === 401) {
        await sendsmartSupabase.auth.signOut();
        toast.error("Send Smart authentication expired. Please sign in again.");
        return;
      }

      if (!res.ok) {
        toast.error(json?.error ?? `Failed to generate code (${res.status})`);
        return;
      }

      if (!json?.code || !json?.expiresAt) {
        toast.error("Unexpected response from Send Smart.");
        return;
      }

      setCode(json.code);
      setExpiresAt(json.expiresAt);
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

  const secondsLeft = expiresAt
    ? Math.max(0, Math.floor((new Date(expiresAt).getTime() - now) / 1000))
    : 0;
  const codeExpired = !!expiresAt && secondsLeft === 0;

  // --- Render states ---

  if (authLoading) {
    return (
      <Card>
        <CardContent className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </CardContent>
      </Card>
    );
  }

  if (!ssUser) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Sign in to Send Smart</CardTitle>
          <CardDescription>
            Pairing codes are issued by the Send Smart backend. Sign in with your Send Smart account to generate one.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ss-email">Email</Label>
              <Input
                id="ss-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ss-password">Password</Label>
              <Input
                id="ss-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {signInError && (
              <p className="text-sm text-destructive" role="alert">
                {signInError}
              </p>
            )}
            <Button type="submit" disabled={signingIn} className="w-full sm:w-auto">
              {signingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl">Pairing code</CardTitle>
            <CardDescription>
              Generate a one-time code, then paste it into the Send Smart extension popup.
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-1 text-right">
            <span className="text-xs text-muted-foreground">Send Smart</span>
            <span className="text-xs font-medium text-foreground truncate max-w-[180px]">
              {ssUser.email}
            </span>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="mr-1 h-3 w-3" />
              Sign out
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {code ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-muted/40 py-8">
            <div className="font-mono text-4xl font-semibold tracking-[0.3em] text-foreground">
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
  );
};

export default ConnectExtension;
