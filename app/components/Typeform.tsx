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
        <div className="w-full min-h-screen flex flex-col items-center justify-center p-6 md:p-12 relative" ref={containerRef}>

            {/* Simple Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 bg-white/5 z-50">
                <div
                    className="h-full bg-[var(--primary)] transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="w-full max-w-2xl mx-auto flex flex-col justify-center min-h-[50vh]">

                {/* Question Counter - Minimal */}
                <div className="mb-6 text-[var(--primary)] text-sm font-mono opacity-80">
                    {currentIndex + 1} <span className="text-white/20">→</span> {questions.length}
                </div>

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
                        {/* Question Text - Big & Clean */}
                        <h2 className="text-3xl md:text-5xl font-light mb-8 leading-tight text-white">
                            {currentQuestion.text}
                        </h2>

                        {currentQuestion.description && (
                            <p className="text-xl text-[var(--text-muted)] font-light leading-relaxed mb-8">
                                {currentQuestion.description}
                            </p>
                        )}

                        {/* Inputs */}
                        <div className="mb-12">
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

                {/* Minimal Navigation */}
                <div className="flex items-center gap-6 mt-auto pt-8">
                    <button
                        onClick={nextQuestion}
                        className="bg-[var(--primary)] text-white px-8 py-3 rounded text-lg font-medium hover:bg-opacity-90 transition-all"
                    >
                        {currentIndex === questions.length - 1 ? (isSubmitting ? 'Enviando...' : 'Finalizar') : 'OK ✓'}
                    </button>

                    {currentIndex > 0 && (
                        <button
                            onClick={prevQuestion}
                            className="text-white/50 hover:text-white px-4 py-2 text-sm transition-colors"
                        >
                            Atrás
                        </button>
                    )}

                    <div className="hidden md:block text-xs text-white/20 ml-auto uppercase tracking-wider">
                        Presiona <strong>Enter ↵</strong>
                    </div>
                </div>

            </div>
        </div>
    );
}
