import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const RESOLVE_URL =
  "https://uexdjvbdqwrzlgfrpgbl.supabase.co/functions/v1/review-resolve";
const SEND_SMART_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVleGRqdmJkcXdyemxnZnJwZ2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2NzE2NDEsImV4cCI6MjA5MDI0NzY0MX0.-BAr2q1F_2Kn-v0foNSfSvuRbGEnaom_kPZI-r7f6Nw";

interface FlaggedListCache {
  items: { id: string }[];
}

export function useResolveFlagged() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Not signed in");

      const res = await fetch(RESOLVE_URL, {
        method: "POST",
        headers: {
          apikey: SEND_SMART_ANON_KEY,
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        let message = `Request failed (${res.status})`;
        try {
          const body = await res.json();
          if (body?.error) message = body.error;
        } catch {
          // ignore
        }
        throw new Error(message);
      }
      return id;
    },
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["flagged-emails"] });
      const previous = qc.getQueryData<FlaggedListCache>(["flagged-emails"]);
      if (previous) {
        qc.setQueryData<FlaggedListCache>(["flagged-emails"], {
          ...previous,
          items: previous.items.filter((item) => item.id !== id),
        });
      }
      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) {
        qc.setQueryData(["flagged-emails"], ctx.previous);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["flagged-emails"] });
    },
  });
}
