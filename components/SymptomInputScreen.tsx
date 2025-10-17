import React, { useState } from 'react';

interface SymptomInputScreenProps {
    onSubmit: (symptoms: string) => void;
}

const SymptomInputScreen: React.FC<SymptomInputScreenProps> = ({ onSubmit }) => {
    const [symptoms, setSymptoms] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (symptoms.trim()) {
            onSubmit(symptoms.trim());
        }
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
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Ej: Tengo un fuerte dolor de cabeza desde hace dos días, mareos y sensibilidad a la luz..."
                    className="w-full flex-grow p-4 border border-gray-300 rounded-lg text-lg text-primary-dark focus:ring-2 focus:ring-primary-light focus:border-primary-light transition-colors"
                    rows={10}
                />
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