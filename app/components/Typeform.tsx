'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TextInput, SelectInput, MultiSelectInput } from './InputTypes';

// Question Definition
type QuestionType = 'text' | 'select' | 'multi-select';

interface Question {
    id: number;
    text: string;
    description?: string;
    type: QuestionType;
    options?: string[];
    maxSelections?: number;
    apiField: string;
}

// Full Question List
const questions: Question[] = [
    { id: 1, text: "Nombre completo", description: "(Ej. Juan Pérez)", type: 'text', apiField: 'fullName' },
    { id: 2, text: "Correo electrónico", description: "Donde recibirás tu plan.", type: 'text', apiField: 'email' },
    { id: 3, text: "¿A qué te dedicas actualmente?", description: "Sé específico.", type: 'text', apiField: 'occupation' },
    { id: 4, text: "¿Cómo definirías tu nivel de experiencia en tu campo?", type: 'select', options: ['Principiante (0-2 años)', 'Intermedio (2-5 años)', 'Avanzado (+5 años)', 'Experto/Referente'], apiField: 'experienceLevel' },
    { id: 5, text: "¿Tienes una marca personal activa?", type: 'select', options: ['Sí, publico constantemente', 'Sí, pero publico poco', 'No, pero quiero empezar', 'No, y no sé por dónde empezar'], apiField: 'activeBrand' },
    { id: 6, text: "¿En qué redes sociales tienes presencia?", type: 'multi-select', options: ['Instagram', 'LinkedIn', 'X (Twitter)', 'TikTok', 'YouTube', 'Newsletter / Blog', 'Ninguna'], apiField: 'socials' },
    { id: 7, text: "¿Cuál es tu principal objetivo con tu marca personal?", type: 'select', options: ['Conseguir más clientes/ventas', 'Posicionarme como autoridad', 'Conseguir empleo/oportunidades', 'Crear una comunidad', 'Otro'], apiField: 'mainGoal' },
    { id: 8, text: "¿Qué te impide potenciar tu marca ahora mismo?", type: 'select', options: ['Falta de tiempo', 'No sé qué publicar', 'Miedo a la exposición', 'Falta de estrategia', 'No veo resultados'], apiField: 'obstacle' },
    { id: 9, text: "Si pudieras ser reconocido por UNA sola cosa, ¿cuál sería?", type: 'text', apiField: 'oneThing' },
    { id: 10, text: "¿Tienes sitio web o portafolio?", type: 'select', options: ['Sí', 'No', 'En proceso'], apiField: 'hasWebsite' },
    { id: 11, text: "Agrega el link (si tienes)", description: "Si no, escribe 'N/A'", type: 'text', apiField: 'websiteLink' },
    { id: 12, text: "¿Creas contenido en video?", type: 'select', options: ['Sí, me siento cómodo', 'Sí, pero me cuesta', 'No, pero quiero intentarlo', 'No, prefiero texto/audio'], apiField: 'videoContent' },
    { id: 13, text: "¿Cuánto tiempo puedes dedicarle a tu marca semanalmente?", type: 'select', options: ['Menos de 2 horas', '2-5 horas', '5-10 horas', '+10 horas'], apiField: 'timeCommitment' },
    { id: 14, text: "¿Has invertido antes en formación o mentoría?", type: 'select', options: ['Sí, muchas veces', 'Sí, alguna vez', 'No, nunca'], apiField: 'pastInvestment' },
    { id: 15, text: "¿Cuál es tu mayor fortaleza profesional?", type: 'text', apiField: 'strength' },
    { id: 16, text: "¿Cuál consideras tu mayor debilidad o área de mejora?", type: 'text', apiField: 'weakness' },
    { id: 17, text: "¿Quién es tu cliente o audiencia ideal?", description: "Descríbelo brevemente.", type: 'text', apiField: 'idealAudience' },
    { id: 18, text: "¿Qué te diferencia de tu competencia?", type: 'text', apiField: 'differentiation' },
    { id: 19, text: "¿Tienes algún referente o marca que admires?", description: "¿Quién y por qué?", type: 'text', apiField: 'roleModel' },
    { id: 20, text: "¿Qué tipo de tono te gustaría tener?", type: 'select', options: ['Profesional y serio', 'Cercano y amigable', 'Disruptivo y polémico', 'Educativo y técnico'], apiField: 'toneVoice' },
    { id: 21, text: "¿Te gusta escribir?", type: 'select', options: ['Me encanta', 'Lo hago bien', 'Me cuesta', 'Lo odio'], apiField: 'writingAffinity' },
    { id: 22, text: "¿Cuál es tu presupuesto mensual aproximado para invertir en tu marca?", type: 'select', options: ['0 - $200 USD', '$200 - $500 USD', '$500 - $1000 USD', '+$1000 USD'], apiField: 'budget' },
    { id: 23, text: "¿Qué esperas lograr en los próximos 6 meses?", type: 'text', apiField: 'sixMonthGoal' },
    { id: 24, text: "¿Cuál es tu nivel de compromiso del 1 al 10?", type: 'select', options: ['10 - Haré lo que sea necesario', '8-9 - Muy comprometido', '5-7 - Lo intentaré', 'Menos de 5'], apiField: 'commitmentLevel' },
    { id: 25, text: "¿Tienes equipo o trabajas solo?", type: 'select', options: ['Solo', 'Tengo colaboradores freelance', 'Tengo equipo fijo'], apiField: 'teamStructure' },
    { id: 26, text: "¿Usas herramientas de IA actualmente?", type: 'select', options: ['Sí, a diario', 'A veces', 'No, pero me interesa', 'No me interesa'], apiField: 'aiUsage' },
    { id: 27, text: "¿Qué formato de contenido consumes más?", type: 'select', options: ['Video corto (TikTok/Reels)', 'Video largo (YouTube)', 'Texto (LinkedIn/Blogs/Newsletter)', 'Audio (Podcast)'], apiField: 'contentConsumption' },
    { id: 28, text: "¿Estarías dispuesto a cambiar tu imagen visual si fuera necesario?", type: 'select', options: ['Sí, totalmente', 'Tal vez', 'No, me gusta mi imagen actual'], apiField: 'rebrandingWillingness' },
    { id: 29, text: "Algo más que debamos saber...", type: 'text', apiField: 'extraInfo' },
    { id: 30, text: "¿Cómo te enteraste de nosotros?", type: 'text', apiField: 'referral' },
    { id: 31, text: "Último paso: Déjanos tu WhatsApp", description: "Para contactarte más rápido.", type: 'text', apiField: 'whatsapp' },
];

