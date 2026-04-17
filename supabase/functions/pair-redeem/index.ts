import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const code = typeof body.code === "string" ? body.code.trim().toUpperCase() : "";
    const deviceLabel =
      typeof body.deviceLabel === "string" ? body.deviceLabel.slice(0, 120) : null;

    if (!code || code.length < 4 || code.length > 16) {
      return new Response(JSON.stringify({ error: "Invalid code" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey);

    const { data: pair, error: pairErr } = await admin
      .from("extension_pair_codes")
      .select("id, user_id, expires_at, redeemed_at")
      .eq("code", code)
      .maybeSingle();

    if (pairErr || !pair) {
      return new Response(JSON.stringify({ error: "Code not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (pair.redeemed_at) {
      return new Response(JSON.stringify({ error: "Code already used" }), {
        status: 410,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (new Date(pair.expires_at).getTime() < Date.now()) {
      return new Response(JSON.stringify({ error: "Code expired" }), {
        status: 410,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate token
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    const token =
      "ext_" +
      Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

    const { error: tokenErr } = await admin.from("extension_tokens").insert({
      user_id: pair.user_id,
      token,
      device_label: deviceLabel,
    });
    if (tokenErr) {
      return new Response(JSON.stringify({ error: tokenErr.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await admin
      .from("extension_pair_codes")
      .update({ redeemed_at: new Date().toISOString() })
      .eq("id", pair.id);

    return new Response(JSON.stringify({ token, userId: pair.user_id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
