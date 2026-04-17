import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type CodeStep = "request" | "verify";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Email-code (OTP) state
  const [codeEmail, setCodeEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeStep, setCodeStep] = useState<CodeStep>("request");
  const [codeLoading, setCodeLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast({
          title: "Check your email",
          description: "We sent you a confirmation link to complete sign up.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });

    if (result.error) {
      toast({
        title: "Error",
        description: result.error.message,
        variant: "destructive",
      });
      return;
    }

    if (result.redirected) {
      return;
    }

    navigate("/");
  };

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeEmail) return;
    setCodeLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: codeEmail,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      setCodeStep("verify");
      toast({
        title: "Code sent",
        description: `We emailed a 6-digit code to ${codeEmail}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setCodeLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;
    setCodeLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: codeEmail,
        token: code,
        type: "email",
      });
      if (error) throw error;
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Invalid code",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setCodeLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!codeEmail) return;
    setCodeLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: codeEmail,
        options: { shouldCreateUser: true, emailRedirectTo: window.location.origin },
      });
      if (error) throw error;
      toast({ title: "Code resent", description: "Check your inbox." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setCodeLoading(false);
    }
  };

  const resetCodeFlow = () => {
    setCodeStep("request");
    setCode("");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gradient mb-2">Send Smart</h1>
          <p className="text-muted-foreground text-sm">
            Sign in to your account
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <Tabs defaultValue="code" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="code">Email code</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>

            <TabsContent value="code" className="space-y-4 mt-4">
              {codeStep === "request" ? (
                <form onSubmit={handleRequestCode} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="code-email" className="text-sm">Email</Label>
                    <Input
                      id="code-email"
                      type="email"
                      value={codeEmail}
                      onChange={(e) => setCodeEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <Button
                    variant="hero"
                    className="w-full"
                    type="submit"
                    disabled={codeLoading}
                  >
                    {codeLoading ? "Sending..." : "Send me a code"}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    We'll email you a 6-digit code. The same code works in the
                    Send Smart extension.
                  </p>
                </form>
              ) : (
                <form onSubmit={handleVerifyCode} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm">
                      Enter the 6-digit code sent to {codeEmail}
                    </Label>
                    <div className="flex justify-center pt-2">
                      <InputOTP
                        maxLength={6}
                        value={code}
                        onChange={(v) => setCode(v)}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>
                  <Button
                    variant="hero"
                    className="w-full"
                    type="submit"
                    disabled={codeLoading || code.length !== 6}
                  >
                    {codeLoading ? "Verifying..." : "Verify & sign in"}
                  </Button>
                  <div className="flex justify-between text-xs">
                    <button
                      type="button"
                      onClick={resetCodeFlow}
                      className="text-muted-foreground hover:underline"
                    >
                      ← Use a different email
                    </button>
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={codeLoading}
                      className="text-primary hover:underline disabled:opacity-50"
                    >
                      Resend code
                    </button>
                  </div>
                </form>
              )}
            </TabsContent>

            <TabsContent value="password" className="space-y-4 mt-4">
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
                <Button variant="hero" className="w-full" type="submit" disabled={loading}>
                  {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
                </Button>
              </form>

              <p className="text-center text-xs text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:underline"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;
