import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminSupabase } from "@/lib/supabase/admin";

type Params = { params: { id: string } };

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const { id } = params;
  const payload = await request.json();
  const supabase = getAdminSupabase();
  if (!supabase) return NextResponse.json({ error: "Missing Supabase service role config." }, { status: 500 });

  const { data, error } = await supabase.from("projects").update(payload).eq("id", id).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function DELETE(_request: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const { id } = params;
  const supabase = getAdminSupabase();
  if (!supabase) return NextResponse.json({ error: "Missing Supabase service role config." }, { status: 500 });

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
