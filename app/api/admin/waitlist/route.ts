import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function checkAuth(request: NextRequest) {
  const token = request.headers.get("x-admin-token");
  return ADMIN_TOKEN && token === ADMIN_TOKEN;
}

// GET — list all waitlist entries
export async function GET(request: NextRequest) {
  if (!checkAuth(request)) return unauthorized();

  const { searchParams } = new URL(request.url);
  const page   = Math.max(0, parseInt(searchParams.get("page") ?? "0", 10));
  const limit  = Math.min(100, parseInt(searchParams.get("limit") ?? "50", 10));
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  let query = supabaseAdmin
    .from("waitlist")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);

  if (status) query = query.eq("status", status);
  if (search) query = query.ilike("email", `%${search}%`);

  const { data, error, count } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Stats
  const { data: stats } = await supabaseAdmin
    .from("waitlist_stats")
    .select("*")
    .single();

  return NextResponse.json({ data, count, stats, page, limit });
}

// PATCH — update a single entry's status
export async function PATCH(request: NextRequest) {
  if (!checkAuth(request)) return unauthorized();

  const { id, status } = await request.json();

  const allowed = ["pending", "invited", "converted", "unsubscribed"];
  if (!id || !allowed.includes(status)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("waitlist")
    .update({ status })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

// DELETE — remove an entry
export async function DELETE(request: NextRequest) {
  if (!checkAuth(request)) return unauthorized();

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { error } = await supabaseAdmin
    .from("waitlist")
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
