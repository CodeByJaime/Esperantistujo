import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");

    console.log("=== DEBUG: Fetching post with ID:", id, "for user:", userId);
    console.log("=== DEBUG: ID type:", typeof id);
    console.log("=== DEBUG: ID length:", id?.length);

    // First, let's check if any posts exist at all
    const { data: allPosts, error: allError } = await supabase
      .from("posts")
      .select("id, title, created_at")
      .limit(5);

    console.log(
      "=== DEBUG: All posts:",
      allPosts?.map((p) => ({ id: p.id, title: p.title })),
    );

    if (allError) {
      console.error("=== DEBUG: Error fetching all posts:", allError);
    }

    // Now try to find the specific post with user's vote
    // For now, we'll get the post without user vote since we don't have user_id here
    // In a real implementation, you'd need to pass user_id or get it from auth
    const { data: post, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    console.log("=== DEBUG: Supabase query result:", { post, error });

    if (error) {
      console.error("=== DEBUG: Supabase GET error:", error);
      console.error(
        "=== DEBUG: Error details:",
        JSON.stringify(error, null, 2),
      );
      throw error;
    }

    if (!post) {
      console.log("=== DEBUG: Post not found with ID:", id);
      return NextResponse.json(
        {
          error: "Post not found",
          debug: { id, totalPosts: allPosts?.length },
        },
        { status: 404 },
      );
    }

    // Fetch user's vote if userId is provided
    let userVote = null;
    if (userId) {
      const { data: vote, error: voteError } = await supabase
        .from("votes")
        .select("value")
        .eq("post_id", id)
        .eq("user_id", userId)
        .single();

      if (!voteError && vote) {
        userVote = vote.value;
        console.log("=== DEBUG: User vote found:", userVote);
      }
    }

    console.log("=== DEBUG: Post fetched successfully:", post.id);
    return NextResponse.json({
      ...post,
      user_vote: userVote,
    });
  } catch (error) {
    console.error("=== DEBUG: Error fetching post:", error);
    console.error("=== DEBUG: Error details:", JSON.stringify(error, null, 2));

    return NextResponse.json(
      {
        error: "Failed to fetch post",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
