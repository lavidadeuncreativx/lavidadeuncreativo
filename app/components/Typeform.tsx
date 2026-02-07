'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './FormWizard.module.css';
import { questions, Question } from '../data/questions';

// --- Step Definitions ---
// Grouping questions by their ID prefix in data/questions.ts (b1, b2, etc.)
const STEPS = [
    { id: 'b1', title: 'Datos Básicos', desc: 'Empecemos por conocerte.' },
    { id: 'b2', title: 'Nicho & Experiencia', desc: '¿Dónde te posicionarás?' },
    { id: 'b3', title: 'Objetivos', desc: 'Definamos el norte.' },
    { id: 'b4', title: 'Tu Oferta', desc: '¿Qué vas a vender?' },
    { id: 'b5', title: 'Contenido', desc: 'Canales y formatos.' },
    { id: 'b6', title: 'Ventas & Sistema', desc: 'Cómo cerrarás clientes.' },
    { id: 'b7', title: 'Obstáculos', desc: 'Qué te detiene.' },
    { id: 'b8', title: 'Contacto', desc: 'Para enviarte la propuesta.' },
];

export default function Typeform() {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState<Record<string, boolean>>({});

    const scrollRef = useRef<HTMLDivElement>(null);

    const currentStep = STEPS[currentStepIndex];

    // Filter questions for the current step
    const stepQuestions = questions.filter(q => q.id.startsWith(currentStep.id));

    // --- Handlers ---

    const handleInputChange = (field: string, value: any) => {
        setAnswers(prev => ({ ...prev, [field]: value }));
        // Clear error if exists
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleMultiSelect = (field: string, option: string, max?: number) => {
        const current = (answers[field] as string[]) || [];
        let updated;

        if (current.includes(option)) {
            updated = current.filter(item => item !== option);
        } else {
            if (max && current.length >= max) return; // Max limit reached
            updated = [...current, option];
        }
        handleInputChange(field, updated);
    };

    const validateStep = () => {
        const newErrors: Record<string, boolean> = {};
        let isValid = true;

        stepQuestions.forEach(q => {
            const val = answers[q.apiField];
            // Check if empty
            if (!val || (Array.isArray(val) && val.length === 0)) {
                // Special case: "websiteLink" description says write N/A, but if it's strictly required by Notion, we enforce.
                // Assuming all fields are required for now.
                newErrors[q.apiField] = true;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep()) {
            if (currentStepIndex < STEPS.length - 1) {
                setCurrentStepIndex(prev => prev + 1);
                scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                submitForm();
            }
        }
    };

    const handleBack = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1);
            scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
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

            if (res.ok) {
                setIsSuccess(true);
            } else {
                alert('Hubo un error al enviar. Por favor intenta de nuevo.');
            }
        } catch (e) {
            console.error(e);
            alert('Error de conexión.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Render ---

    if (isSuccess) {
        return (
            <div className={styles.container}>
                <div className={styles.appFrame}>
                    <div className={styles.wizardCard} style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <div className={styles.successCard}>
                            <div className={styles.successIcon}>✓</div>
                            <h2 className={styles.stepTitle}>¡Recibido!</h2>
                            <p className={styles.stepDesc} style={{ marginBottom: '20px' }}>
                                Tu información ha sido enviada con éxito. <br />
                                En 72 horas recibirás tu propuesta por WhatsApp.
                            </p>
                            <button
                                className={styles.btnNext}
                                onClick={() => window.location.href = 'https://lavidadeuncreativo.com'} // Redirect or reset
                            >
                                Volver al Sitio
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const progressPercent = ((currentStepIndex + 1) / STEPS.length) * 100;

    return (
        <div className={styles.container}>

            {/* App Main Frame */}
            <div className={styles.appFrame}>

                {/* Navbar */}
                <nav className={styles.navbar}>
                    <div className={styles.brand}>
                        <div className={styles.brandDot} />
                        Sutura UI
                    </div>

                    <div className={styles.stepsIndicator}>
                        {STEPS.map((step, idx) => (
                            <div
                                key={step.id}
                                className={`${styles.stepDot} ${idx <= currentStepIndex ? styles.stepDotActive : ''} ${idx < currentStepIndex ? styles.stepDotCompleted : ''}`}
                            />
                        ))}
                    </div>
                </nav>

                {/* Wizard Card (Scrollable Form Area) */}
                <div className={styles.wizardCard}>

                    <div className={styles.scrollArea} ref={scrollRef}>

                        <header className={styles.stepHeader}>
                            <span className={styles.labelDesc} style={{ color: '#FD460C', marginBottom: '8px' }}>
                                Paso {currentStepIndex + 1} de {STEPS.length}
                            </span>
                            <h2 className={styles.stepTitle}>{currentStep.title}</h2>
                            <p className={styles.stepDesc}>{currentStep.desc}</p>
                        </header>

                        <form onSubmit={(e) => e.preventDefault()}>
                            {stepQuestions.map((q) => (
                                <div key={q.id} className={styles.fieldGroup}>

                                    <label className={styles.label}>
                                        {q.text}
                                        {q.description && <span className={styles.labelDesc}>{q.description}</span>}
                                    </label>

                                    {/* Input Types */}

                                    {q.type === 'text' && (
                                        <input
                                            type="text"
                                            name={q.apiField}
                                            className={styles.input}
                                            placeholder="Escribe tu respuesta..."
                                            value={answers[q.apiField] || ''}
                                            onChange={(e) => handleInputChange(q.apiField, e.target.value)}
                                        />
                                    )}

                                    {q.type === 'select' && (
                                        <div className={styles.selectWrapper}>
                                            <select
                                                name={q.apiField}
                                                className={styles.select}
                                                value={answers[q.apiField] || ''}
                                                onChange={(e) => handleInputChange(q.apiField, e.target.value)}
                                            >
                                                <option value="" disabled>Selecciona una opción</option>
                                                {q.options?.map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {q.type === 'multi-select' && (
                                        <div className={styles.optionsGrid}>
                                            {q.options?.map(opt => {
                                                const isSelected = (answers[q.apiField] as string[])?.includes(opt);
                                                return (
                                                    <label key={opt} className={styles.optionLabel}>
                                                        <input
                                                            type="checkbox"
                                                            className={styles.hiddenInput}
                                                            checked={isSelected || false}
                                                            onChange={() => handleMultiSelect(q.apiField, opt, q.maxSelections)}
                                                        />
                                                        <span className={styles.chip}>{opt}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {errors[q.apiField] && (
                                        <div className={styles.errorMsg}>⚠️ Este campo es requerido</div>
                                    )}

                                </div>
                            ))}
                        </form>

                    </div>

                    {/* Footer Navigation */}
                    <div className={styles.wizardFooter}>
                        <button
                            className={styles.btnBack}
                            onClick={handleBack}
                            style={{ visibility: currentStepIndex === 0 ? 'hidden' : 'visible' }}
                        >
                            Atrás
                        </button>
                        <button
                            className={styles.btnNext}
                            onClick={handleNext}
                            disabled={isSubmitting}
                        >
                            {currentStepIndex === STEPS.length - 1 ? (isSubmitting ? 'Enviando...' : 'Finalizar') : 'Continuar →'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
