'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/lib/i18n';
import type { Comment } from '@/types/discussion';
import CommentItem from './CommentItem';

interface CommentSectionProps {
    postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [showReplyForm, setShowReplyForm] = useState(false);

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

        if (!newComment.trim() || !user?.id) return;

        setSubmitting(true);
        try {
            const response = await fetch(`/api/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: newComment.trim(),
                    author_id: user.id,
                }),
            });

            if (response.ok) {
                const newCommentData = await response.json();
                setComments(prev => [newCommentData, ...prev]);
                setNewComment('');
                setShowReplyForm(false); // Hide form after successful submission
            } else {
                const error = await response.json();
                console.error('Error creating comment:', error);
                alert('Error creating comment');
            }
        } catch (error) {
            console.error('Error creating comment:', error);
            alert('Error creating comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleReply = async (parentId: string, content: string) => {
        if (!user?.id) return;

        try {
            const response = await fetch(`/api/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content,
                    parent_id: parentId,
                    author_id: user.id,
                }),
            });

            if (response.ok) {
                const newReply = await response.json();
                setComments(prev => updateCommentWithReply(prev, parentId, newReply));
            } else {
                const error = await response.json();
                console.error('Error creating reply:', error);
                alert('Error creating reply');
            }
        } catch (error) {
            console.error('Error creating reply:', error);
            alert('Error creating reply');
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

    return (
        <div className="space-y-6">
            <div className="bg-white/10 border border-white/20 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white text-lg font-semibold font-sans-dm">
                        {t('comments.title')} ({comments.length})
                    </h3>
                    {!showReplyForm && (
                        <button
                            type="button"
                            onClick={() => setShowReplyForm(true)}
                            className="px-4 py-2 bg-esperanto-verda text-white rounded-lg hover:bg-esperanto-verda/80 transition-colors font-sans-dm text-sm font-medium"
                        >
                            Responder
                        </button>
                    )}
                </div>

                {showReplyForm && (
                    <form onSubmit={handleSubmitComment} className="space-y-3 mb-6">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder={t('comments.newPlaceholder')}
                            rows={4}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-esperanto-verda focus:bg-white/15 transition-all resize-none text-sm font-sans-dm"
                            required
                        />
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setShowReplyForm(false)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-sans-dm text-sm font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={submitting || !newComment.trim()}
                                className="px-6 py-2 bg-esperanto-verda text-white rounded-lg hover:bg-esperanto-verda/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-sans-dm text-sm font-medium"
                            >
                                {submitting ? t('common.loading') : t('comments.submit')}
                            </button>
                        </div>
                    </form>
                )}

                {loading ? (
                    <div className="text-center py-8">
                        <div className="text-gray-400">{t('common.loading')}</div>
                    </div>
                ) : (
                    <>
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
                    </>
                )}
            </div>
        </div>
    );
}
