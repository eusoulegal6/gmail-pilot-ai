import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const SEND_SMART_URL =
  "https://uexdjvbdqwrzlgfrpgbl.supabase.co/functions/v1/review-list";
const SEND_SMART_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVleGRqdmJkcXdyemxnZnJwZ2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2NzE2NDEsImV4cCI6MjA5MDI0NzY0MX0.-BAr2q1F_2Kn-v0foNSfSvuRbGEnaom_kPZI-r7f6Nw";

export interface FlaggedEmail {
  id: string;
  createdAt: string;
  senderEmail: string;
  senderName: string | null;
  subject: string;
  snippet: string;
  reason?: string;
}

interface FlaggedEmailsResponse {
  items: FlaggedEmail[];
}

export function useFlaggedEmails() {
  const query = useQuery<FlaggedEmailsResponse>({
    queryKey: ["flagged-emails"],
    staleTime: 30_000,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not signed in");
      }

      const res = await fetch(SEND_SMART_URL, {
        method: "GET",
        headers: {
          apikey: SEND_SMART_ANON_KEY,
          Authorization: `Bearer ${session.access_token}`,
        },
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

      return (await res.json()) as FlaggedEmailsResponse;
    },
  });

  return {
    items: query.data?.items ?? [],
    isLoading: query.isLoading,
    error: query.error as Error | null,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
}
