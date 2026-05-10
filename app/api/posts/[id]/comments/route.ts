import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { Comment } from "@/types/discussion";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    console.log("=== COMMENTS DEBUG: Fetching comments for post:", id);

    const { data: comments, error } = await supabase
      .from("comments")
      .select(`
        *,
        profiles!comments_author_id_fkey(id, display_name, esperanto_name)
      `)
      .eq("post_id", id)
      .order("created_at", { ascending: true });

    console.log(
      "=== COMMENTS DEBUG: Raw comments data:",
      JSON.stringify(comments, null, 2),
    );

    // Build hierarchical structure
    const buildCommentTree = (comments: Comment[]) => {
      const commentMap = new Map<string, Comment & { replies: Comment[] }>();
      const rootComments: (Comment & { replies: Comment[] })[] = [];

      // Create map of all comments
      comments.forEach((comment) => {
        commentMap.set(comment.id, { ...comment, replies: [] });
      });

      // Build tree structure
      comments.forEach((comment) => {
        const commentNode = commentMap.get(comment.id);
        if (!commentNode) return;

        if (comment.parent_id) {
          const parent = commentMap.get(comment.parent_id);
          if (parent) {
            parent.replies.push(commentNode);
          }
        } else {
          rootComments.push(commentNode);
        }
      });

      return rootComments;
    };

    const hierarchicalComments = buildCommentTree(comments || []);

    if (error) {
      console.error("=== COMMENTS DEBUG: Error fetching comments:", error);
      throw error;
    }

    console.log(
      "=== COMMENTS DEBUG: Comments fetched successfully:",
      hierarchicalComments.length,
    );
    return NextResponse.json(hierarchicalComments);
  } catch (error) {
    console.error("=== COMMENTS DEBUG: Error fetching comments:", error);
    console.error(
      "=== COMMENTS DEBUG: Error details:",
      JSON.stringify(error, null, 2),
    );

    return NextResponse.json(
      {
        error: "Failed to fetch comments",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { content, author_id, parent_id } = body;

    console.log(
      "=== COMMENTS DEBUG: Creating comment for post:",
      id,
      "by user:",
      author_id,
    );

    if (!content || !author_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const { data: comment, error } = await supabase
      .from("comments")
      .insert({
        post_id: id,
        content,
        author_id,
        parent_id: parent_id || null,
      })
      .select(`
        *,
        profiles!comments_author_id_fkey(id, display_name, esperanto_name)
      `)
      .single();

    if (error) {
      console.error("=== COMMENTS DEBUG: Error creating comment:", error);
      throw error;
    }

    console.log(
      "=== COMMENTS DEBUG: Comment created successfully:",
      comment.id,
    );
    return NextResponse.json(comment);
  } catch (error) {
    console.error("=== COMMENTS DEBUG: Error creating comment:", error);
    console.error(
      "=== COMMENTS DEBUG: Error details:",
      JSON.stringify(error, null, 2),
    );

    return NextResponse.json(
      {
        error: "Failed to create comment",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
