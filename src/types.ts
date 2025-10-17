
export interface Diagnosis {
    name: string;
    probability: number;
    short_explanation: string;
    long_explanation: string;
    recommendations: string[];
    icon: string;
}

export interface Consultation {
    id: string;
    date: string;
    symptoms: string;
    questions: string[];
    answers: string[];
    diagnoses: Diagnosis[];
    selectedDiagnosis: Diagnosis;
}

export enum SubscriptionLevel {
    Free = 'FREE',
    Pro = 'PRO',
}

export enum AppState {
    Welcome,
    SymptomInput,
    Question,
    Diagnosis,
    Treatment,
    History,
}