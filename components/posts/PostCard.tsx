'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import type { Post } from '@/types/discussion';

interface PostCardProps {
  post: Post;
  onVote?: (postId: string, value: 1 | -1) => void;
}

export default function PostCard({ post, onVote }: PostCardProps) {
  const { t } = useTranslation();

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
    <Link
      href={`/diskuto/${post.channel?.slug || 'general'}/afiso/${post.id}`}
      className="block bg-white/10 border border-white/20 rounded-lg p-4 hover:border-esperanto-verda/30 transition-colors duration-200"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={getTypeColor(post.type)}>{getTypeIcon(post.type)}</span>
          <span className="text-sm text-white/60">{t(`posts.type.${post.type}`)}</span>
          {post.channel && (
            <>
              <span className="text-white/60 text-xs">•</span>
              <Link
                href={`/diskuto/${post.channel.slug}`}
                className="text-sm text-esperanto-verda hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {post.channel.name}
              </Link>
            </>
          )}
        </div>
        <div className="flex items-center gap-1 text-sm">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onVote?.(post.id, 1);
            }}
            className="text-white/70 hover:text-esperanto-verda transition-colors"
            disabled={!onVote}
          >
            ▲
          </button>
          <span className="text-white font-medium">{post.vote_count}</span>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onVote?.(post.id, -1);
            }}
            className="text-white/70 hover:text-red-400 transition-colors"
            disabled={!onVote}
          >
            ▼
          </button>
        </div>
      </div>

      <h3 className="text-white font-semibold text-lg mb-2 hover:text-esperanto-verda transition-colors">
        {post.title}
      </h3>

      <p className="text-white/60 text-sm mb-3 line-clamp-2">
        {post.content}
      </p>

      <div className="flex items-center justify-between text-sm text-white/60">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-esperanto-verda rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {post.profiles?.esperanto_name?.[0]?.toUpperCase() ||
                post.profiles?.display_name?.[0]?.toUpperCase() || 'A'}
            </span>
          </div>
          <span>
            {post.profiles?.esperanto_name ||
              post.profiles?.display_name || 'Anonima'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {post.comments_count !== undefined && (
            <span className="flex items-center gap-1">
              <span>💬</span>
              <span>{post.comments_count}</span>
            </span>
          )}
          <span className="text-xs">
            {new Date(post.created_at).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      </div>
    </Link>
  );
}
