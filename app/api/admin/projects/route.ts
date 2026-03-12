import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminSupabase } from "@/lib/supabase/admin";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const supabase = getAdminSupabase();
  if (!supabase) return NextResponse.json({ error: "Missing Supabase service role config." }, { status: 500 });

  const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const payload = await request.json();
  const supabase = getAdminSupabase();
  if (!supabase) return NextResponse.json({ error: "Missing Supabase service role config." }, { status: 500 });

  const { data, error } = await supabase.from("projects").insert(payload).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
