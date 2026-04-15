import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, User, MessageSquare, FileText, PenTool, Filter, Users, Mail } from "lucide-react";

const settingsItems = [
  { icon: User, label: "Identity", description: "Your name and email signature used in replies", status: "Not configured" },
  { icon: MessageSquare, label: "Tone & Style", description: "How formal or casual the AI replies should sound", status: "Default" },
  { icon: FileText, label: "Business Context", description: "Information about your business, products, and services", status: "Not set" },
  { icon: PenTool, label: "Signature", description: "Email signature appended to AI-generated replies", status: "Not set" },
  { icon: Filter, label: "Reply Rules", description: "Rules for which emails to reply to and which to skip", status: "Default" },
  { icon: Users, label: "CC/BCC Defaults", description: "Default recipients to copy on outgoing replies", status: "None" },
  { icon: Mail, label: "Sender Filters", description: "Whitelist or blacklist specific sender addresses", status: "None" },
];

const SettingsOverview = () => {
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
      </CardContent>
    </Card>
  );
};

export default SettingsOverview;
