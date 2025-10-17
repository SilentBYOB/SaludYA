import { GoogleGenAI, Type } from "@google/genai";
import { Diagnosis } from '../types';

// Fix: Per guidelines, initialize with a named apiKey parameter from process.env.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
        
        // Fix: Per guidelines, use response.text to get the generated text.
        const jsonText = response.text.trim();
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

        // Fix: Per guidelines, use response.text
        const jsonText = response.text.trim();
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
