import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Chrome, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const ExtensionPromoCard = () => {
  const { user } = useAuth();
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { count: c } = await supabase
        .from("extension_tokens")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .is("revoked_at", null);
      if (!cancelled) setCount(c ?? 0);
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-md border border-border bg-muted p-2">
            <Chrome className="h-5 w-5 text-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg">Chrome Extension</CardTitle>
            <CardDescription>
              Drafts smart Gmail replies right inside your inbox.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {count === null
            ? "Checking connected devices…"
            : count === 0
              ? "No devices connected yet."
              : `${count} device${count === 1 ? "" : "s"} connected.`}
        </p>
        <Button asChild>
          <Link to="/extension">
            Manage extension
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ExtensionPromoCard;
