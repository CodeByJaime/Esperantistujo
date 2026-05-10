'use client';

import { useTranslation } from '@/lib/i18n';
import Modal from './Modal';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
}

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText,
    cancelText,
    variant = 'danger'
}: ConfirmDialogProps) {
    const { t } = useTranslation();
    const defaultConfirmText = confirmText || t('ui.confirm');
    const defaultCancelText = cancelText || t('ui.cancel');
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const variantClasses = {
        danger: 'bg-red-600 hover:bg-red-700 text-white',
        warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
        info: 'bg-esperanto-verda hover:bg-esperanto-verda/80 text-white'
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="space-y-4">
                <p className="text-gray-200">{message}</p>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-[#2a2a2a] text-gray-300 rounded-lg hover:bg-[#3a3a3a] transition-colors font-sans-dm text-sm font-medium"
                    >
                        {defaultCancelText}
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        className={`px-4 py-2 rounded-lg transition-colors font-sans-dm text-sm font-medium ${variantClasses[variant]}`}
                    >
                        {defaultConfirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
