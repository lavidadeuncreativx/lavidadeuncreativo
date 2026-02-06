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
