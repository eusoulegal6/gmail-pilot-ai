import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const LIMITS = {
  emails: 500,
  inputTokens: 2_000_000,
  outputTokens: 500_000,
};

const fmt = (n: number) => n.toLocaleString("en-US");

const getCurrentPeriod = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

const getPeriodLabel = () => {
  return new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

const UsageCard = () => {
  const { user } = useAuth();
  const period = getCurrentPeriod();

  const { data, isLoading } = useQuery({
    queryKey: ["usage_counters", user?.id, period],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("usage_counters")
        .select("emails_used, input_tokens_used, output_tokens_used")
        .eq("user_id", user!.id)
        .eq("period", period)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const emails = data?.emails_used ?? 0;
  const inputTokens = data?.input_tokens_used ?? 0;
  const outputTokens = data?.output_tokens_used ?? 0;

  const bars = [
    { label: "Emails", used: emails, limit: LIMITS.emails },
    { label: "Input tokens", used: inputTokens, limit: LIMITS.inputTokens },
    { label: "Output tokens", used: outputTokens, limit: LIMITS.outputTokens },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 size={18} className="text-primary" />
          Usage — {getPeriodLabel()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {bars.map((bar) => (
              <div key={bar.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{bar.label}</span>
                  <span className="font-medium text-foreground">
                    {fmt(bar.used)} / {fmt(bar.limit)}
                  </span>
                </div>
                <Progress
                  value={Math.min((bar.used / bar.limit) * 100, 100)}
                  className="h-2"
                />
              </div>
            ))}
            <p className="text-xs text-muted-foreground pt-1">
              Quotas reset on the 1st of each month.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UsageCard;
