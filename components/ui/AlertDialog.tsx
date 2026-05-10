'use client';

import Modal from './Modal';

interface AlertDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    buttonText?: string;
    variant?: 'error' | 'success' | 'warning' | 'info';
}

export default function AlertDialog({
    isOpen,
    onClose,
    title,
    message,
    buttonText = 'Aceptar',
    variant = 'info'
}: AlertDialogProps) {
    const variantClasses = {
        error: 'text-red-400',
        success: 'text-esperanto-verda',
        warning: 'text-yellow-400',
        info: 'text-blue-400'
    };

    const buttonClasses = {
        error: 'bg-red-600 hover:bg-red-700 text-white',
        success: 'bg-esperanto-verda hover:bg-esperanto-verda/80 text-white',
        warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
        info: 'bg-blue-600 hover:bg-blue-700 text-white'
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="space-y-4">
                <div className={`text-lg ${variantClasses[variant]}`}>
                    {message}
                </div>

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className={`px-4 py-2 rounded-lg transition-colors font-sans-dm text-sm font-medium ${buttonClasses[variant]}`}
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
