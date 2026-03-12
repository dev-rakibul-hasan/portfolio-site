import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminSupabase } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

    const supabase = getAdminSupabase();
    if (!supabase) return NextResponse.json({ error: "Missing Supabase configuration." }, { status: 500 });

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folderField = formData.get("folder");
    const folder =
      typeof folderField === "string" && /^[a-z0-9-/]+$/i.test(folderField)
        ? folderField
        : "profile-images";

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image." }, { status: 400 });
    }

    // Create unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${folder.replace(/\//g, "_")}_${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("portfolio")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload Error:", uploadError);
      return NextResponse.json({ error: "Failed to upload image." }, { status: 500 });
    }

    // Get public URL
    const { data } = supabase.storage.from("portfolio").getPublicUrl(uploadData.path);
    const publicUrl = data.publicUrl;

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
