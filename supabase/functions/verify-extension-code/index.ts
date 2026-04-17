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
    const { email, code } = await req.json().catch(() => ({}));

    if (
      typeof email !== "string" ||
      typeof code !== "string" ||
      !/^\d{6}$/.test(code)
    ) {
      return new Response(
        JSON.stringify({ error: "Invalid email or code" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey);

    // Find user by email
    const { data: userList, error: userErr } = await admin.auth.admin
      .listUsers({ page: 1, perPage: 200 });
    if (userErr) {
      console.error("listUsers error", userErr);
      return new Response(JSON.stringify({ error: "Lookup failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const user = userList.users.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase(),
    );
    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid code" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Find a matching unused, unexpired code
    const { data: rows, error: selErr } = await admin
      .from("extension_login_codes")
      .select("id, expires_at, used_at")
      .eq("user_id", user.id)
      .eq("code", code)
      .is("used_at", null)
      .gt("expires_at", new Date().toISOString())
      .limit(1);

    if (selErr) {
      console.error("select error", selErr);
      return new Response(JSON.stringify({ error: "Verification failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!rows || rows.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid or expired code" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Mark the code as used
    await admin
      .from("extension_login_codes")
      .update({ used_at: new Date().toISOString() })
      .eq("id", rows[0].id);

    // Issue a session via magic link generator (returns hashed_token we can exchange)
    // We use generateLink + verifyOtp style by creating a new magic link and immediately
    // exchanging its token_hash for a session.
    const { data: linkData, error: linkErr } = await admin.auth.admin
      .generateLink({
        type: "magiclink",
        email: user.email!,
      });

    if (linkErr || !linkData?.properties?.hashed_token) {
      console.error("generateLink error", linkErr);
      return new Response(JSON.stringify({ error: "Could not create session" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ??
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;
    const publicClient = createClient(supabaseUrl, anonKey);
    const { data: verified, error: verifyErr } = await publicClient.auth
      .verifyOtp({
        type: "magiclink",
        token_hash: linkData.properties.hashed_token,
      });

    if (verifyErr || !verified?.session) {
      console.error("verifyOtp error", verifyErr);
      return new Response(JSON.stringify({ error: "Could not create session" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        access_token: verified.session.access_token,
        refresh_token: verified.session.refresh_token,
        expires_at: verified.session.expires_at,
        expires_in: verified.session.expires_in,
        token_type: verified.session.token_type,
        user: { id: user.id, email: user.email },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
