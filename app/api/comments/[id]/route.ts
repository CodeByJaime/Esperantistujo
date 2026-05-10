import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json({ error: "Missing content" }, { status: 400 });
    }

    // First, check if comment exists and get author
    const { data: currentComment, error: fetchError } = await supabase
      .from("comments")
      .select("author_id")
      .eq("id", id)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    if (!currentComment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Update the comment
    const { data: updatedComment, error: updateError } = await supabase
      .from("comments")
      .update({ content })
      .eq("id", id)
      .select("*")
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json(updatedComment);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to update comment",
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

    // First, check if comment exists
    const { data: currentComment, error: fetchError } = await supabase
      .from("comments")
      .select("id")
      .eq("id", id)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    if (!currentComment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Delete the comment and all its replies (cascading deletion)
    // Using a recursive approach to delete all child comments
    const deleteCommentAndReplies = async (commentId: string) => {
      // First, get all direct replies to this comment
      const { data: replies, error: repliesError } = await supabase
        .from("comments")
        .select("id")
        .eq("parent_id", commentId);

      if (repliesError) {
        throw repliesError;
      }

      // Recursively delete all replies
      if (replies && replies.length > 0) {
        for (const reply of replies) {
          await deleteCommentAndReplies(reply.id);
        }
      }

      // Delete the comment itself
      const { error: deleteError } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);

      if (deleteError) {
        throw deleteError;
      }
    };

    await deleteCommentAndReplies(id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to delete comment",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
