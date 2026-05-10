import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { post_id, value, user_id } = body;

    if (!post_id || !value || !user_id || (value !== 1 && value !== -1)) {
      return NextResponse.json({ error: "Invalid vote data" }, { status: 400 });
    }

    // Check if user has already voted on this post
    const { data: existingVote, error: voteError } = await supabase
      .from("votes")
      .select("*")
      .eq("post_id", post_id)
      .eq("user_id", user_id)
      .single();

    if (voteError && voteError.code !== "PGRST116") {
      throw voteError;
    }

    let voteChange = 0;

    if (existingVote) {
      // User is changing their vote
      if (existingVote.value === value) {
        // User is clicking the same vote, remove it
        voteChange = -existingVote.value;

        const { error: deleteError } = await supabase
          .from("votes")
          .delete()
          .eq("post_id", post_id)
          .eq("user_id", user_id);

        if (deleteError) throw deleteError;
      } else {
        // User is changing from upvote to downvote or vice versa
        voteChange = value - existingVote.value;

        const { error: updateError } = await supabase
          .from("votes")
          .update({ value })
          .eq("post_id", post_id)
          .eq("user_id", user_id);

        if (updateError) throw updateError;
      }
    } else {
      // New vote
      voteChange = value;

      const { error: insertError } = await supabase.from("votes").insert({
        post_id,
        user_id,
        value,
      });

      if (insertError) throw insertError;
    }

    // Update the post's vote count
    const { data: currentPost, error: fetchError } = await supabase
      .from("posts")
      .select("vote_count")
      .eq("id", post_id)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    if (!currentPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const newVoteCount = (currentPost.vote_count || 0) + voteChange;

    const { data: updatedPost, error: updateError } = await supabase
      .from("posts")
      .update({ vote_count: newVoteCount })
      .eq("id", post_id)
      .select("*")
      .single();

    if (updateError) {
      throw updateError;
    }

    // Return the updated post with user's current vote
    const finalVote = existingVote?.value === value ? null : value;

    return NextResponse.json({
      ...updatedPost,
      user_vote: finalVote,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to process vote",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
