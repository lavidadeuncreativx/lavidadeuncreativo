import React, { useEffect, useRef } from 'react';
import { Question } from '../data/questions';

type InputProps = {
    question: Question;
    value: string | string[];
    onChange: (value: string | string[]) => void;
    onEnter: () => void; // Trigger for auto-advance or enter key
};

export const TextInput: React.FC<InputProps> = ({ question, value, onChange, onEnter }) => {
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    useEffect(() => {
        // Auto-focus input when component mounts
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []); // Run only on mount

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onEnter();
        }
    };

    return (
        <div className="w-full">
            {/* If it's a long answer (implied by description 'Respuesta larga'), use textarea, else input */}
            {question.description?.includes('Respuesta larga') ? (
                <textarea
                    // @ts-ignore
                    ref={inputRef}
                    value={value as string || ''}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={(e) => {
                        // For textarea, Ctrl+Enter or Command+Enter to submit
                        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                            e.preventDefault();
                            onEnter();
                        }
                    }}
                    placeholder="Escribe tu respuesta aquí..."
                    className="text-2xl font-light"
                    rows={3}
                />
            ) : (
                <input
                    // @ts-ignore
                    ref={inputRef}
                    type="text"
                    value={value as string || ''}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Escribe tu respuesta aquí..."
                    className="text-3xl font-light"
                />
            )}
            <div className="mt-4 text-sm text-[var(--text-muted)] flex items-center gap-2">
                {question.description?.includes('Respuesta larga') ? (
                    <span>Presiona <strong>Cmd + Enter</strong> para continuar</span>
                ) : (
                    <span>Presiona <strong>Enter ↵</strong> para continuar</span>
                )}
            </div>
        </div>
    );
};

export const SelectInput: React.FC<InputProps> = ({ question, value, onChange, onEnter }) => {
    const handleSelect = (option: string) => {
        onChange(option);
        // Auto-advance for single select after a short delay for visual feedback
        setTimeout(() => {
            onEnter();
        }, 300);
    };

    return (
        <div className="flex flex-col gap-2 w-full max-w-xl">
            {question.options?.map((option, index) => {
                const isSelected = value === option;
                const letter = String.fromCharCode(65 + index); // A, B, C...

                return (
                    <div
                        key={option}
                        onClick={() => handleSelect(option)}
                        className={`selection-card ${isSelected ? 'selected' : ''}`}
                    >
                        <span className="key">{letter}</span>
                        <span className="flex-1">{option}</span>
                        {isSelected && <span className="text-[var(--accent)]">✓</span>}
                    </div>
                );
            })}
        </div>
    );
};

export const MultiSelectInput: React.FC<InputProps> = ({ question, value, onChange, onEnter }) => {
    const selectedValues = (value as string[]) || [];

    const handleToggle = (option: string) => {
        let newValues = [...selectedValues];
        if (newValues.includes(option)) {
            newValues = newValues.filter((v) => v !== option);
        } else {
            if (question.maxSelections && newValues.length >= question.maxSelections) {
                // Maybe show toast or shake? For now just don't add.
                return;
            }
            newValues.push(option);
        }
        onChange(newValues);
    };

    return (
        <div className="flex flex-col gap-2 w-full max-w-xl">
            {question.options?.map((option, index) => {
                const isSelected = selectedValues.includes(option);
                const letter = String.fromCharCode(65 + index);

                return (
                    <div
                        key={option}
                        onClick={() => handleToggle(option)}
                        className={`selection-card ${isSelected ? 'selected' : ''}`}
                    >
                        <span className="key">{letter}</span>
                        <span className="flex-1">{option}</span>
                        {isSelected && <span className="text-[var(--accent)]">✓</span>}
                    </div>
                );
            })}

            <div className="mt-6">
                <button
                    onClick={onEnter}
                    disabled={selectedValues.length === 0}
                    className={`btn btn-primary ${selectedValues.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    Aceptar
                </button>
            </div>
        </div>
    );
};
