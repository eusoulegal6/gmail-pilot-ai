import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import {
  sendsmartSupabase,
  SENDSMART_FUNCTIONS_URL,
  SENDSMART_ANON_KEY,
} from "@/lib/sendsmartClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Copy, Loader2, RefreshCw, LogOut } from "lucide-react";

const ConnectExtension = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);

  // sign-in form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);

  // pairing code state
  const [code, setCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    sendsmartSupabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });
    const { data: sub } = sendsmartSupabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (!s) {
        setCode(null);
        setExpiresAt(null);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const secondsLeft = expiresAt
    ? Math.max(0, Math.floor((new Date(expiresAt).getTime() - now) / 1000))
    : 0;

  useEffect(() => {
    if (expiresAt && secondsLeft === 0) {
      setCode(null);
      setExpiresAt(null);
    }
  }, [secondsLeft, expiresAt]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSigningIn(true);
    setSignInError(null);
    const { error } = await sendsmartSupabase.auth.signInWithPassword({
      email,
      password,
    });
    setSigningIn(false);
    if (error) {
      setSignInError(error.message);
      return;
    }
    setPassword("");
  };

  const handleSignOut = async () => {
    await sendsmartSupabase.auth.signOut();
    setCode(null);
    setExpiresAt(null);
  };

  const generateCode = async () => {
    const { data: sessData } = await sendsmartSupabase.auth.getSession();
    const token = sessData.session?.access_token;
    if (!token) {
      toast.error("Please sign in to Send Smart first.");
      return;
    }
    setGenerating(true);
    try {
      const res = await fetch(`${SENDSMART_FUNCTIONS_URL}/pair-create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SENDSMART_ANON_KEY,
          Authorization: `Bearer ${token}`,
        },
        body: "{}",
      });
      const data = await res.json();
      if (res.status === 401) {
        await sendsmartSupabase.auth.signOut();
        toast.error("Your Send Smart session expired. Please sign in again.");
        return;
      }
      if (!res.ok) {
        toast.error(data?.error ?? "Failed to generate code");
        return;
      }
      setCode(data.code);
      setExpiresAt(data.expiresAt);
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

  if (!authReady) {
    return (
      <Card>
        <CardContent className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </CardContent>
      </Card>
    );
  }

  // (a) Not signed in to Send Smart
  if (!session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Sign in to Send Smart</CardTitle>
          <CardDescription>
            You need a Send Smart account to generate codes for the extension.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4 max-w-sm">
            <div className="space-y-2">
              <Label htmlFor="ss-email">Email</Label>
              <Input
                id="ss-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ss-password">Password</Label>
              <Input
                id="ss-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            {signInError && (
              <p className="text-sm text-destructive">{signInError}</p>
            )}
            <Button type="submit" disabled={signingIn}>
              {signingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in to Send Smart"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  // (b) / (c) Signed in
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl">Pairing code</CardTitle>
            <CardDescription>
              Signed in to Send Smart as{" "}
              <span className="text-foreground">{session.user.email}</span>.
              Codes expire shortly after generation.
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-muted-foreground"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
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
