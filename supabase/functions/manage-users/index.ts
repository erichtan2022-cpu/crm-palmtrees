import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { createClient } = await import("npm:@supabase/supabase-js@2.49.4");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const body = await req.json();
    const action = body.action;

    // ── LIST ──────────────────────────────────────────────
    if (action === "list") {
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("id, name, role, avatar, child_ids, created_at");

      if (profileError) {
        return new Response(
          JSON.stringify({ error: profileError.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

      if (authError) {
        return new Response(
          JSON.stringify({ error: authError.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const users = (profiles || []).map((p: any) => {
        const au = (authUsers.users || []).find((u: any) => u.id === p.id);
        return {
          id: p.id,
          name: p.name,
          email: au?.email || "",
          role: p.role,
          avatar: p.avatar,
          childIds: p.child_ids || [],
          banned: au?.banned_at != null,
          createdAt: p.created_at,
        };
      });

      return new Response(
        JSON.stringify({ users }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ── CREATE ─────────────────────────────────────────────
    if (action === "create") {
      const { email, password, name, role, childIds } = body;

      if (!email || !password || !name || !role) {
        return new Response(
          JSON.stringify({ error: "Missing required fields: email, password, name, role" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          name,
          role,
          avatar: "",
          child_ids: childIds || [],
        },
      });

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      // Update the profile row that the trigger created
      if (data.user) {
        await supabase
          .from("profiles")
          .update({ name, role, child_ids: childIds || [] })
          .eq("id", data.user.id);
      }

      return new Response(
        JSON.stringify({ success: true, userId: data.user?.id }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ── UPDATE ─────────────────────────────────────────────
    if (action === "update") {
      const { userId, name, role, childIds } = body;

      if (!userId) {
        return new Response(
          JSON.stringify({ error: "Missing userId" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const { error } = await supabase
        .from("profiles")
        .update({ name, role, child_ids: childIds || [] })
        .eq("id", userId);

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ── RESET PASSWORD ────────────────────────────────────
    if (action === "reset_password") {
      const { userId, newPassword } = body;

      if (!userId || !newPassword) {
        return new Response(
          JSON.stringify({ error: "Missing userId or newPassword" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const { error } = await supabase.auth.admin.updateUserById(userId, {
        password: newPassword,
      });

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ── BAN / UNBAN ────────────────────────────────────────
    if (action === "ban") {
      const { userId, ban } = body;

      if (!userId) {
        return new Response(
          JSON.stringify({ error: "Missing userId" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      let error;
      if (ban) {
        const res = await supabase.auth.admin.updateUserById(userId, { ban_duration: "876000h" });
        error = res.error;
      } else {
        const res = await supabase.auth.admin.updateUserById(userId, { ban_duration: "none" });
        error = res.error;
      }

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ── DELETE ─────────────────────────────────────────────
    if (action === "delete") {
      const { userId } = body;

      if (!userId) {
        return new Response(
          JSON.stringify({ error: "Missing userId" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ error: "Unknown action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
