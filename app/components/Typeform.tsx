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
        <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 relative" ref={containerRef}>

            {/* Page Header - Fixed Top */}
            <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50">
                <span className="font-bold tracking-widest uppercase text-xs md:text-sm text-white/90">
                    Sutura Systems
                </span>
            </header>

            {/* Main Form Card - Compact & Centered */}
            <div className="form-card w-full max-w-[480px] min-h-[600px] flex flex-col relative z-10 rounded-3xl">

                {/* Progress Line (Top of card) */}
                <div className="w-full h-1 bg-zinc-800">
                    <div
                        className="h-full bg-[var(--primary)] transition-all duration-500 ease-out shadow-[0_0_10px_var(--primary)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Card Content */}
                <div className="flex-1 flex flex-col p-8 md:p-10 relative">

                    {/* Question Number - Absolute Top Left of Card content */}
                    <div className="absolute top-8 left-8 text-4xl font-mono font-bold text-white/5 select-none">
                        {(currentIndex + 1).toString().padStart(2, '0')}
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
                            className="w-full flex-1 flex flex-col justify-center mt-8" // Added mt-8 to clear the number
                        >
                            <h2 className="text-2xl font-bold mb-4 leading-snug text-white text-center">
                                {currentQuestion.text}
                            </h2>

                            {currentQuestion.description && (
                                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-10 text-center px-2">
                                    {currentQuestion.description}
                                </p>
                            )}

                            <div className="mb-8 w-full">
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

                    {/* Footer: Stacked Buttons */}
                    <div className="mt-auto pt-4 flex flex-col gap-3">
                        <button
                            onClick={nextQuestion}
                            className="btn btn-primary w-full py-4 text-base shadow-lg"
                        >
                            {currentIndex === questions.length - 1 ? (isSubmitting ? 'Enviando...' : 'Finalizar') : 'Continuar'}
                        </button>

                        <div className="h-6 flex items-center justify-center">
                            {currentIndex > 0 && (
                                <button
                                    onClick={prevQuestion}
                                    className="text-xs text-zinc-500 hover:text-white transition-colors uppercase tracking-wider font-medium px-4 py-2"
                                >
                                    Volver
                                </button>
                            )}
                        </div>
                    </div>

                </div>

            </div>

            {/* Page Footer - Instagram */}
            <footer className="absolute bottom-0 left-0 w-full p-6 text-center z-50">
                <a
                    href="https://instagram.com/lavidadeuncreativo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] md:text-xs text-white/20 hover:text-[var(--primary)] transition-colors uppercase tracking-widest"
                >
                    @lavidadeuncreativo
                </a>
            </footer>

        </div>
    );
}
