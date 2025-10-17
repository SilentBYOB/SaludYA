import React from 'react';
import Logo from './Logo';

const DiagnosisScreenSkeleton: React.FC = () => {
    return (
        <div className="flex flex-col h-full animate-fade-in">
            {/* Centered Spinner */}
            <div className="flex-grow flex flex-col items-center justify-center">
                <div
                    className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"
                    role="status"
                    aria-label="cargando"
                ></div>
                <p className="mt-4 text-lg text-primary-dark font-bold">
                    Analizando información...
                </p>
            </div>
            {/* Footer section */}
            <div className="flex flex-col items-center justify-center pb-8 opacity-60">
                <p className="text-sm text-gray-600 mb-2">
                    Porque la salud no puede esperar
                </p>
                <Logo className="h-8 w-auto" />
            </div>
        </div>
    );
};

export default DiagnosisScreenSkeleton;