import React from 'react';
import { Consultation } from '../types';

interface HistoryScreenProps {
    history: Consultation[];
    onSelect: (consultation: Consultation) => void;
    onDeleteRequest: (id: string | 'all') => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ history, onSelect, onDeleteRequest }) => {
    if (history.length === 0) {
        return (
            <div className="text-center flex flex-col items-center justify-center h-full">
                 <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">history_toggle_off</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark mb-2">Historial de Consultas Vacío</h2>
                <p className="text-gray-600">No tiene consultas guardadas en su historial.</p>
            </div>
        );
    }
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark">Historial de Consultas</h2>
                <button
                    onClick={() => onDeleteRequest('all')}
                    className="flex items-center text-sm text-red-600 font-semibold hover:text-red-800 transition-colors"
                >
                     <span className="material-symbols-outlined mr-1 text-base">delete_forever</span>
                    Limpiar Historial
                </button>
            </div>
            <div className="space-y-4">
                {history.map((consultation) => (
                    <div key={consultation.id} className="group flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <button
                            onClick={() => onSelect(consultation)}
                            className="flex-grow text-left p-4 hover:bg-primary-lightest transition-colors"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-primary-dark">{consultation.selectedDiagnosis.name}</p>
                                    <p className="text-sm text-gray-500 truncate max-w-xs sm:max-w-md">
                                        Síntomas: {consultation.symptoms}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-700">{new Date(consultation.date).toLocaleDateString()}</p>
                                    <p className="text-xs text-gray-500">{new Date(consultation.date).toLocaleTimeString()}</p>
                                </div>
                            </div>
                        </button>
                        <button
                            onClick={() => onDeleteRequest(consultation.id)}
                            aria-label={`Eliminar consulta de ${consultation.selectedDiagnosis.name}`}
                            className="p-4 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <span className="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HistoryScreen;