export default function Typeform() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [direction, setDirection] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Validation State
    const [error, setError] = useState(false);

    // Auto-scroll to top when question changes
    const containerRef = useRef<HTMLDivElement>(null);

    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    const handleAnswer = (value: any) => {
        setAnswers({ ...answers, [currentQuestion.apiField]: value });
        if (error) setError(false);
    };

    const validateAndProceed = () => {
        const value = answers[currentQuestion.apiField];
        const isMulti = currentQuestion.type === 'multi-select';

        let isValid = false;
        if (isMulti) {
            isValid = Array.isArray(value) && value.length > 0;
        } else {
            isValid = value && typeof value === 'string' && value.trim().length > 0;
        }

        if (isValid) {
            setError(false);
            if (currentIndex < questions.length - 1) {
                setDirection(1);
                setCurrentIndex(currentIndex + 1);
            } else {
                submitForm();
            }
        } else {
            setError(true);
            // Vibrating/Shake animation reset
            setTimeout(() => setError(false), 500);
        }
    };

    const nextQuestion = () => {
        validateAndProceed();
    };

    const prevQuestion = () => {
        if (currentIndex > 0) {
            setDirection(-1);
            setCurrentIndex(currentIndex - 1);
        }
    };

    const submitForm = async () => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        alert(JSON.stringify(answers, null, 2));
        setIsSubmitting(false);
    };

    // Animation Variants
    const slideVariants = {
        enter: (direction: number) => ({
            y: direction > 0 ? 30 : -30,
            opacity: 0,
        }),
        center: {
            y: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            y: direction < 0 ? 30 : -30,
            opacity: 0,
        }),
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setError(false);
    }, [currentIndex]);

    return (
        <div className="w-full min-h-screen flex flex-col bg-white text-[#262627]" ref={containerRef}>

            {/* Progress Bar (Fixed Top) */}
            <div className="fixed top-0 left-0 w-full h-1 bg-gray-100 z-50">
                <div
                    className="h-full bg-[#0445AF] transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Main Content (Centered and Constrained) */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 md:px-0">
                <div className="w-full max-w-3xl mx-auto flex flex-col items-start min-h-[50vh]">

                    {/* Question Counter (Minimal) */}
                    <div className="mb-8 flex items-center gap-2 text-[#0445AF] text-sm font-semibold tracking-wide uppercase">
                        <span>Pregunta {currentIndex + 1}</span>
                        <span className="text-gray-300">/</span>
                        <span className="text-gray-400">{questions.length}</span>
                    </div>

                    <AnimatePresence mode="popLayout" custom={direction}>
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="w-full flex flex-col items-start"
                        >
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-8 leading-snug text-left">
                                <span className="font-bold mr-2">{currentIndex + 1}.</span>
                                {currentQuestion.text as string}
                            </h2>

                            {currentQuestion.description && (
                                <p className="text-xl text-gray-500 mb-10 font-normal leading-relaxed max-w-2xl">
                                    {currentQuestion.description as string}
                                </p>
                            )}

                            <div className={`w-full mb-12 transition-transform duration-100 ${error ? 'translate-x-[-4px]' : ''}`}>
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
                                            // Small delay for natural interaction
                                            setTimeout(() => {
                                                if (currentIndex < questions.length - 1) {
                                                    setDirection(1);
                                                    setCurrentIndex(currentIndex + 1);
                                                } else {
                                                    submitForm();
                                                }
                                            }, 250);
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

                                {error && (
                                    <div className="mt-4 text-[#bd081c] bg-[#ffebeb] px-4 py-2 rounded-md inline-flex items-center text-sm font-medium animate-pulse">
                                        ⚠️ Debes responder esta pregunta para continuar.
                                    </div>
                                )}
                            </div>

                            {/* Actions / Navigation */}
                            <div className="flex items-center gap-6 mt-4">
                                <button
                                    onClick={nextQuestion}
                                    className="btn btn-primary text-xl px-12 py-4 shadow-lg hover:shadow-xl transition-all"
                                >
                                    {currentIndex === questions.length - 1 ? (isSubmitting ? 'Enviando...' : 'Finalizar') : 'OK'} <span className="text-base opacity-70 ml-2">↵</span>
                                </button>

                                {currentIndex > 0 && (
                                    <button
                                        onClick={prevQuestion}
                                        className="text-sm font-bold text-gray-400 hover:text-gray-800 transition-colors uppercase tracking-wider px-4 py-2"
                                    >
                                        ATRÁS
                                    </button>
                                )}
                            </div>

                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Minimal Footer */}
            <div className="fixed bottom-6 right-6 z-40">
                <a
                    href="https://instagram.com/lavidadeuncreativo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/90 backdrop-blur px-4 py-2 rounded-full border border-gray-100 text-[10px] text-gray-400 hover:text-black transition-colors shadow-sm"
                >
                    POWERED BY <strong>SUTURA</strong> <span className="opacity-50 ml-1 text-[9px]">v2.0</span>
                </a>
            </div>

        </div>
    );
}
