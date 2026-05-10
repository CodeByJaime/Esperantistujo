'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
}

export default function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl'
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <button
                type="button"
                className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer border-0 p-0"
                onClick={onClose}
                aria-label="Close modal"
            />

            {/* Modal */}
            <div className={`relative w-full mx-4 ${sizeClasses[size]} bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-xl`}>
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between p-6 border-b border-[#2a2a2a]">
                        {title && (
                            <h2 className="text-xl font-semibold text-white font-sans-dm">
                                {title}
                            </h2>
                        )}
                        {onClose && (
                            <button
                                type="button"
                                onClick={onClose}
                                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
