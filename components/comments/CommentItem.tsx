'use client';

import { Edit, Trash } from 'lucide-react';
import { useState } from 'react';
import AlertDialog from '@/components/ui/AlertDialog';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useModal } from '@/hooks/useModal';
import { useTranslation } from '@/lib/i18n';
import type { Comment } from '@/types/discussion';

interface CommentItemProps {
  comment: Comment;
  onReply?: (parentId: string, content: string) => void;
  onEdit?: (commentId: string, newContent: string) => void;
  onDelete?: (commentId: string) => void;
  depth?: number;
}

export default function CommentItem({
  comment,
  onReply,
  onEdit,
  onDelete,
  depth = 0
}: CommentItemProps) {
  const { t } = useTranslation();
  const { alert, showAlert, closeAlert, confirm, showConfirm, closeConfirm } = useModal();
  const [replyContent, setReplyContent] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showActions, setShowActions] = useState(false);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!replyContent.trim() || !onReply) return;

    setLoading(true);
    try {
      await onReply(comment.id, replyContent.trim());
      setReplyContent('');
      setShowReplyForm(false);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const maxDepth = 1;
  const canReply = depth < maxDepth;
  const isAuthor = comment.profiles?.id === comment.author_id;

  const handleEdit = async () => {
    if (!onEdit) return;

    setEditLoading(true);
    try {
      const response = await fetch(`/api/comments/${comment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editContent,
        }),
      });

      if (response.ok) {
        const updatedComment = await response.json();
        onEdit(comment.id, updatedComment.content);
        setIsEditing(false);
      } else {
        const error = await response.json();
        showAlert('Error', `Error: ${error.error || 'No se pudo actualizar el comentario'}`, 'error');
      }
    } catch {
      showAlert('Error', 'Error al actualizar el comentario', 'error');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    const hasReplies = comment.replies && comment.replies.length > 0;
    const message = hasReplies
      ? 'Este comentario tiene respuestas. ¿Estás seguro de que quieres eliminarlo y todas sus respuestas?'
      : '¿Estás seguro de que quieres eliminar este comentario?';

    showConfirm(
      'Eliminar comentario',
      message,
      async () => {
        try {
          const response = await fetch(`/api/comments/${comment.id}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            onDelete(comment.id);
          } else {
            const error = await response.json();
            showAlert('Error', `Error: ${error.error || 'No se pudo eliminar el comentario'}`, 'error');
          }
        } catch {
          showAlert('Error', 'Error al eliminar el comentario', 'error');
        }
      },
      'danger'
    );
  };

  const handleSaveEdit = () => {
    handleEdit();
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  return (
    <div className={`${depth > 0 ? 'ml-6 pl-4 border-l-2 border-white/20' : ''}`}>
      <div className="bg-white/10 border border-white/20 rounded-lg p-4 space-y-3">

        {/* Header: avatar + nombre + menú */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-esperanto-verda rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {comment.profiles?.esperanto_name?.[0]?.toUpperCase() ||
                  comment.profiles?.display_name?.[0]?.toUpperCase() || 'A'}
              </span>
            </div>
            <div>
              <div className="text-white font-medium text-sm">
                {comment.profiles?.esperanto_name || comment.profiles?.display_name || 'Anonima'}
              </div>
              <div className="text-white/40 text-xs">
                {new Date(comment.created_at).toLocaleDateString('es-ES', {
                  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                })}
              </div>
            </div>
          </div>

          {/* Menú acciones */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowActions(!showActions)}
              className="p-1 rounded text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              ⋮
            </button>
            {showActions && isAuthor && (
              <div className="absolute right-0 top-7 bg-[#1a1a1a] border border-white/20 rounded-lg shadow-xl z-10 p-1 min-w-32">
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => { setIsEditing(true); setShowActions(false); }}
                    className="w-full text-left px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2 rounded"
                  >
                    <Edit className="w-4 h-4" /> Editar
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleDelete}
                  className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-white/10 transition-colors flex items-center gap-2 rounded"
                >
                  <Trash className="w-4 h-4" /> Eliminar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Contenido */}
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              disabled={editLoading}
              rows={3}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-esperanto-verda transition-all resize-none text-sm font-sans-dm disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div className="flex gap-2">
              <button type="button" onClick={handleSaveEdit} disabled={editLoading}
                className="px-3 py-1 bg-esperanto-verda text-white rounded text-sm hover:bg-esperanto-verda/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-sans-dm">
                {editLoading ? 'Guardando...' : 'Guardar'}
              </button>
              <button type="button" onClick={handleCancelEdit}
                className="px-3 py-1 bg-white/10 text-white rounded text-sm hover:bg-white/20 transition-colors font-sans-dm">
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <p className="text-white/80 text-sm font-sans-dm whitespace-pre-wrap leading-relaxed">
            {comment.content}
          </p>
        )}

        {/* Botón responder */}
        {canReply && !isEditing && (
          <button
            type="button"
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-xs text-esperanto-verda hover:text-esperanto-verda/80 transition-colors font-sans-dm"
          >
            {showReplyForm ? t('comments.cancel') : t('comments.reply')}
          </button>
        )}

        {/* Formulario de respuesta */}
        {showReplyForm && canReply && (
          <form onSubmit={handleReply} className="space-y-2">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={t('comments.replyPlaceholder')}
              rows={3}
              disabled={loading}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-esperanto-verda transition-all resize-none text-sm font-sans-dm disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
            <div className="flex gap-2">
              <button type="submit" disabled={loading || !replyContent.trim()}
                className="px-4 py-1 bg-esperanto-verda text-white text-sm rounded hover:bg-esperanto-verda/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-sans-dm">
                {loading ? t('common.loading') : t('comments.submit')}
              </button>
              <button type="button" onClick={() => { setShowReplyForm(false); setReplyContent(''); }}
                className="px-4 py-1 bg-white/10 text-white text-sm rounded hover:bg-white/20 transition-colors font-sans-dm">
                {t('comments.cancel')}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Replies FUERA del card */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2 space-y-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={`${comment.id}-${reply.id}`}
              comment={reply}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              depth={depth + 1}
            />
          ))}
        </div>
      )}

      {/* Alert Dialog */}
      <AlertDialog
        isOpen={alert.isOpen}
        onClose={closeAlert}
        title={alert.title}
        message={alert.message}
        variant={alert.variant}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirm.isOpen}
        onClose={closeConfirm}
        onConfirm={confirm.onConfirm}
        title={confirm.title}
        message={confirm.message}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}
