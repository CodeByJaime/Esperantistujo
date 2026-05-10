import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { post_id, value, user_id } = body;

    console.log(
      "=== VOTE DEBUG: Voting on post:",
      post_id,
      "with value:",
      value,
      "by user:",
      user_id,
    );

    if (!post_id || !value || !user_id || (value !== 1 && value !== -1)) {
      console.log("=== VOTE DEBUG: Invalid vote data:", {
        post_id,
        value,
        user_id,
      });
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
      console.error("=== VOTE DEBUG: Error checking existing vote:", voteError);
      throw voteError;
    }

    let voteChange = 0;

    if (existingVote) {
      // User is changing their vote
      if (existingVote.value === value) {
        // User is clicking the same vote, remove it
        console.log("=== VOTE DEBUG: Removing existing vote");
        voteChange = -existingVote.value;

        const { error: deleteError } = await supabase
          .from("votes")
          .delete()
          .eq("post_id", post_id)
          .eq("user_id", user_id);

        if (deleteError) throw deleteError;
      } else {
        // User is changing from upvote to downvote or vice versa
        console.log(
          "=== VOTE DEBUG: Changing vote from",
          existingVote.value,
          "to",
          value,
        );
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
      console.log("=== VOTE DEBUG: Adding new vote");
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
      console.error("=== VOTE DEBUG: Error fetching post:", fetchError);
      throw fetchError;
    }

    if (!currentPost) {
      console.log("=== VOTE DEBUG: Post not found:", post_id);
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
      console.error("=== VOTE DEBUG: Error updating vote:", updateError);
      throw updateError;
    }

    console.log("=== VOTE DEBUG: Vote processed successfully:", {
      post_id,
      vote_change: voteChange,
      old_count: currentPost.vote_count,
      new_count: newVoteCount,
    });

    // Return the updated post with user's current vote
    const finalVote = existingVote?.value === value ? null : value;

    return NextResponse.json({
      ...updatedPost,
      user_vote: finalVote,
    });
  } catch (error) {
    console.error("=== VOTE DEBUG: Error processing vote:", error);
    console.error(
      "=== VOTE DEBUG: Error details:",
      JSON.stringify(error, null, 2),
    );

    return NextResponse.json(
      {
        error: "Failed to process vote",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
