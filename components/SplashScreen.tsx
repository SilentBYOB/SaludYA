import React from 'react';
import Logo from './Logo';

const SplashScreen: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-white">
            <Logo className="h-20 w-auto" />
            <p className="mt-4 text-xl font-semibold text-primary-dark animate-pulse">
                Iniciando asistente de salud...
            </p>
        </div>
    );
};

export default SplashScreen;
