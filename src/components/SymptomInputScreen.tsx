import React, { useState } from 'react';

interface SymptomInputScreenProps {
    onSubmit: (symptoms: string) => void;
    errorMessage: string | null;
    onClearError: () => void;
}

const SymptomInputScreen: React.FC<SymptomInputScreenProps> = ({ onSubmit, errorMessage, onClearError }) => {
    const [symptoms, setSymptoms] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (symptoms.trim()) {
            onSubmit(symptoms.trim());
        }
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (errorMessage) {
            onClearError();
        }
        setSymptoms(e.target.value);
    };

    return (
        <div className="flex flex-col h-full">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark mb-4">Por favor, describa sus síntomas</h2>
            <p className="text-gray-600 mb-6">
                Por favor, describa detalladamente lo que le sucede. Incluya cualquier síntoma, dolor o malestar que esté experimentando.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
                <textarea
                    value={symptoms}
                    onChange={handleTextChange}
                    placeholder="Ej: Tengo un fuerte dolor de cabeza desde hace dos días, mareos y sensibilidad a la luz..."
                    className={`w-full flex-grow p-4 border rounded-lg text-lg text-primary-dark focus:ring-2 focus:border-primary-light transition-colors ${errorMessage ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-primary-light'}`}
                    rows={10}
                    aria-invalid={!!errorMessage}
                    aria-describedby={errorMessage ? 'symptom-error' : undefined}
                />
                {errorMessage && (
                    <div id="symptom-error" className="mt-4 text-red-700 bg-red-100 p-3 rounded-lg text-sm animate-fade-in" role="alert">
                       <span className="font-bold">Aviso:</span> {errorMessage}
                    </div>
                )}
                <button
                    type="submit"
                    disabled={!symptoms.trim()}
                    className="mt-6 w-full sm:w-auto self-end bg-primary text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    Continuar
                </button>
            </form>
        </div>
    );
};

export default SymptomInputScreen;