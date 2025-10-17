import React from 'react';
import { Diagnosis } from '../types';

interface DiagnosisScreenProps {
    diagnoses: Diagnosis[];
    onSelect: (diagnosis: Diagnosis) => void;
}

// Helper function to map Gemini icon keywords to Material Symbols names
const getMaterialIconName = (iconKeyword: string): string => {
    const keyword = (iconKeyword || '').toLowerCase().trim();
    switch (keyword) {
        case 'mask':
        case 'flu':
        case 'gripe':
        case 'lungs':
        case 'respiratory':
            return 'masks';
        case 'droplet':
        case 'cold':
        case 'resfriado':
            return 'sick';
        case 'headache':
        case 'sinusitis':
             return 'mimo';
        case 'stomach':
             return 'stomach_ache';
        default:
            return 'health_and_safety';
    }
};

const DiagnosisCard: React.FC<{ diagnosis: Diagnosis; onSelect: (diagnosis: Diagnosis) => void }> = ({ diagnosis, onSelect }) => {
    const { name, probability, short_explanation, icon } = diagnosis;
    
    return (
        <div className="mb-6 @container">
            <div className="flex flex-col items-stretch justify-start rounded-xl @xl:flex-row @xl:items-start shadow-md bg-white dark:bg-slate-800 p-4">
                {/* Left side: Progress ring and icon */}
                <div className="flex w-full @xl:w-auto items-center gap-4 mb-4 @xl:mb-0">
                    <div className="relative w-24 h-24">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path className="text-gray-200 dark:text-gray-600" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.8"></path>
                            <path className="text-primary progress-ring__circle" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${probability}, 100`} strokeDashoffset="0" strokeWidth="3.8"></path>
                        </svg>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-primary">{Math.round(probability)}%</div>
                    </div>
                    <span className="material-symbols-outlined text-5xl text-primary-light">{getMaterialIconName(icon)}</span>
                </div>
                {/* Right side: Text content */}
                <div className="flex w-full grow flex-col items-start justify-center gap-1 @xl:px-4">
                    <p className="text-xl font-bold text-text-light dark:text-text-dark">{name}</p>
                    <p className="text-base font-normal text-gray-600 dark:text-gray-300">{short_explanation}</p>
                    <button onClick={() => onSelect(diagnosis)} className="mt-2 text-primary font-bold hover:underline">Ver Detalles y Recomendaciones</button>
                </div>
            </div>
        </div>
    );
};


const DiagnosisScreen: React.FC<DiagnosisScreenProps> = ({ diagnoses, onSelect }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-6 text-center">Resultados del Diagnóstico Preliminar</h2>
            
            <div>
                {diagnoses.map((diag, index) => (
                    <DiagnosisCard key={index} diagnosis={diag} onSelect={onSelect} />
                ))}
            </div>

            <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-8 px-4">
                Este es un diagnóstico preliminar generado por IA y no reemplaza una consulta médica. Consulte a un profesional de la salud para una confirmación y tratamiento.
            </p>
        </div>
    );
};

export default DiagnosisScreen;