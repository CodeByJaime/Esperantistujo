import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: posts, error } = await supabase
      .from("posts")
      .select(`
        *,
        profiles (
          id, 
          display_name, 
          esperanto_name
        ),
        comments!comments_post_id_fkey(count)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(posts || []);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch posts",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, type, channel_id, author_id } = body;

    if (!title || !content || !type || !channel_id || !author_id) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: { title, content, type, channel_id, author_id },
        },
        { status: 400 },
      );
    }

    const { data: post, error } = await supabase
      .from("posts")
      .insert({
        title,
        content,
        type,
        channel_id,
        author_id,
        vote_count: 0,
      })
      .select(`
        *,
        profiles!posts_author_id_fkey(id, display_name, esperanto_name)
      `)
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "object" && error !== null) {
      errorMessage = JSON.stringify(error);
    } else {
      errorMessage = String(error);
    }

    return NextResponse.json(
      {
        error: "Failed to create post",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}
