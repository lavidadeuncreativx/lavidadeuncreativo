import React, { useEffect, useRef } from 'react';

type TextInputProps = {
    value: string;
    onChange: (value: string) => void;
    onEnter: () => void;
    autoFocus?: boolean;
    placeholder?: string;
};

type SelectInputProps = {
    options: string[];
    value: string | string[];
    onChange: (value: any) => void;
    maxSelections?: number;
};

export const TextInput: React.FC<TextInputProps> = ({ value, onChange, onEnter, autoFocus, placeholder }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onEnter();
        }
    };

    return (
        <div className="w-full">
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder || "Escribe tu respuesta..."}
                className="input-base text-2xl md:text-3xl font-light bg-transparent border-0 border-b-2 border-white/20 focus:border-[var(--primary)] focus:ring-0 px-0 py-4 w-full transition-colors placeholder:text-white/20"
            />
            <div className="mt-4 text-xs uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2 opacity-60">
                <span>Presiona <strong>Enter ↵</strong> para continuar</span>
            </div>
        </div>
    );
};

export const SelectInput: React.FC<SelectInputProps> = ({ options, value, onChange }) => {
    return (
        <div className="flex flex-col gap-3 w-full max-w-xl">
            {options.map((option, index) => {
                const isSelected = value === option;
                const letter = String.fromCharCode(65 + index);

                return (
                    <div
                        key={option}
                        onClick={() => onChange(option)}
                        className={`group cursor-pointer p-4 rounded-xl border transition-all duration-200 flex items-center gap-4
                            ${isSelected
                                ? 'border-[var(--primary)] bg-[var(--primary-transparent)] shadow-[0_0_15px_rgba(253,70,12,0.15)] transform scale-[1.02]'
                                : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                            }`}
                    >
                        <span className={`flex items-center justify-center w-8 h-8 rounded-md border text-sm font-mono transition-colors
                            ${isSelected ? 'border-[var(--primary)] text-[var(--primary)] bg-black/20' : 'border-white/20 text-white/40 group-hover:border-white/40'}`}>
                            {letter}
                        </span>
                        <span className={`text-lg transition-colors ${isSelected ? 'text-white font-medium' : 'text-white/80'}`}>
                            {option}
                        </span>
                        {isSelected && <span className="ml-auto text-[var(--primary)]">✓</span>}
                    </div>
                );
            })}
        </div>
    );
};

export const MultiSelectInput: React.FC<SelectInputProps> = ({ options, value, onChange, maxSelections }) => {
    const selectedValues = (value as string[]) || [];

    const handleToggle = (option: string) => {
        let newValues = [...selectedValues];
        if (newValues.includes(option)) {
            newValues = newValues.filter((v) => v !== option);
        } else {
            if (maxSelections && newValues.length >= maxSelections) return;
            newValues.push(option);
        }
        onChange(newValues);
    };

    return (
        <div className="flex flex-col gap-3 w-full max-w-xl">
            {options.map((option, index) => {
                const isSelected = selectedValues.includes(option);
                const letter = String.fromCharCode(65 + index);

                return (
                    <div
                        key={option}
                        onClick={() => handleToggle(option)}
                        className={`group cursor-pointer p-4 rounded-xl border transition-all duration-200 flex items-center gap-4
                            ${isSelected
                                ? 'border-[var(--primary)] bg-[var(--primary-transparent)] shadow-[0_0_15px_rgba(253,70,12,0.15)] transform scale-[1.02]'
                                : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                            }`}
                    >
                        <span className={`flex items-center justify-center w-8 h-8 rounded-md border text-sm font-mono transition-colors
                            ${isSelected ? 'border-[var(--primary)] text-[var(--primary)] bg-black/20' : 'border-white/20 text-white/40 group-hover:border-white/40'}`}>
                            {letter}
                        </span>
                        <span className={`text-lg transition-colors ${isSelected ? 'text-white font-medium' : 'text-white/80'}`}>
                            {option}
                        </span>
                        {isSelected && <span className="ml-auto text-[var(--primary)]">✓</span>}
                    </div>
                );
            })}

            <div className="mt-4 text-xs uppercase tracking-widest text-[var(--text-muted)] opacity-60 text-right">
                {maxSelections ? `Selecciona hasta ${maxSelections}` : 'Selecciona todas las que apliquen'}
            </div>
        </div>
    );
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
