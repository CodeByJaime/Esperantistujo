import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    console.log("Fetching post with ID:", id);

    const { data: post, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Supabase GET error:", error);
      throw error;
    }

    if (!post) {
      console.log("Post not found with ID:", id);
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    console.log("Post fetched successfully:", post.id);
    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));

    return NextResponse.json(
      {
        error: "Failed to fetch post",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
