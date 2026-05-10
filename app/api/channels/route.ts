import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // First, ensure the default "General" channel exists
    const { data: existingChannel, error: checkError } = await supabase
      .from("channels")
      .select("*")
      .eq("slug", "general")
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      throw checkError;
    }

    // Create default channel if it doesn't exist
    if (!existingChannel) {
      const { error: insertError } = await supabase
        .from("channels")
        .insert({
          name: "General",
          slug: "general",
          description: "Canal general para discusiones abiertas",
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }
    }

    // Get all channels
    const { data: channels, error: fetchError } = await supabase
      .from("channels")
      .select("*")
      .order("created_at", { ascending: true });

    if (fetchError) {
      throw fetchError;
    }

    return NextResponse.json(channels || []);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch channels" },
      { status: 500 },
    );
  }
}
