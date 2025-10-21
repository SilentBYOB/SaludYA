import React from 'react';
import Logo from './Logo';

interface DiagnosisScreenSkeletonProps {
    message?: string;
}

const DiagnosisScreenSkeleton: React.FC<DiagnosisScreenSkeletonProps> = ({ message }) => {
    return (
        <div className="flex flex-col h-full animate-fade-in">
            {/* Centered Spinner, with more space at the bottom */}
            <div className="flex-grow flex flex-col items-center justify-center pb-8">
                <svg className="h-16 w-16 animate-spin" viewBox="0 0 100 100" role="status" aria-label="cargando">
                    <circle
                        className="stroke-current text-blue-200"
                        fill="none"
                        strokeWidth="10"
                        cx="50"
                        cy="50"
                        r="40"
                    />
                    <circle
                        className="stroke-current text-primary"
                        fill="none"
                        strokeWidth="10"
                        strokeLinecap="round"
                        cx="50"
                        cy="50"
                        r="40"
                        strokeDasharray="100 252" 
                    />
                </svg>
                <p className="mt-4 text-lg text-primary-dark font-bold animate-pulse-calm text-center max-w-sm">
                    {message || 'Analizando información...'}
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
