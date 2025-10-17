
import React, { useState } from 'react';

interface QuestionScreenProps {
    questions: string[];
    onSubmit: (answers: string[]) => void;
}

const QuestionScreen: React.FC<QuestionScreenProps> = ({ questions, onSubmit }) => {
    const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(''));

    const handleAnswerChange = (index: number, value: string) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (answers.every(answer => answer.trim())) {
            onSubmit(answers);
        }
    };

    const isFormValid = answers.every(answer => answer.trim());

    return (
        <div className="flex flex-col h-full">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark mb-4">Ayúdanos a entenderte mejor</h2>
            <p className="text-gray-600 mb-6">
                Para entender mejor su situación, por favor responda a las siguientes preguntas generadas por nuestra IA.
            </p>
            <form onSubmit={handleSubmit} className="flex-grow space-y-6">
                {questions.map((question, index) => (
                    <div key={index}>
                        <label className="block text-lg font-semibold text-primary-dark mb-2">
                            {index + 1}. {question}
                        </label>
                        <input
                            type="text"
                            value={answers[index]}
                            onChange={(e) => handleAnswerChange(index, e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg text-base text-primary-dark focus:ring-2 focus:ring-primary-light focus:border-primary-light transition-colors"
                            placeholder="Escriba su respuesta aquí..."
                        />
                    </div>
                ))}
                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={!isFormValid}
                        className="w-full sm:w-auto bg-primary text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        Obtener Diagnóstico
                    </button>
                </div>
            </form>
        </div>
    );
};

export default QuestionScreen;