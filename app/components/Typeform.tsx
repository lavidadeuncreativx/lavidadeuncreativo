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
            y: direction === 'forward' ? 50 : -50,
            opacity: 0
        }),
        center: {
            y: 0,
            opacity: 1
        },
        exit: (direction: string) => ({
            y: direction === 'forward' ? -50 : 50,
            opacity: 0
        })
    };

    if (isCompleted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-8 fade-in">
                <h2 className="text-4xl font-bold mb-4text-[var(--primary)]">
                    ¡Gracias por completar el diagnóstico!
                </h2>
                <p className="text-[var(--text-muted)] text-xl max-w-lg">
                    Hemos recibido toda tu información. Analizaremos tu perfil y te contactaremos pronto para dar el siguiente paso.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center p-6 relative z-10" ref={containerRef}>

            {/* Progress Bar - Fixed Top */}
            <div className="fixed top-0 left-0 w-full h-1 bg-white/5 z-50">
                <div
                    className="h-full bg-[var(--primary)] transition-all duration-500 ease-out shadow-[0_0_20px_var(--primary)]"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Main Content Card / Container */}
            <div className="w-full max-w-xl mx-auto flex flex-col justify-center">

                {/* Header: Branding & Counter */}
                <div className="flex items-center justify-between mb-8 opacity-60">
                    <span className="font-bold tracking-[0.2em] uppercase text-xs text-[var(--primary)] shadow-[0_0_10px_rgba(253,70,12,0.3)]">
                        Sutura Systems
                    </span>
                    <span className="font-mono text-xs tracking-widest text-white/50">
                        {currentIndex + 1} / {questions.length}
                    </span>
                </div>

                <AnimatePresence mode="popLayout" custom={direction}>
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full relative z-10"
                    >
                        {/* Question */}
                        <div className="mb-8">
                            <h2 className="text-2xl md:text-4xl font-bold mb-4 leading-tight text-white tracking-tight drop-shadow-lg">
                                {currentQuestion.text}
                            </h2>
                            {currentQuestion.description && (
                                <p className="text-lg text-[var(--text-muted)] font-light leading-relaxed">
                                    {currentQuestion.description}
                                </p>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="min-h-[120px] mb-8">
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
                                        setTimeout(nextQuestion, 300); // Faster auto advance
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

                {/* Navigation Footer - Inline */}
                <div className="flex items-center gap-4 border-t border-white/10 pt-6 mt-4">
                    <button
                        onClick={nextQuestion}
                        className="btn btn-primary px-8 py-3 text-base flex-1 md:flex-none md:w-auto min-w-[140px]"
                    >
                        {currentIndex === questions.length - 1 ? (isSubmitting ? 'Enviando...' : 'Finalizar') : 'Siguiente ↵'}
                    </button>

                    <button
                        onClick={prevQuestion}
                        disabled={currentIndex === 0}
                        className={`btn btn-ghost px-6 py-3 text-xs uppercase tracking-widest ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-50 hover:opacity-100'}`}
                    >
                        Anterior
                    </button>

                    <div className="hidden md:flex ml-auto text-[10px] text-white/20 uppercase tracking-widest">
                        Presiona Enter ↵
                    </div>
                </div>

            </div>

        </div>
    );
}
