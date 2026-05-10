'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import type { Comment } from '@/types/discussion';

interface CommentItemProps {
  comment: Comment;
  onReply?: (parentId: string, content: string) => void;
  depth?: number;
}

export default function CommentItem({
  comment,
  onReply,
  depth = 0
}: CommentItemProps) {
  const { t } = useTranslation();
  const [replyContent, setReplyContent] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!replyContent.trim() || !onReply) return;

    setLoading(true);
    try {
      await onReply(comment.id, replyContent.trim());
      setReplyContent('');
      setShowReplyForm(false);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const maxDepth = 1;
  const canReply = depth < maxDepth;

  return (
    <div className={`${depth > 0 ? 'ml-6 pl-4 border-l-2 border-white/20' : ''}`}>
      <div className="bg-white/10 border border-white/20 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-esperanto-verda rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {comment.profiles?.esperanto_name?.[0]?.toUpperCase() ||
                  comment.profiles?.display_name?.[0]?.toUpperCase() || 'A'}
              </span>
            </div>
            <div>
              <div className="text-white font-medium">
                {comment.profiles?.esperanto_name ||
                  comment.profiles?.display_name || 'Anonima'}
              </div>
              <div className="text-white/60 text-xs">
                {new Date(comment.created_at).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="text-white/60 whitespace-pre-wrap mb-3">
          {comment.content}
        </div>

        {canReply && (
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-sm text-esperanto-verda hover:text-esperanto-verda/80 transition-colors"
            >
              {showReplyForm ? t('comments.cancel') : t('comments.reply')}
            </button>
          </div>
        )}

        {showReplyForm && canReply && (
          <form onSubmit={handleReply} className="mt-3 space-y-3">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={t('comments.replyPlaceholder')}
              rows={3}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-esperanto-verda focus:bg-white/15 transition-all resize-none text-sm font-sans-dm"
              required
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading || !replyContent.trim()}
                className="px-4 py-1 bg-esperanto-verda text-white text-sm rounded hover:bg-esperanto-verda/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-sans-dm"
              >
                {loading ? t('common.loading') : t('comments.submit')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowReplyForm(false);
                  setReplyContent('');
                }}
                className="px-4 py-1 bg-white/10 text-white text-sm rounded hover:bg-white/20 transition-colors font-sans-dm"
              >
                {t('comments.cancel')}
              </button>
            </div>
          </form>
        )}
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2 space-y-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
