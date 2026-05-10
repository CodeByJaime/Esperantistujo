'use client';

import { useCallback, useEffect, useState } from 'react';
import { AuthLayout } from '@/components/auth-layout';
import ChannelFilter from '@/components/channels/ChannelFilter';
import NewPostForm from '@/components/posts/NewPostForm';
import PostFeed from '@/components/posts/PostFeed';
import { LoadingScreen } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/lib/i18n';
import type { Channel, Post } from '@/types/discussion';

export default function DiskutoPage() {
    const { user, loading: authLoading } = useAuth();
    const { t } = useTranslation();
    const [channels, setChannels] = useState<Channel[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [channelsLoading, setChannelsLoading] = useState(true);
    const [showNewPost, setShowNewPost] = useState(false);
    const [newPost, setNewPost] = useState<Post | null>(null);

    const loadChannels = useCallback(async () => {
        try {
            setChannelsLoading(true);
            const response = await fetch('/api/channels');
            if (response.ok) {
                const data = await response.json();
                setChannels(data);
            }
        } catch {
        } finally {
            setChannelsLoading(false);
        }
    }, []);

    const loadPosts = useCallback(async () => {
        try {
            const response = await fetch('/api/posts');
            if (response.ok) {
                const data = await response.json();
                setPosts(data);
            }
        } catch {
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadChannels();
        loadPosts();
    }, [loadChannels, loadPosts]);

    const handlePostCreated = (newPostData?: Post) => {
        if (newPostData) {
            setNewPost(newPostData);
            loadPosts(); // Recargar el feed para mostrar el nuevo post
        }
        setShowNewPost(false);
    };

    if (authLoading || loading || channelsLoading) {
        return (
            <LoadingScreen />
        );
    }

    return (
        <AuthLayout user={user}>
            <div className="min-h-screen bg-[#0a0a0a]">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">
                            {t('diskuto.title')}
                        </h1>
                        <p className="text-gray-400 text-lg">
                            {t('diskuto.subtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <div className="lg:col-span-1">
                            <div className="sticky top-8 space-y-6">
                                <ChannelFilter channels={channels} />

                                <button
                                    type="button"
                                    onClick={() => setShowNewPost(!showNewPost)}
                                    disabled={channelsLoading}
                                    className={`w-full px-4 py-3 rounded-lg transition-colors font-medium ${channelsLoading
                                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                        : 'bg-esperanto-verda text-white hover:bg-esperanto-verda/80'
                                        }`}
                                >
                                    {channelsLoading
                                        ? t('common.loading')
                                        : showNewPost
                                            ? t('posts.create.cancel')
                                            : t('posts.create.new')
                                    }
                                </button>
                            </div>
                        </div>

                        <div className="lg:col-span-3 space-y-6">
                            {showNewPost && (
                                <NewPostForm
                                    channels={channels}
                                    onPostCreated={handlePostCreated}
                                />
                            )}

                            <PostFeed initialPosts={posts} newPost={newPost || undefined} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}
