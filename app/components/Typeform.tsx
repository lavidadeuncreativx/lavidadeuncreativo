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
        <div className="flex flex-col min-h-screen bg-[var(--background)] selection:bg-[var(--primary)] selection:text-white" ref={containerRef}>

            {/* Page Header - Flex Item */}
            <header className="w-full p-8 flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse"></div>
                    <span className="font-bold tracking-[0.2em] uppercase text-xs text-zinc-400">
                        Sutura Systems
                    </span>
                </div>
            </header>

            {/* Main Content Area - Flex Grow to Center */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 w-full">

                {/* Form Card */}
                <div className="form-card w-full max-w-[500px] flex flex-col relative z-20">

                    {/* Progress Accent Line */}
                    <div className="w-full h-[2px] bg-zinc-900">
                        <div
                            className="h-full bg-[var(--primary)] transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Step Number - Inside Card Padding */}
                    <div className="px-10 pt-10 pb-4">
                        <span className="text-sm font-mono text-[var(--primary)] bg-[rgba(253,70,12,0.1)] px-2 py-1 rounded inline-block">
                            {(currentIndex + 1).toString().padStart(2, '0')} / {questions.length}
                        </span>
                    </div>

                    {/* Content */}
                    <div className="px-10 pb-10 flex-1 flex flex-col">
                        <AnimatePresence mode="popLayout" custom={direction}>
                            <motion.div
                                key={currentIndex}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full"
                            >
                                <h2 className="text-3xl font-semibold mb-3 text-white leading-tight tracking-tight">
                                    {currentQuestion.text}
                                </h2>

                                <p className="text-[var(--text-muted)] text-base leading-relaxed mb-8 min-h-[48px]">
                                    {currentQuestion.description || "Por favor responde con detalle."}
                                </p>

                                <div className="mb-8">
                                    {currentQuestion.type === 'text' && (
                                        <TextInput
                                            value={answers[currentQuestion.apiField] || ''}
                                            onChange={handleAnswer}
                                            onEnter={nextQuestion}
                                            autoFocus
                                            placeholder="Escribe tu respuesta aquí..."
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

                        {/* Footer in Card */}
                        <div className="flex flex-col gap-3 mt-auto">
                            <button
                                onClick={nextQuestion}
                                className="btn btn-primary w-full"
                            >
                                {currentIndex === questions.length - 1 ? (isSubmitting ? 'Finalizando...' : 'Finalizar') : 'Continuar'}
                            </button>

                            {currentIndex > 0 ? (
                                <button
                                    onClick={prevQuestion}
                                    className="btn btn-secondary w-full"
                                >
                                    Atrás
                                </button>
                            ) : (
                                <div className="h-[48px]"></div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Visual Hint */}
                <div className="mt-8 text-zinc-600 text-xs text-center flex items-center gap-2 opacity-50">
                    <span className="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-[10px]">ENTER ↵</span>
                    <span>para continuar</span>
                </div>

            </main>

            {/* Page Footer - Flex Item */}
            <footer className="w-full p-8 text-center bg-gradient-to-t from-black to-transparent z-10">
                <a
                    href="https://instagram.com/lavidadeuncreativo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-zinc-600 hover:text-[var(--primary)] transition-colors tracking-widest uppercase font-medium"
                >
                    @lavidadeuncreativo
                </a>
            </footer>

        </div>
    );
}
