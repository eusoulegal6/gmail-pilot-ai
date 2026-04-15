import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, Download, Chrome, LogIn, FileText, Settings, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExtensionDownload } from "@/hooks/use-extension-download";

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  completed: boolean;
  action?: { label: string; onClick?: (e: React.MouseEvent) => void; href?: string };
}

const SetupChecklist = () => {
  const { handleDownload } = useExtensionDownload();

  // Placeholder completion states — will be driven by backend later
  const items: ChecklistItem[] = [
    {
      id: "download",
      label: "Download the extension",
      description: "Get the latest Send Smart package for Chrome.",
      icon: Download,
      completed: false,
      action: { label: "Download", onClick: handleDownload },
    },
    {
      id: "install",
      label: "Install in Chrome",
      description: "Load the unpacked extension in your browser.",
      icon: Chrome,
      completed: false,
      action: { label: "See guide", href: "#download" },
    },
    {
      id: "signin",
      label: "Sign in inside the extension",
      description: "Use your account credentials in the extension popup.",
      icon: LogIn,
      completed: false,
    },
    {
      id: "context",
      label: "Add your business context",
      description: "Tell the AI about your business so replies are relevant.",
      icon: FileText,
      completed: false,
      action: { label: "Configure", href: "#settings" },
    },
    {
      id: "behavior",
      label: "Configure reply behavior",
      description: "Choose tone, style, and reply rules.",
      icon: Settings,
      completed: false,
      action: { label: "Configure", href: "#settings" },
    },
    {
      id: "ccbcc",
      label: "Add default CC/BCC recipients",
      description: "Optionally set recipients to always copy on replies.",
      icon: Users,
      completed: false,
      action: { label: "Configure", href: "#settings" },
    },
    {
      id: "test",
      label: "Run a safe test in Review Mode",
      description: "Try the AI on a real email before enabling Auto-Send.",
      icon: Shield,
      completed: false,
      action: { label: "Learn how", href: "#testing" },
    },
  ];

  const completedCount = items.filter((i) => i.completed).length;

  return (
    <Card id="setup">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Setup Checklist</CardTitle>
          <span className="text-sm text-muted-foreground">
            {completedCount} / {items.length} complete
          </span>
        </div>
        <Progress value={(completedCount / items.length) * 100} />
      </CardHeader>
      <CardContent className="space-y-1">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50"
          >
            {item.completed ? (
              <CheckCircle2 size={20} className="text-accent mt-0.5 shrink-0" />
            ) : (
              <Circle size={20} className="text-muted-foreground mt-0.5 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${item.completed ? "line-through text-muted-foreground" : ""}`}>
                {item.label}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
            </div>
            {item.action && !item.completed && (
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 text-xs h-7"
                onClick={item.action.onClick}
                asChild={!!item.action.href}
              >
                {item.action.href ? (
                  <a href={item.action.href}>{item.action.label}</a>
                ) : (
                  item.action.label
                )}
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

// Need Progress import
import { Progress } from "@/components/ui/progress";

export default SetupChecklist;
