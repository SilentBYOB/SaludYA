import { GoogleGenAI, Type } from "@google/genai";
import { Diagnosis } from '../types';

// Fix: Per guidelines, initialize with a named apiKey parameter from process.env.
const ai = new GoogleGenAI({ apiKey: (process as any).env.API_KEY });

const proModel = 'gemini-2.5-pro';
const flashModel = 'gemini-2.5-flash';

const questionsSchema = {
    type: Type.OBJECT,
    properties: {
        questions: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING,
            },
        },
    },
    required: ['questions'],
};

const diagnosisSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING },
            probability: { type: Type.NUMBER },
            short_explanation: { type: Type.STRING },
            long_explanation: { type: Type.STRING },
            recommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
            },
            icon: { type: Type.STRING, description: "A single keyword in English for a suitable icon. Examples: 'headache', 'stomach', 'flu', 'lungs', 'mask', 'droplet'." },
        },
        required: ['name', 'probability', 'short_explanation', 'long_explanation', 'recommendations', 'icon'],
    },
};

const relevanceSchema = {
    type: Type.OBJECT,
    properties: {
        is_medical_query: { 
            type: Type.BOOLEAN,
            description: "Set to true if the user's input is about a medical symptom, illness, or health concern. Otherwise, set to false."
        },
    },
    required: ['is_medical_query'],
};

export const checkSymptomRelevance = async (symptoms: string): Promise<boolean> => {
    // Use the faster model for this simple classification task.
    const model = flashModel; 
    const prompt = `
    Eres un clasificador de consultas médicas. Tu única tarea es determinar si el siguiente texto describe un síntoma médico, una enfermedad, una dolencia o cualquier problema de salud. No respondas a la pregunta, solo clasifícala.

    Texto del usuario: "${symptoms}"

    Responde únicamente con un objeto JSON que se ajuste al esquema proporcionado. Si el texto trata sobre un tema de salud, 'is_medical_query' debe ser true. Si trata de cualquier otra cosa (saludos, preguntas no médicas, spam, etc.), debe ser false.
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: relevanceSchema,
                temperature: 0.1, // Low temperature for deterministic classification
            },
        });

        const jsonText = (response.text ?? '').trim();
        if (!jsonText) {
             // Default to true to avoid blocking a valid query if the API returns nothing.
            return true;
        }
        const parsed = JSON.parse(jsonText);
        return parsed.is_medical_query ?? true;
    } catch (error) {
        console.error("Error checking symptom relevance:", error);
        // In case of an error (e.g., API failure), we'll let the query pass
        // to avoid blocking a potentially valid user.
        return true;
    }
};


export const generateQuestions = async (symptoms: string, isPro: boolean): Promise<string[]> => {
    const model = isPro ? proModel : flashModel;
    const prompt = `Basado en los siguientes síntomas, genera entre 3 y 5 preguntas de seguimiento concisas y claras para ayudar a determinar la causa. Devuelve solo el objeto JSON.
    Síntomas: "${symptoms}"`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: questionsSchema,
                temperature: 0.5,
            },
        });
        
        const jsonText = (response.text ?? '').trim();
        if (!jsonText) return []; // Return empty array if response is empty
        const parsed = JSON.parse(jsonText);
        return parsed.questions || [];
    } catch (error) {
        console.error("Error generating questions:", error);
        // Fallback in case of API error
        return [
            "¿Desde cuándo experimenta estos síntomas?",
            "¿Hay algo que mejore o empeore los síntomas?",
            "¿Ha tenido fiebre?",
            "¿Está tomando algún medicamento actualmente?",
        ];
    }
};

export const generateDiagnosis = async (symptoms: string, questions: string[], answers: string[], isPro: boolean): Promise<Diagnosis[]> => {
    const model = isPro ? proModel : flashModel;

    const qaPairs = questions.map((q, i) => `P: ${q}\nR: ${answers[i]}`).join('\n');

    const prompt = `
    Eres un asistente médico de IA. Analiza los síntomas y las respuestas del paciente para proporcionar un diagnóstico preliminar.
    
    Contexto del Paciente:
    - Síntomas principales: ${symptoms}
    - Preguntas y Respuestas Adicionales:
    ${qaPairs}

    Tu tarea:
    1. Genera una lista de 2 a 4 posibles diagnósticos.
    2. Para cada diagnóstico, proporciona:
        - 'name': El nombre de la condición médica (ej. "Gripe Común").
        - 'probability': Un número del 1 al 100 que represente tu confianza en este diagnóstico. La suma de probabilidades no tiene por qué ser 100.
        - 'short_explanation': Una explicación muy breve (1-2 frases) de la condición y por qué podría coincidir con los síntomas.
        - 'long_explanation': Una explicación más detallada (2-3 párrafos) sobre la condición, sus causas comunes y síntomas típicos.
        - 'recommendations': Una lista de 3 a 5 recomendaciones claras y accionables. Incluye cuidados en casa y cuándo consultar a un médico.
        - 'icon': Una única palabra clave en inglés para un icono que represente la condición (ej. "flu", "headache", "stomach").
    3. Asegúrate de que la salida sea un objeto JSON que se ajuste al esquema proporcionado. No incluyas ninguna explicación fuera del JSON.
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: diagnosisSchema,
                temperature: 0.3,
            },
        });

        const jsonText = (response.text ?? '').trim();
        if (!jsonText) throw new Error("API returned an empty response."); // Throw error to be caught and handled
        const diagnoses: Diagnosis[] = JSON.parse(jsonText);
        // Sort by probability descending
        return diagnoses.sort((a, b) => b.probability - a.probability);
    } catch (error) {
        console.error("Error generating diagnosis:", error);
        // Return some dummy data on error to avoid crashing the UI
        return [
            {
                name: "Error de Análisis",
                probability: 100,
                short_explanation: "No se pudo procesar la solicitud.",
                long_explanation: "Ocurrió un error al contactar al servicio de IA. Por favor, intente de nuevo más tarde. Este no es un diagnóstico médico.",
                recommendations: ["Verifique su conexión a internet.", "Intente con una nueva consulta.", "Si el problema persiste, contacte al soporte."],
                icon: "error"
            }
        ];
    }
};