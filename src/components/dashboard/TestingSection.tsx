import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Eye, Zap, CheckCircle, Mail } from "lucide-react";

const TestingSection = () => {
  return (
    <Card id="testing">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ShieldCheck size={18} className="text-primary" />
          Get Started Safely
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Send Smart is designed to give you full control. Follow these steps to build confidence before enabling automation.
        </p>

        <div className="space-y-3">
          <div className="flex gap-3 rounded-lg border border-border p-4">
            <Eye size={20} className="text-accent shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Start with Review Mode</p>
              <p className="text-xs text-muted-foreground mt-1">
                In Review Mode, the AI drafts replies but waits for your approval before sending. You see every response and can edit or dismiss it. This is the safest way to start.
              </p>
            </div>
          </div>

          <div className="flex gap-3 rounded-lg border border-border p-4">
            <CheckCircle size={20} className="text-accent shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Verify your settings</p>
              <p className="text-xs text-muted-foreground mt-1">
                Make sure your business context, tone, and signature are set correctly. The quality of AI replies depends directly on the information you provide.
              </p>
            </div>
          </div>

          <div className="flex gap-3 rounded-lg border border-border p-4">
            <Mail size={20} className="text-accent shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Send Smart uses a dedicated unread view</p>
              <p className="text-xs text-muted-foreground mt-1">
                The extension works from a special Gmail view that surfaces only your unread emails. This ensures reliable detection and prevents replies to already-handled conversations.
              </p>
            </div>
          </div>

          <div className="flex gap-3 rounded-lg border border-border p-4">
            <Zap size={20} className="text-accent shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Upgrade to Auto-Send when ready</p>
              <p className="text-xs text-muted-foreground mt-1">
                Once you're confident in the replies, switch to Auto-Send Mode. The AI will draft and send replies automatically — no manual approval required.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestingSection;
