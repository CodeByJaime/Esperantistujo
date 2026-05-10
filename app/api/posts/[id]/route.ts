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

    // First, let's check if any posts exist at all
    const { data: allPosts, error: allError } = await supabase
      .from("posts")
      .select("id, title, created_at")
      .limit(5);

    if (allError) {
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

    if (error) {
      throw error;
    }

    if (!post) {
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
      }
    }

    return NextResponse.json({
      ...post,
      user_vote: userVote,
    });
  } catch (error) {
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
      throw fetchError;
    }

    if (!currentPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (currentPost.author_id !== user_id) {
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
      throw updateError;
    }

    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to update post",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { user_id } = body;

    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    // First, check if user is the author
    const { data: currentPost, error: fetchError } = await supabase
      .from("posts")
      .select("author_id")
      .eq("id", id)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    if (!currentPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (currentPost.author_id !== user_id) {
      return NextResponse.json(
        { error: "Not authorized to delete this post" },
        { status: 403 },
      );
    }

    // First delete all votes associated with this post
    const { error: votesDeleteError } = await supabase
      .from("votes")
      .delete()
      .eq("post_id", id);

    if (votesDeleteError) {
      throw votesDeleteError;
    }

    // Then delete all comments associated with this post
    const { error: commentsDeleteError } = await supabase
      .from("comments")
      .delete()
      .eq("post_id", id);

    if (commentsDeleteError) {
      throw commentsDeleteError;
    }

    // Finally delete the post
    const { error: deleteError } = await supabase
      .from("posts")
      .delete()
      .eq("id", id);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to delete post",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
