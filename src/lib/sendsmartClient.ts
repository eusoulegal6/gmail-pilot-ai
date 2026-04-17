import { createClient } from "@supabase/supabase-js";

export const SENDSMART_URL = "https://uexdjvbdqwrzlgfrpgbl.supabase.co";
export const SENDSMART_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVleGRqdmJkcXdyemxnZnJwZ2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2NzE2NDEsImV4cCI6MjA5MDI0NzY0MX0.-BAr2q1F_2Kn-v0foNSfSvuRbGEnaom_kPZI-r7f6Nw";
export const SENDSMART_FUNCTIONS_URL = `${SENDSMART_URL}/functions/v1`;

export const sendsmartSupabase = createClient(SENDSMART_URL, SENDSMART_ANON_KEY, {
  auth: {
    storage: localStorage,
    storageKey: "sb-sendsmart-auth",
    persistSession: true,
    autoRefreshToken: true,
  },
});
