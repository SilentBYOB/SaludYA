import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in"
            aria-modal="true"
            role="dialog"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
                onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
                <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
