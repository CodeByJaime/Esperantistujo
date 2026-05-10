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
      .select(`
        *,
        profiles!posts_author_id_fkey(id, display_name, esperanto_name)
      `)
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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, content, user_id } = body;

    console.log("=== DEBUG: Updating post:", id, "by user:", user_id);

    if (!title || !content || !user_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // First, check if user is the author
    const { data: currentPost, error: fetchError } = await supabase
      .from("posts")
      .select("author_id")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("=== DEBUG: Error fetching post:", fetchError);
      throw fetchError;
    }

    if (!currentPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (currentPost.author_id !== user_id) {
      console.log(
        "=== DEBUG: User not authorized:",
        user_id,
        "post author:",
        currentPost.author_id,
      );
      return NextResponse.json(
        { error: "Not authorized to edit this post" },
        { status: 403 },
      );
    }

    // Update the post
    const { data: updatedPost, error: updateError } = await supabase
      .from("posts")
      .update({ title, content })
      .eq("id", id)
      .select("*")
      .single();

    if (updateError) {
      console.error("=== DEBUG: Error updating post:", updateError);
      throw updateError;
    }

    console.log("=== DEBUG: Post updated successfully:", updatedPost.id);
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("=== DEBUG: Error updating post:", error);
    console.error("=== DEBUG: Error details:", JSON.stringify(error, null, 2));

    return NextResponse.json(
      {
        error: "Failed to update post",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
