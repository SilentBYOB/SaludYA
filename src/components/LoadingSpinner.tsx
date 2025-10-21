import React from 'react';
import Logo from './Logo';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex flex-col h-full animate-fade-in">
            {/* Main loading indicator, centered */}
            <div className="flex-grow flex flex-col items-center justify-center">
                <div
                    className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"
                    role="status"
                    aria-label="cargando"
                ></div>
                <p className="mt-4 text-lg text-primary-dark animate-pulse-calm">
                    Analizando información...
                </p>
            </div>
             {/* Fixed footer section with tagline and logo */}
             <div className="flex flex-col items-center justify-center pb-8 opacity-60">
                <p className="text-sm text-gray-600 mb-2">
                    Porque la salud no puede esperar
                </p>
                <Logo className="h-8 w-auto" />
            </div>
        </div>
    );
};

export default LoadingSpinner;