'use client';

import { useForm } from '@tanstack/react-form';
import { useEffect, useState } from 'react';
import AlertDialog from '@/components/ui/AlertDialog';
import { Select } from "@/components/ui/Select";
import { useAuth } from '@/contexts/AuthContext';
import { useModal } from '@/hooks/useModal';
import { useTranslation } from '@/lib/i18n';
import type { Channel, Post } from '@/types/discussion';

interface NewPostFormProps {
  channels: Channel[];
  selectedChannel?: Channel;
  onPostCreated?: (newPost?: Post) => void;
}

export default function NewPostForm({
  channels,
  selectedChannel,
  onPostCreated
}: NewPostFormProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { alert, showAlert, closeAlert } = useModal();
  const [defaultChannelId, setDefaultChannelId] = useState(selectedChannel?.id || '');

  // Set default channel to "General" when channels load
  useEffect(() => {
    if (!selectedChannel && channels.length > 0) {
      const generalChannel = channels.find(c => c.slug === 'general');
      if (generalChannel) {
        setDefaultChannelId(generalChannel.id);
      }
    }
  }, [channels, selectedChannel]);

  const form = useForm({
    defaultValues: {
      title: '',
      content: '',
      type: 'discussion' as 'discussion' | 'news' | 'question',
      channel_id: defaultChannelId,
    },
    onSubmit: async ({ value }) => {
      if (!user?.id) {
        return;
      }

      try {
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...value,
            author_id: user.id,
          }),
        });

        if (response.ok) {
          const createdPost = await response.json();
          form.reset();
          onPostCreated?.(createdPost);
        } else {
          const error = await response.json();
          showAlert('Error', `Error: ${error.error}${error.details ? ` - ${error.details}` : 'Error desconocido'}`, 'error');
        }
      } catch {
      }
    },
  });

  return (
    <div className="bg-white/10 border border-white/20 rounded-lg p-6">
      <h2 className="text-white text-xl font-semibold mb-4 font-sans-dm">
        {t('posts.create.title')}
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="post-type" className="block text-white/80 text-sm font-medium mb-2 font-sans-dm">
              {t('posts.create.type')}
            </label>
            <form.Field name="type">
              {(field) => (
                <Select
                  value={field.state.value}
                  onChange={(v) => field.handleChange(v as typeof field.state.value)}
                  options={[
                    { value: "discussion", label: t('posts.type.discussion') },
                    { value: "news", label: t('posts.type.news') },
                    { value: "question", label: t('posts.type.question') },
                  ]}
                />
              )}
            </form.Field>
          </div>

          <div>
            <label htmlFor="post-channel" className="block text-white/80 text-sm font-medium mb-2 font-sans-dm">
              {t('posts.create.channel')}
            </label>
            <form.Field name="channel_id">
              {(field) => (
                <Select
                  value={field.state.value}
                  onChange={(v) => field.handleChange(v)}
                  options={channels.map((channel) => ({
                    value: channel.id,
                    label: channel.name,
                  }))}
                  placeholder={t('posts.create.selectChannel')}
                  className="w-full"
                  disabled={channels.length === 0}
                />
              )}
            </form.Field>
          </div>
        </div>

        <div>
          <label htmlFor="post-title" className="block text-white/80 text-sm font-medium mb-2 font-sans-dm">
            {t('posts.create.title')}
          </label>
          <form.Field
            name="title"
            validators={{
              onChange: ({ value }) => (!value ? 'Title is required' : undefined),
            }}
          >
            {(field) => (
              <input
                id="post-title"
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder={t('posts.create.titlePlaceholder')}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-esperanto-verda focus:bg-white/15 transition-all text-sm font-sans-dm"
                required
              />
            )}
          </form.Field>
        </div>

        <div>
          <label htmlFor="post-content" className="block text-white/80 text-sm font-medium mb-2 font-sans-dm">
            {t('posts.create.content')}
          </label>
          <form.Field
            name="content"
            validators={{
              onChange: ({ value }) => (!value ? 'Content is required' : undefined),
            }}
          >
            {(field) => (
              <textarea
                id="post-content"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder={t('posts.create.contentPlaceholder')}
                rows={6}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-esperanto-verda focus:bg-white/15 transition-all resize-none text-sm font-sans-dm"
                required
              />
            )}
          </form.Field>
        </div>

        <div className="flex justify-end">
          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit}
                className="px-6 py-2 bg-esperanto-verda text-white rounded-lg hover:bg-esperanto-verda/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-sans-dm text-sm font-medium"
              >
                {isSubmitting ? t('common.loading') : t('posts.create.submit')}
              </button>
            )}
          </form.Subscribe>
        </div>
      </form>

      <AlertDialog
        isOpen={alert.isOpen}
        onClose={closeAlert}
        title={alert.title}
        message={alert.message}
        variant={alert.variant}
      />
    </div>
  );
}
