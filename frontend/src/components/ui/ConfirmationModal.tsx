import { X } from 'lucide-react';
import { Button } from './Button';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

export const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'info'
}: ConfirmationModalProps) => {
    if (!isOpen) return null;

    const isDanger = type === 'danger';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1f] p-6 shadow-2xl transition-all">
                <div className="mb-6">
                    <div className="mb-2 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">{title}</h3>
                        <button
                            onClick={onClose}
                            className="rounded-full p-1 text-gray-400 hover:bg-white/10 hover:text-white"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <p className="text-gray-400">{message}</p>
                </div>

                <div className="flex justify-end gap-3">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="text-gray-400 hover:text-white"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={isDanger ? 'bg-red-500 hover:bg-red-600 border-red-500/50' : ''}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};
