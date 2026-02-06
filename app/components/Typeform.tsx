'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { questions } from '../data/questions';
import { TextInput, SelectInput, MultiSelectInput } from './InputTypes';

export default function Typeform() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const currentQuestion = questions[currentIndex];
    // Calculate progress immediately based on current index
    const progress = ((currentIndex + 1) / questions.length) * 100;

    useEffect(() => {
        // Scroll to top or focus handling
        if (containerRef.current) {
            containerRef.current.focus();
        }
    }, [currentIndex]);

    const handleAnswer = (value: any) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestion.apiField]: value
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
            const res = await fetch('/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(answers),
            });

            if (!res.ok) throw new Error('Error al enviar');
            setIsCompleted(true);
        } catch (error) {
            console.error(error);
            alert('Hubo un error al enviar tus respuestas');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Listen for "Enter" to go next (except for textarea usually)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                nextQuestion();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex]);

    const slideVariants = {
        enter: (direction: string) => ({
            y: direction === 'forward' ? 20 : -20,
            opacity: 0
        }),
        center: {
            y: 0,
            opacity: 1
        },
        exit: (direction: string) => ({
            y: direction === 'forward' ? -20 : 20,
            opacity: 0
        })
    };

    if (isCompleted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-8 fade-in">
                <h2 className="text-3xl font-bold mb-4 text-[var(--primary)]">
                    ¡Gracias por completar el diagnóstico!
                </h2>
                <p className="text-[var(--text-muted)] text-xl max-w-lg">
                    Hemos recibido toda tu información.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 md:p-6" ref={containerRef}>

            {/* Main Form Card */}
            <div className="form-card w-full max-w-2xl min-h-[500px] flex flex-col p-6 md:p-10 relative">

                {/* Header: Logo & Progress */}
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[var(--primary)] shadow-[0_0_10px_var(--primary)]"></div>
                        <span className="font-bold tracking-wider uppercase text-xs text-white/90">Sutura Systems</span>
                    </div>
                    <div className="text-xs font-mono text-[var(--text-muted)] bg-white/5 px-2 py-1 rounded">
                        {currentIndex + 1} / {questions.length}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col justify-center relative z-10">
                    <AnimatePresence mode="popLayout" custom={direction}>
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="w-full"
                        >
                            <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-snug text-white">
                                {currentQuestion.text}
                            </h2>

                            {currentQuestion.description && (
                                <p className="text-base text-[var(--text-muted)] leading-relaxed mb-8">
                                    {currentQuestion.description}
                                </p>
                            )}

                            <div className="mt-6 mb-2">
                                {currentQuestion.type === 'text' && (
                                    <TextInput
                                        value={answers[currentQuestion.apiField] || ''}
                                        onChange={handleAnswer}
                                        onEnter={nextQuestion}
                                        autoFocus
                                    />
                                )}

                                {currentQuestion.type === 'select' && (
                                    <SelectInput
                                        options={currentQuestion.options || []}
                                        value={answers[currentQuestion.apiField]}
                                        onChange={(val) => {
                                            handleAnswer(val);
                                            setTimeout(nextQuestion, 200);
                                        }}
                                    />
                                )}

                                {currentQuestion.type === 'multi-select' && (
                                    <MultiSelectInput
                                        options={currentQuestion.options || []}
                                        value={answers[currentQuestion.apiField] || []}
                                        onChange={handleAnswer}
                                        maxSelections={currentQuestion.maxSelections}
                                    />
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer / Navigation */}
                <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/5">
                    <button
                        onClick={prevQuestion}
                        disabled={currentIndex === 0}
                        className={`btn btn-secondary text-sm px-6 ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                    >
                        Atrás
                    </button>

                    <div className="flex items-center gap-4">
                        <span className="hidden md:block text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                            Enter ↵
                        </span>
                        <button
                            onClick={nextQuestion}
                            className="btn btn-primary text-sm px-8"
                        >
                            {currentIndex === questions.length - 1 ? (isSubmitting ? 'Enviando...' : 'Finalizar') : 'Siguiente'}
                        </button>
                    </div>
                </div>

                {/* Progress Bar (Bottom of card) */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
                    <div
                        className="h-full bg-[var(--primary)] transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Copyright / Footer outside card */}
            <div className="mt-8 text-[10px] text-white/20 uppercase tracking-widest">
                © Sutura Systems 2025
            </div>

        </div>
    );
}
