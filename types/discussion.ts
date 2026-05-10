export interface Channel {
  id: string;
  slug: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface Post {
  id: string;
  channel_id: string;
  author_id: string;
  title: string;
  content: string;
  type: "discussion" | "news" | "question";
  vote_count: number;
  created_at: string;
  channel?: Channel;
  profiles?: {
    id: string;
    display_name: string | null;
    esperanto_name: string | null;
  } | null;
  comments_count?: number;
  user_vote?: 1 | -1 | null;
}

export interface Comment {
  id: string;
  post_id: string;
  parent_id?: string;
  author_id: string;
  content: string;
  created_at: string;
  profiles?: {
    id: string;
    display_name: string | null;
    esperanto_name: string | null;
  } | null;
  replies?: Comment[];
}

export interface Vote {
  id: string;
  user_id: string;
  post_id: string;
  value: 1 | -1;
}

export const getAuthorName = (
  author: Post["profiles"],
  t?: (key: string) => string,
) => {
  return (
    author?.esperanto_name ??
    author?.display_name ??
    (t ? t("ui.anonymous") : "Anonima")
  );
};
