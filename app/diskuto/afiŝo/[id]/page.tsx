'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { AuthLayout } from '@/components/auth-layout';
import CommentSection from '@/components/comments/CommentSection';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/lib/i18n';
import type { Post } from '@/types/discussion';

export default function PostPage() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useTranslation();
  const params = useParams();
  const postId = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPost = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/posts/${postId}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data);
      }
    } catch (error) {
      console.error('Error loading post:', error);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  const handleVote = async (value: 1 | -1) => {
    try {
      const response = await fetch('/api/posts/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ post_id: postId, value }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setPost(updatedPost);
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white text-xl">{t('common.loading')}</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">
            {t('posts.notFound')}
          </h1>
          <p className="text-gray-400 mb-4">
            {t('posts.notFoundSubtitle')}
          </p>
          <Link
            href="/diskuto"
            className="text-esperanto-verda hover:text-esperanto-verda/80 underline"
          >
            {t('posts.backToFeed')}
          </Link>
        </div>
      </div>
    );
  }

  const getTypeIcon = (type: Post['type']) => {
    switch (type) {
      case 'discussion':
        return '💬';
      case 'news':
        return '📰';
      case 'question':
        return '❓';
      default:
        return '💬';
    }
  };

  const getTypeColor = (type: Post['type']) => {
    switch (type) {
      case 'discussion':
        return 'text-blue-400';
      case 'news':
        return 'text-yellow-400';
      case 'question':
        return 'text-purple-400';
      default:
        return 'text-blue-400';
    }
  };

  return (
    <AuthLayout user={user}>
      <div className="min-h-screen bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Link
              href="/diskuto"
              className="text-esperanto-verda hover:text-esperanto-verda/80 underline text-sm"
            >
              ← {t('posts.backToFeed')}
            </Link>
          </div>

          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 mb-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className={getTypeColor(post.type)}>{getTypeIcon(post.type)}</span>
                <span className="text-sm text-gray-400">{t(`posts.type.${post.type}`)}</span>
                {post.channel && (
                  <>
                    <span className="text-gray-600">•</span>
                    <Link
                      href={`/diskuto/${post.channel.slug}`}
                      className="text-sm text-esperanto-verda hover:underline"
                    >
                      {post.channel.name}
                    </Link>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleVote(1)}
                  className={`px-3 py-1 rounded transition-colors ${post.user_vote === 1
                    ? 'bg-esperanto-verda text-white'
                    : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a]'
                    }`}
                >
                  ▲
                </button>
                <span className="text-white font-medium min-w-8 text-center">
                  {post.vote_count}
                </span>
                <button
                  type="button"
                  onClick={() => handleVote(-1)}
                  className={`px-3 py-1 rounded transition-colors ${post.user_vote === -1
                    ? 'bg-red-600 text-white'
                    : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a]'
                    }`}
                >
                  ▼
                </button>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-white mb-4">
              {post.title}
            </h1>

            <div className="text-gray-200 whitespace-pre-wrap mb-6 text-lg">
              {post.content}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-400 border-t border-[#2a2a2a] pt-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-esperanto-verda rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {post.author?.user_metadata?.name?.[0]?.toUpperCase() ||
                      post.author?.email?.[0]?.toUpperCase() || 'A'}
                  </span>
                </div>
                <div>
                  <div className="text-white font-medium">
                    {post.author?.user_metadata?.name ||
                      post.author?.email?.split('@')[0]}
                  </div>
                  <div className="text-xs">
                    {new Date(post.created_at).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <CommentSection postId={postId} />
        </div>
      </div>
    </AuthLayout>
  );
}
