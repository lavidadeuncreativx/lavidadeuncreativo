'use client';

import React, { useState, useEffect } from 'react';
import { questions } from '../data/questions';
import { TextInput, SelectInput, MultiSelectInput } from './InputTypes';

export default function Typeform() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

    const currentQuestion = questions[currentIndex];

    // Calculate progress
    const progress = ((currentIndex) / questions.length) * 100;

    const handleAnswer = (value: any) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: value
        }));
    };

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setDirection('forward');
            setCurrentIndex(prev => prev + 1);
        } else {
            submitForm();
        }
    };

    const prevQuestion = () => {
        if (currentIndex > 0) {
            setDirection('backward');
            setCurrentIndex(prev => prev - 1);
        }
    };

    const submitForm = async () => {
        setIsSubmitting(true);
        try {
            // Prepare payload mapping answers to apiFields
            const payload: Record<string, any> = {};

            questions.forEach(q => {
                const answer = answers[q.id];
                if (answer) {
                    payload[q.apiField] = answer;
                }
            });

            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to submit');
            }

            setIsCompleted(true);
        } catch (error) {
            console.error(error);
            alert('Hubo un error al enviar tus respuestas. Por favor intenta de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        // Navigate with arrows ?? Maybe conflicting with inputs. 
        // Typeform usually uses Enter to go next. 
        // We strictly use Enter in inputs. 
        // We could allow Up/Down for navigating previously answered questions?
    };

    if (isCompleted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 fade-in max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold mb-6 text-[var(--accent)]">¡Gracias por tomarte el tiempo!</h1>
                <p className="text-xl mb-8">
                    Ya tenemos lo que necesitamos para conocerte mejor. En los próximos días te buscaremos para platicar los pasos a seguir y ayudarte a aterrizar tu marca personal. ¡Esto apenas comienza!
                </p>
            </div>
        );
    }

    if (isSubmitting) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[var(--accent)]"></div>
                <p className="mt-4 text-xl">Enviando respuestas...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col relative w-full">
            {/* Progress Bar */}
            <div className="progress-bar-container">
                <div
                    className="progress-bar"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 container w-full max-w-4xl mx-auto">
                <div
                    key={currentQuestion.id}
                    className="w-full flex flex-col gap-6 fade-in"
                >
                    {/* Question Text */}
                    <div className="flex flex-col gap-2 mb-8">
                        <div className="flex items-center gap-4 text-[var(--accent)] text-sm font-bold uppercase tracking-widest mb-2">
                            <span>Pregunta {currentIndex + 1} de {questions.length}</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                            {currentQuestion.text}
                        </h2>
                        {currentQuestion.description && (
                            <p className="text-lg md:text-xl text-[var(--text-muted)] mt-2">
                                {currentQuestion.description}
                            </p>
                        )}
                    </div>

                    {/* Input Component */}
                    <div className="w-full">
                        {currentQuestion.type === 'text' && (
                            <TextInput
                                question={currentQuestion}
                                value={answers[currentQuestion.id]}
                                onChange={handleAnswer}
                                onEnter={nextQuestion}
                            />
                        )}
                        {currentQuestion.type === 'select' && (
                            <SelectInput
                                question={currentQuestion}
                                value={answers[currentQuestion.id]}
                                onChange={handleAnswer}
                                onEnter={nextQuestion}
                            />
                        )}
                        {currentQuestion.type === 'multi-select' && (
                            <MultiSelectInput
                                question={currentQuestion}
                                value={answers[currentQuestion.id]}
                                onChange={handleAnswer}
                                onEnter={nextQuestion}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation Footer */}
            <div className="fixed bottom-0 left-0 w-full p-6 flex justify-between items-center bg-gradient-to-t from-[var(--background)] to-transparent pointer-events-none">
                <div className="pointer-events-auto">
                    {currentIndex > 0 && (
                        <button onClick={prevQuestion} className="btn btn-outline text-sm py-2 px-4">
                            ← Anterior
                        </button>
                    )}
                </div>
                <div className="pointer-events-auto">
                    <button onClick={nextQuestion} className="btn btn-primary text-sm py-2 px-4">
                        {currentIndex === questions.length - 1 ? 'Finalizar' : 'Siguiente →'}
                    </button>
                </div>
            </div>
        </div>
    );
}
