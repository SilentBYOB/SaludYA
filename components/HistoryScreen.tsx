
import React from 'react';
import { Consultation } from '../types';

interface HistoryScreenProps {
    history: Consultation[];
    onSelect: (consultation: Consultation) => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ history, onSelect }) => {
    if (history.length === 0) {
        return (
            <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark mb-4">Historial de Consultas</h2>
                <p className="text-gray-600">No tiene consultas guardadas en su historial.</p>
            </div>
        );
    }
    
    return (
        <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark mb-6">Historial de Consultas</h2>
            <div className="space-y-4">
                {history.map((consultation) => (
                    <button
                        key={consultation.id}
                        onClick={() => onSelect(consultation)}
                        className="w-full text-left p-4 bg-white border border-gray-200 rounded-lg hover:bg-primary-lightest hover:border-primary-light transition-colors"
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
                ))}
            </div>
        </div>
    );
};

export default HistoryScreen;