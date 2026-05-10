'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import type { Channel } from '@/types/discussion';

interface ChannelFilterProps {
    channels: Channel[];
    currentChannel?: string;
}

export default function ChannelFilter({ channels, currentChannel }: ChannelFilterProps) {
    const { t } = useTranslation();

    return (
        <div className="bg-white/10 border border-white/20 rounded-lg p-6">
            <h3 className="text-white font-semibold mb-3">
                {t('channels.title')}
            </h3>

            <div className="space-y-1">
                <Link
                    href="/diskuto"
                    className={`block px-3 py-2 rounded-lg transition-colors font-sans-dm text-sm ${!currentChannel
                        ? 'bg-esperanto-verda/10 text-white'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <span>🏠</span>
                        <span>{t('channels.all')}</span>
                    </div>
                </Link>

                {channels.map((channel) => (
                    <Link
                        key={channel.id}
                        href={`/diskuto/${channel.slug}`}
                        className={`block px-3 py-2 rounded-lg transition-colors font-sans-dm text-sm ${currentChannel === channel.slug
                            ? 'bg-esperanto-verda/10 text-white'
                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <span>📁</span>
                            <span>{channel.name}</span>
                        </div>
                    </Link>
                ))}
            </div>

            {channels.length === 0 && (
                <div className="text-center py-4 text-white/50 text-sm">
                    {t('channels.noChannels')}
                </div>
            )}
        </div>
    );
}
