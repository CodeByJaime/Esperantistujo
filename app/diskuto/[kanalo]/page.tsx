'use client';

import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { AuthLayout } from '@/components/auth-layout';
import ChannelFilter from '@/components/channels/ChannelFilter';
import NewPostForm from '@/components/posts/NewPostForm';
import PostFeed from '@/components/posts/PostFeed';
import { LoadingScreen } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/lib/i18n';
import type { Channel, Post } from '@/types/discussion';

export default function ChannelPage() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useTranslation();
  const params = useParams();
  const channelSlug = params.kanalo as string;

  const [channels, setChannels] = useState<Channel[]>([]);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewPost, setShowNewPost] = useState(false);

  const loadInitialData = useCallback(async () => {
    setLoading(true);
    try {
      // Load both channels and posts in parallel
      const [channelsResponse, postsResponse] = await Promise.all([
        fetch('/api/channels'),
        fetch(`/api/posts?channel=${channelSlug}`)
      ]);

      if (channelsResponse.ok) {
        const channelsData = await channelsResponse.json();
        setChannels(channelsData);

        // Find current channel
        const channel = channelsData.find((c: Channel) => c.slug === channelSlug);
        setCurrentChannel(channel || null);
      }

      if (postsResponse.ok) {
        const postsData = await postsResponse.json();
        setPosts(postsData);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, [channelSlug]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const loadPosts = useCallback(async () => {
    try {
      const response = await fetch(`/api/posts?channel=${channelSlug}`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch {
    }
  }, [channelSlug]);

  const handlePostCreated = () => {
    loadPosts();
    setShowNewPost(false);
  };

  if (authLoading || loading) {
    return (
      <LoadingScreen />
    );
  }

  if (!currentChannel) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">
            {t('channels.notFound')}
          </h1>
          <p className="text-gray-400">
            {t('channels.notFoundSubtitle')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthLayout user={user}>
      <div className="min-h-screen bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📁</span>
              <h1 className="text-4xl font-bold text-white">
                {currentChannel.name}
              </h1>
            </div>
            {currentChannel.description && (
              <p className="text-gray-400 text-lg">
                {currentChannel.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                <ChannelFilter channels={channels} currentChannel={channelSlug} />

                <button
                  onClick={() => setShowNewPost(!showNewPost)}
                  type="button"
                  className="w-full px-4 py-3 bg-esperanto-verda text-white rounded-lg hover:bg-esperanto-verda/30 transition-colors font-medium"
                >
                  {showNewPost ? t('posts.create.cancel') : t('posts.create.new')}
                </button>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-6">
              {showNewPost && (
                <NewPostForm
                  channels={channels}
                  selectedChannel={currentChannel}
                  onPostCreated={handlePostCreated}
                />
              )}

              <PostFeed channelSlug={channelSlug} initialPosts={posts} />
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
