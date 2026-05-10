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
  author?: {
    id: string;
    email: string;
    user_metadata?: {
      name?: string;
      avatar_url?: string;
    };
  };
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
  author?: {
    id: string;
    email: string;
    user_metadata?: {
      name?: string;
      avatar_url?: string;
    };
  };
  replies?: Comment[];
}

export interface Vote {
  id: string;
  user_id: string;
  post_id: string;
  value: 1 | -1;
}
