import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Mail, CheckCircle2, X, Eye } from "lucide-react";
import type { AgentReply } from "@/hooks/useAgentReplies";
import { cn } from "@/lib/utils";

const dtf = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});
const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

function relativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = diffMs / 3_600_000;
  if (hours < 1) {
    const mins = Math.max(1, Math.round(diffMs / 60_000));
    return rtf.format(-mins, "minute");
  }
  if (hours < 24) return rtf.format(-Math.round(hours), "hour");
  return rtf.format(-Math.round(hours / 24), "day");
}

export default function AgentReplyCard({
  reply,
  onDismiss,
}: {
  reply: AgentReply;
  onDismiss: () => void;
}) {
  const [open, setOpen] = useState(false);
  const displayName = reply.senderEmail;
  const replyId = reply.id ?? `${reply.createdAt}-${reply.senderEmail}`;

  return (
    <>
      <Card
        className="border-l-4 border-l-emerald-500 transition-colors hover:border-primary/40 cursor-pointer relative"
        onClick={() => setOpen(true)}
      >
        <button
          type="button"
          className="absolute top-2 right-2 rounded-full p-1 opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity hover:bg-muted"
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          aria-label="Dismiss"
          title="Dismiss"
        >
          <X size={14} className="text-muted-foreground" />
        </button>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-sm font-medium truncate">
                <Mail size={14} className="text-muted-foreground shrink-0" />
                <span className="truncate">{displayName}</span>
              </div>
            </div>
            <span className="shrink-0 inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 text-[11px] font-medium">
              <CheckCircle2 size={11} />
              Replied
            </span>
          </div>

          <div className="space-y-1">
            <p className="font-semibold text-sm leading-snug line-clamp-1">
              {reply.subject || "(no subject)"}
            </p>
            {reply.replyBody ? (
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {reply.replyBody}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                AI sent a reply to this email.
              </p>
            )}
          </div>

          <div className="pt-1 border-t border-border/50 flex items-center justify-between gap-2">
            <span className="text-[11px] text-muted-foreground">
              {relativeTime(reply.createdAt)} · {dtf.format(new Date(reply.createdAt))}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-primary font-medium">
              <Eye size={12} />
              View reply
            </span>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail size={16} className="text-muted-foreground" />
              {reply.subject || "(no subject)"}
            </DialogTitle>
            <DialogDescription>
              Reply sent to {reply.senderEmail}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="rounded-md border bg-muted/30 p-4">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                AI Reply
              </p>
              {reply.replyBody ? (
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {reply.replyBody}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Reply content is not available for this message.
                </p>
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              Sent {dtf.format(new Date(reply.createdAt))} · {relativeTime(reply.createdAt)}
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setOpen(false);
                onDismiss();
              }}
            >
              <X size={14} className="mr-1" />
              Dismiss
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
