import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, User, MessageSquare, FileText, PenTool, Filter, Users, Mail, Shield, Eye, EyeOff, AtSign } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const SettingsOverview = () => {
  const { user } = useAuth();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["extension-settings", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("extension_settings")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const getStatus = (value: string | null | undefined) => {
    if (!value || value.trim() === "") return "Not set";
    return "Configured";
  };

  const getArrayStatus = (value: string[] | null | undefined) => {
    if (!value || value.length === 0) return "None";
    return `${value.length} item${value.length > 1 ? "s" : ""}`;
  };

  const settingsItems = [
    { icon: User, label: "Identity", description: "Your name and email signature used in replies", status: getStatus(settings?.identity) },
    { icon: MessageSquare, label: "Reply Style", description: "How formal or casual the AI replies should sound", status: getStatus(settings?.reply_style) },
    { icon: FileText, label: "Business Knowledge", description: "Information about your business, products, and services", status: getStatus(settings?.knowledge) },
    { icon: PenTool, label: "Signature", description: "Email signature appended to AI-generated replies", status: getStatus(settings?.signature) },
    { icon: Filter, label: "Reply Decision Mode", description: "Whether to auto-send or review AI replies first", status: settings?.reply_decision_mode === "auto" ? "Auto-send" : "Review" },
    { icon: Shield, label: "Attention Rules", description: "Custom rules for flagging important emails", status: settings?.attention_rules_enabled ? "Enabled" : "Disabled" },
    { icon: Eye, label: "Allowed Senders", description: "Only reply to these senders", status: getArrayStatus(settings?.allowed_senders) },
    { icon: EyeOff, label: "Ignored Senders", description: "Never reply to these senders", status: getArrayStatus(settings?.ignored_senders) },
    { icon: Users, label: "Default CC", description: "Recipients to copy on outgoing replies", status: getArrayStatus(settings?.default_cc) },
    { icon: AtSign, label: "Default BCC", description: "Blind-copy recipients on outgoing replies", status: getArrayStatus(settings?.default_bcc) },
  ];

  return (
    <Card id="settings">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings size={18} className="text-primary" />
          Settings Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          These settings are configured inside the extension. Here's a summary of what affects your AI reply quality.
        </p>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <Skeleton className="h-8 w-8 rounded-md" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        ) : !settings ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No settings found. Sign in to the extension to initialize your configuration.
          </p>
        ) : (
          <div className="space-y-2">
            {settingsItems.map((item) => (
              <div key={item.label} className="flex items-center gap-3 rounded-lg p-3 hover:bg-muted/50 transition-colors">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 shrink-0">
                  <item.icon size={16} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{item.status}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SettingsOverview;
