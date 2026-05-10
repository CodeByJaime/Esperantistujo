'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import type { Post } from '@/types/discussion';
import PostCard from './PostCard';

interface PostFeedProps {
  channelSlug?: string;
  initialPosts?: Post[];
  newPost?: Post;
  onRefresh?: () => void;
}

export default function PostFeed({ channelSlug, initialPosts = [], newPost, onRefresh }: PostFeedProps) {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // Add new post to the beginning of the list
  useEffect(() => {
    if (newPost) {
      setPosts(prev => {
        // Check if post already exists to avoid duplicates
        const existingIds = new Set(prev.map(post => post.id));
        if (!existingIds.has(newPost.id)) {
          return [newPost, ...prev];
        }
        return prev;
      });
    }
  }, [newPost]);

  const loadMorePosts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/posts?channel=${channelSlug || ''}&page=${page + 1}&limit=10`
      );

      if (response.ok) {
        const newPosts = await response.json();
        if (newPosts.length === 0) {
          setHasMore(false);
        } else {
          setPosts(prev => {
            const existingIds = new Set(prev.map(post => post.id));
            const filteredNewPosts = newPosts.filter((post: Post) => !existingIds.has(post.id));
            return [...prev, ...filteredNewPosts];
          });
          setPage(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (postId: string, value: 1 | -1) => {
    // This would need user context, but for now we'll pass it through the props
    // In a real implementation, you'd get user from context
    console.log('Vote handling in PostFeed needs user context');
  };

  if (posts.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <div className="text-white/60 text-lg mb-2">
          {channelSlug ? t('posts.empty.channel') : t('posts.empty.global')}
        </div>
        <p className="text-white/50 text-sm">
          {t('posts.empty.subtitle')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onVote={handleVote} />
      ))}

      {hasMore && (
        <div className="text-center py-4">
          <button
            type="button"
            onClick={loadMorePosts}
            disabled={loading}
            className="px-6 py-2 bg-esperanto-verda text-white rounded-lg hover:bg-esperanto-verda/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-sans-dm text-sm font-medium"
          >
            {loading ? t('common.loading') : t('posts.loadMore')}
          </button>
        </div>
      )}
    </div>
  );
}
