
import React, { useEffect } from 'react';
import { Diagnosis } from '../types';

interface TreatmentScreenProps {
    diagnosis: Diagnosis;
    onBack: () => void;
}

const TreatmentScreen: React.FC<TreatmentScreenProps> = ({ diagnosis, onBack }) => {
    // Scroll to the top of the page when the component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []); // The empty dependency array ensures this effect runs only once on mount

    return (
        <div className="animate-fade-in">
            <button onClick={onBack} className="flex items-center text-primary font-bold mb-4 hover:underline">
                <span className="material-symbols-outlined mr-1">arrow_back</span>
                Volver a los Resultados
            </button>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-primary-dark mb-2">{diagnosis.name}</h2>
                <p className="text-lg text-gray-600 mb-6">{diagnosis.short_explanation}</p>
                
                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3 border-b-2 border-primary-light pb-1">Descripción Detallada</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{diagnosis.long_explanation}</p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3 border-b-2 border-primary-light pb-1">Recomendaciones</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        {diagnosis.recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                        ))}
                    </ul>
                </div>

                 <div className="mt-8 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md">
                    <p className="font-bold">Descargo de Responsabilidad</p>
                    <p>Esta información es generada por IA y no sustituye el consejo médico profesional. Consulte siempre a un médico para obtener un diagnóstico y tratamiento precisos.</p>
                </div>
            </div>
        </div>
    );
};

export default TreatmentScreen;