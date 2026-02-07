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
        <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-zinc-950 text-white selection:bg-orange-500 selection:text-white" ref={containerRef}>

            {/* Main Card Container - Max Width 6XL for "High End" Feel */}
            <div className="w-full max-w-6xl min-h-[700px] bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:grid md:grid-cols-2 relative border border-zinc-800">

                {/* LEFT COLUMN: Visuals / Brand / Context */}
                <div className="relative w-full h-64 md:h-full flex flex-col justify-between p-8 md:p-12 overflow-hidden bg-black">

                    {/* Background Abstract Art */}
                    <div className="absolute inset-0 z-0 opacity-40">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--primary)] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-900 rounded-full mix-blend-multiply filter blur-[80px] opacity-20"></div>
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                    </div>

                    {/* Brand Header */}
                    <div className="relative z-10">
                        <span className="font-bold tracking-widest uppercase text-xs md:text-sm text-white/90">
                            Sutura Systems
                        </span>
                        <div className="h-1 w-8 bg-[var(--primary)] mt-4"></div>
                    </div>

                    {/* Context / tagline */}
                    <div className="relative z-10 mt-auto hidden md:block">
                        <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4 tracking-tight">
                            Construye tu <br />
                            <span className="text-zinc-500">Legado Digital.</span>
                        </h1>
                        <p className="text-zinc-400 text-sm max-w-xs leading-relaxed">
                            Responde con honestidad. Este es el primer paso para escalar tu marca personal al siguiente nivel.
                        </p>
                    </div>

                    {/* Footer Socials (Mobile: Hidden, Desktop: Visible) */}
                    <div className="relative z-10 mt-12 hidden md:block">
                        <a
                            href="https://instagram.com/lavidadeuncreativo"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-zinc-600 hover:text-[var(--primary)] transition-colors tracking-widest uppercase font-medium"
                        >
                            @lavidadeuncreativo
                        </a>
                    </div>
                </div>

                {/* RIGHT COLUMN: Form Interaction */}
                <div className="relative w-full h-full flex flex-col p-8 md:p-16 lg:p-20 bg-zinc-900/50">

                    {/* Progress Bar (Thin, Minimal) */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-zinc-800">
                        <div
                            className="h-full bg-[var(--primary)] transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Step Counter */}
                    <div className="mb-12 flex items-center justify-between">
                        <span className="font-mono text-sm text-[var(--primary)]">
                            {(currentIndex + 1).toString().padStart(2, '0')}
                        </span>
                        <span className="font-mono text-xs text-zinc-600 uppercase tracking-widest">
                            {currentIndex + 1} de {questions.length}
                        </span>
                    </div>

                    {/* Interaction Area */}
                    <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">
                        <AnimatePresence mode="popLayout" custom={direction}>
                            <motion.div
                                key={currentIndex}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full flex-col"
                            >
                                <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 text-white leading-tight">
                                    {currentQuestion.text}
                                </h2>

                                {currentQuestion.description && (
                                    <p className="text-base text-zinc-400 leading-relaxed mb-10 border-l-2 border-zinc-800 pl-4">
                                        {currentQuestion.description}
                                    </p>
                                )}

                                <div className="mb-12 space-y-6">
                                    {currentQuestion.type === 'text' && (
                                        <TextInput
                                            value={answers[currentQuestion.apiField] || ''}
                                            onChange={handleAnswer}
                                            onEnter={nextQuestion}
                                            autoFocus
                                            placeholder="Escribe tu respuesta..."
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

                    {/* Navigation Buttons (Bottom of Right Col) */}
                    <div className="mt-auto pt-8 flex items-center justify-between gap-4 border-t border-zinc-800/50">
                        <button
                            onClick={prevQuestion}
                            disabled={currentIndex === 0}
                            className={`flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors uppercase tracking-wider font-medium px-4 py-3 rounded-lg hover:bg-zinc-800 ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                        >
                            <span>←</span> Atrás
                        </button>

                        <button
                            onClick={nextQuestion}
                            className="btn btn-primary px-8 py-3 text-sm shadow-none md:shadow-lg"
                        >
                            {currentIndex === questions.length - 1 ? (isSubmitting ? 'Finalizando...' : 'Finalizar') : 'Continuar'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
