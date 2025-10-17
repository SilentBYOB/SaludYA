
import React from 'react';

interface WelcomeScreenProps {
    onStart: () => void;
    onViewHistory: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onViewHistory }) => {
    return (
        <div className="flex flex-col items-center justify-center text-center h-full">
            <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&h=250&auto=format&fit=crop" alt="Doctora sonriendo amablemente" className="w-full h-48 object-cover rounded-lg mb-6"/>
            <h1 className="text-4xl font-bold text-primary-dark mb-2">Hola</h1>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl">
                Soy su asistente de salud preliminar. Obtenga orientación sobre sus síntomas de forma rápida e inteligente.
            </p>
            <div className="bg-primary-lighter border-l-4 border-primary-light text-primary-dark p-4 rounded-md mb-8 max-w-2xl">
                <p className="font-bold">Aviso Importante</p>
                <p>Esta aplicación solo es una orientación en diagnóstico. Para una valoración profesional, debe acudir a su médico.</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                    onClick={onStart}
                    className="bg-primary text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-primary-dark transition-colors duration-200 shadow-lg"
                >
                    Comenzar Nueva Consulta
                </button>
                <button
                    onClick={onViewHistory}
                    className="bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-300 transition-colors duration-200"
                >
                    Ver Historial
                </button>
            </div>
        </div>
    );
};

export default WelcomeScreen;
