import React from 'react';
import { AppState } from '../types';

interface BottomNavProps {
    appState: AppState;
    onNewConsultation: () => void;
    onViewHistory: () => void;
    hasDiagnosisResults: boolean;
    onViewResults: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ appState, onNewConsultation, onViewHistory, hasDiagnosisResults, onViewResults }) => {

    const getButtonClass = (isActive: boolean) => {
        return `flex flex-col items-center justify-center w-full h-16 transition-colors disabled:opacity-50 ${
            isActive ? 'text-primary' : 'text-gray-500'
        }`;
    };

    return (
        <nav className="sticky bottom-0 left-0 right-0 bg-white shadow-[0_-2px_5px_rgba(0,0,0,0.1)] md:hidden">
            <div className="flex justify-around">
                <button 
                    onClick={onViewResults} 
                    disabled={!hasDiagnosisResults}
                    className={getButtonClass(appState === AppState.Diagnosis || appState === AppState.Treatment)}
                    aria-label="Ver Resultados"
                >
                    <span className="material-symbols-outlined text-2xl">assessment</span>
                    <span className="text-xs font-bold">Resultados</span>
                </button>
                <button 
                    onClick={onNewConsultation} 
                    className={getButtonClass(appState === AppState.SymptomInput || appState === AppState.Question)}
                    aria-label="Iniciar Nueva Consulta"
                >
                    <span className="material-symbols-outlined text-2xl">add_circle</span>
                    <span className="text-xs">Nueva Consulta</span>
                </button>
                <button 
                    onClick={onViewHistory} 
                    className={getButtonClass(appState === AppState.History)}
                    aria-label="Ver Historial"
                >
                    <span className="material-symbols-outlined text-2xl">history</span>
                    <span className="text-xs">Historial</span>
                </button>
            </div>
        </nav>
    );
};

export default BottomNav;