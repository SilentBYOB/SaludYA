import React, { useState, useEffect, useCallback } from 'react';
import { AppState, SubscriptionLevel, Diagnosis, Consultation } from './types';
import { generateQuestions, generateDiagnosis } from './services/geminiService';

import SplashScreen from './components/SplashScreen';
import Header from './components/Header';
import WelcomeScreen from './components/WelcomeScreen';
import SymptomInputScreen from './components/SymptomInputScreen';
import QuestionScreen from './components/QuestionScreen';
import DiagnosisScreen from './components/DiagnosisScreen';
import TreatmentScreen from './components/TreatmentScreen';
import HistoryScreen from './components/HistoryScreen';
import BottomNav from './components/BottomNav';
import ConfirmationModal from './components/ConfirmationModal';
import DiagnosisScreenSkeleton from './components/DiagnosisScreenSkeleton';

const App: React.FC = () => {
    // App flow state
    const [appState, setAppState] = useState<AppState>(AppState.Welcome);
    const [isLoading, setIsLoading] = useState<boolean>(true); // Start with loading for splash screen

    // Data state
    const [subscription, setSubscription] = useState<SubscriptionLevel>(SubscriptionLevel.Free);
    const [symptoms, setSymptoms] = useState<string>('');
    const [questions, setQuestions] = useState<string[]>([]);
    const [answers, setAnswers] = useState<string[]>([]);
    const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
    const [selectedDiagnosis, setSelectedDiagnosis] = useState<Diagnosis | null>(null);
    const [history, setHistory] = useState<Consultation[]>([]);

    // Deletion confirmation state
    const [deleteTarget, setDeleteTarget] = useState<string | 'all' | null>(null);

    // Load history from localStorage on mount
    useEffect(() => {
        try {
            const storedHistory = localStorage.getItem('consultationHistory');
            if (storedHistory) {
                setHistory(JSON.parse(storedHistory));
            }
        } catch (error) {
            console.error("Failed to load history from localStorage:", error);
        }
        // Simulate splash screen
        setTimeout(() => setIsLoading(false), 1500);
    }, []);

    // Save history to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem('consultationHistory', JSON.stringify(history));
        } catch (error) {
            console.error("Failed to save history to localStorage:", error);
        }
    }, [history]);
    
    const resetConsultation = useCallback(() => {
        setSymptoms('');
        setQuestions([]);
        setAnswers([]);
        setDiagnoses([]);
        setSelectedDiagnosis(null);
    }, []);

    const handleGoHome = () => {
        resetConsultation();
        setAppState(AppState.Welcome);
    };

    const handleNewConsultation = () => {
        resetConsultation();
        setAppState(AppState.SymptomInput);
    };

    const handleStart = () => {
        setAppState(AppState.SymptomInput);
    };

    const handleSymptomSubmit = async (symptoms: string) => {
        setSymptoms(symptoms);
        setIsLoading(true);
        const generatedQuestions = await generateQuestions(symptoms, subscription === SubscriptionLevel.Pro);
        setQuestions(generatedQuestions);
        setIsLoading(false);
        setAppState(AppState.Question);
    };

    const handleQuestionSubmit = async (answers: string[]) => {
        setAnswers(answers);
        setIsLoading(true);
        const generatedDiagnoses = await generateDiagnosis(symptoms, questions, answers, subscription === SubscriptionLevel.Pro);
        setDiagnoses(generatedDiagnoses);
        setIsLoading(false);
        setAppState(AppState.Diagnosis);
    };
    
    const handleDiagnosisSelect = (diagnosis: Diagnosis) => {
        setSelectedDiagnosis(diagnosis);
        setAppState(AppState.Treatment);
        
        // Save to history
        const newConsultation: Consultation = {
            id: new Date().toISOString(),
            date: new Date().toISOString(),
            symptoms,
            questions,
            answers,
            diagnoses,
            selectedDiagnosis: diagnosis,
        };
        setHistory(prevHistory => [newConsultation, ...prevHistory]);
    };

    const handleHistorySelect = (consultation: Consultation) => {
        // Set all relevant state from the historic consultation
        setSymptoms(consultation.symptoms);
        setQuestions(consultation.questions);
        setAnswers(consultation.answers);
        setDiagnoses(consultation.diagnoses);
        setSelectedDiagnosis(consultation.selectedDiagnosis);
        setAppState(AppState.Treatment);
    };

    const handleViewHistory = () => {
        setAppState(AppState.History);
    };
    
    const handleBackToDiagnosis = () => {
        setSelectedDiagnosis(null);
        setAppState(AppState.Diagnosis);
    };
    
    const handleDeleteRequest = (id: string | 'all') => {
        setDeleteTarget(id);
    };
    
    const handleConfirmDelete = () => {
        if (deleteTarget === 'all') {
            setHistory([]);
        } else if (deleteTarget) {
            setHistory(prevHistory => prevHistory.filter(c => c.id !== deleteTarget));
        }
        setDeleteTarget(null); // Close modal
    };

    const renderContent = () => {
        if (isLoading && appState !== AppState.Welcome) {
            // Unify the loading screen to use the component that works correctly on mobile.
            return <DiagnosisScreenSkeleton />;
        }

        switch (appState) {
            case AppState.Welcome:
                return <WelcomeScreen onStart={handleStart} onViewHistory={handleViewHistory} />;
            case AppState.SymptomInput:
                return <SymptomInputScreen onSubmit={handleSymptomSubmit} />;
            case AppState.Question:
                return <QuestionScreen questions={questions} onSubmit={handleQuestionSubmit} />;
            case AppState.Diagnosis:
                return <DiagnosisScreen diagnoses={diagnoses} onSelect={handleDiagnosisSelect} />;
            case AppState.Treatment:
                if (selectedDiagnosis) {
                    return <TreatmentScreen diagnosis={selectedDiagnosis} onBack={handleBackToDiagnosis} />;
                }
                // Fallback if no diagnosis is selected
                setAppState(AppState.Diagnosis);
                return null;
            case AppState.History:
                 return <HistoryScreen history={history} onSelect={handleHistorySelect} onDeleteRequest={handleDeleteRequest} />;
            default:
                return <WelcomeScreen onStart={handleStart} onViewHistory={handleViewHistory} />;
        }
    };

    if (isLoading && appState === AppState.Welcome) {
        return <SplashScreen />;
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header
                onLogoClick={handleGoHome}
                onNewConsultation={handleNewConsultation}
                subscription={subscription}
                setSubscription={setSubscription}
            />
            <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="bg-white p-6 rounded-lg shadow-lg min-h-[70vh] flex flex-col">
                    {renderContent()}
                </div>
            </main>
            <BottomNav 
                appState={appState}
                onNewConsultation={handleNewConsultation}
                onViewHistory={handleViewHistory}
                hasDiagnosisResults={diagnoses.length > 0}
                onViewResults={() => setAppState(AppState.Diagnosis)}
            />
             <ConfirmationModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleConfirmDelete}
                title="Confirmar Eliminación"
                message={deleteTarget === 'all' ? '¿Está seguro de que desea eliminar todo el historial de consultas? Esta acción no se puede deshacer.' : '¿Está seguro de que desea eliminar esta consulta?'}
            />
        </div>
    );
};

export default App;