'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import type { Comment } from '@/types/discussion';
import CommentItem from './CommentItem';

interface CommentSectionProps {
    postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
    const { t } = useTranslation();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const loadComments = useCallback(async () => {
        try {
            const response = await fetch(`/api/posts/${postId}/comments`);
            if (response.ok) {
                const data = await response.json();
                setComments(data);
            }
        } catch (error) {
            console.error('Error loading comments:', error);
        } finally {
            setLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        loadComments();
    }, [loadComments]);

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            const response = await fetch(`/api/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: newComment.trim(),
                }),
            });

            if (response.ok) {
                const newCommentData = await response.json();
                setComments(prev => [newCommentData, ...prev]);
                setNewComment('');
            }
        } catch (error) {
            console.error('Error creating comment:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleReply = async (parentId: string, content: string) => {
        try {
            const response = await fetch(`/api/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content,
                    parent_id: parentId,
                }),
            });

            if (response.ok) {
                const newReply = await response.json();
                setComments(prev => updateCommentWithReply(prev, parentId, newReply));
            }
        } catch (error) {
            console.error('Error creating reply:', error);
            throw error;
        }
    };

    const updateCommentWithReply = (
        comments: Comment[],
        parentId: string,
        reply: Comment
    ): Comment[] => {
        return comments.map(comment => {
            if (comment.id === parentId) {
                return {
                    ...comment,
                    replies: [...(comment.replies || []), reply]
                };
            }
            if (comment.replies) {
                return {
                    ...comment,
                    replies: updateCommentWithReply(comment.replies, parentId, reply)
                };
            }
            return comment;
        });
    };

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="text-gray-400">{t('common.loading')}</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white/10 border border-white/20 rounded-lg p-6">
                <h3 className="text-white text-lg font-semibold mb-4 font-sans-dm">
                    {t('comments.title')} ({comments.length})
                </h3>

                <form onSubmit={handleSubmitComment} className="space-y-3">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={t('comments.newPlaceholder')}
                        rows={4}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-esperanto-verda focus:bg-white/15 transition-all resize-none text-sm font-sans-dm"
                        required
                    />
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting || !newComment.trim()}
                            className="px-6 py-2 bg-esperanto-verda text-white rounded-lg hover:bg-esperanto-verda/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-sans-dm text-sm font-medium"
                        >
                            {submitting ? t('common.loading') : t('comments.submit')}
                        </button>
                    </div>
                </form>
            </div>

            {comments.length > 0 ? (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            onReply={handleReply}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-white/50">
                    {t('comments.empty')}
                </div>
            )}
        </div>
    );
}
