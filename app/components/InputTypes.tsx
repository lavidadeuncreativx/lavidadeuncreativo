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
                className="input-base"
            />
            {/* Removed the helper text below input for cleaner UI, or move it to a tooltip/subtle hint */}
        </div>
    );
};

export const SelectInput: React.FC<SelectInputProps> = ({ options, value, onChange }) => {
    return (
        <div className="flex flex-col gap-2 w-full">
            {options.map((option, index) => {
                const isSelected = value === option;
                const letter = String.fromCharCode(65 + index);

                return (
                    <div
                        key={option}
                        onClick={() => onChange(option)}
                        className={`group cursor-pointer p-4 rounded-xl border transition-all duration-200 flex items-center gap-4
                            ${isSelected
                                ? 'border-[var(--primary)] bg-[rgba(253,70,12,0.05)] shadow-[inset_0_0_0_1px_var(--primary)]'
                                : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                            }`}
                    >
                        <span className={`flex items-center justify-center w-7 h-7 rounded border text-xs font-mono transition-colors
                            ${isSelected ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-white/20 text-white/40'}`}>
                            {letter}
                        </span>
                        <span className="text-base text-white/90 font-medium">
                            {option}
                        </span>
                        {isSelected && <span className="ml-auto text-[var(--primary)]">●</span>}
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
        <div className="flex flex-col gap-2 w-full">
            {options.map((option, index) => {
                const isSelected = selectedValues.includes(option);
                const letter = String.fromCharCode(65 + index);

                return (
                    <div
                        key={option}
                        onClick={() => handleToggle(option)}
                        className={`group cursor-pointer p-4 rounded-xl border transition-all duration-200 flex items-center gap-4
                            ${isSelected
                                ? 'border-[var(--primary)] bg-[rgba(253,70,12,0.05)] shadow-[inset_0_0_0_1px_var(--primary)]'
                                : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                            }`}
                    >
                        <span className={`flex items-center justify-center w-7 h-7 rounded border text-xs font-mono transition-colors
                            ${isSelected ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-white/20 text-white/40'}`}>
                            {letter}
                        </span>
                        <span className="text-base text-white/90 font-medium">
                            {option}
                        </span>
                        {isSelected && <span className="ml-auto text-[var(--primary)]">●</span>}
                    </div>
                );
            })}

            <div className="mt-4 text-xs font-medium uppercase tracking-wide text-zinc-500 text-right">
                {maxSelections ? `Máximo ${maxSelections}` : 'Selección múltiple'}
            </div>
        </div>
    );
};
