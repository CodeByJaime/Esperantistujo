'use client';

import { ChevronDown, ChevronUp, HelpCircle, MessageCircle, Newspaper } from 'lucide-react';
import Link from 'next/link';
import { formatDate, useTranslation } from '@/lib/i18n';
import type { Post } from '@/types/discussion';
import { getAuthorName } from '@/types/discussion';

interface PostCardProps {
  post: Post;
  onVote?: (postId: string, value: 1 | -1) => void;
}

export default function PostCard({ post, onVote }: PostCardProps) {
  const { t, language } = useTranslation();

  const getTypeIcon = (type: Post['type']) => {
    switch (type) {
      case 'discussion':
        return <MessageCircle className="w-4 h-4" />;
      case 'news':
        return <Newspaper className="w-4 h-4" />;
      case 'question':
        return <HelpCircle className="w-4 h-4" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
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
            <ChevronUp className="w-4 h-4" />
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
            <ChevronDown className="w-4 h-4" />
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
              {getAuthorName(post.profiles, t)?.[0]?.toUpperCase() || 'A'}
            </span>
          </div>
          <span>
            {getAuthorName(post.profiles, t)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {post.comments_count !== undefined && (
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{post.comments_count}</span>
            </span>
          )}
          <span className="text-xs">
            {formatDate(new Date(post.created_at), language)}
          </span>
        </div>
      </div>
    </Link>
  );
}
