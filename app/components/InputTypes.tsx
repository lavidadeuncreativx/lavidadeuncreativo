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
                placeholder={placeholder}
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
                                ? 'border-[var(--primary)] bg-[var(--primary)] text-white shadow-lg'
                                : 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-300'
                            }`}
                    >
                        <span className={`flex items-center justify-center w-6 h-6 rounded border text-xs font-mono transition-colors
                            ${isSelected ? 'border-white/40 text-white' : 'border-zinc-700 text-zinc-500'}`}>
                            {letter}
                        </span>
                        <span className="text-sm font-medium">
                            {option}
                        </span>
                        {isSelected && <span className="ml-auto text-white">✓</span>}
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
                                ? 'border-[var(--primary)] bg-[var(--primary)] text-white shadow-lg'
                                : 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-300'
                            }`}
                    >
                        <span className={`flex items-center justify-center w-6 h-6 rounded border text-xs font-mono transition-colors
                            ${isSelected ? 'border-white/40 text-white' : 'border-zinc-700 text-zinc-500'}`}>
                            {letter}
                        </span>
                        <span className="text-sm font-medium">
                            {option}
                        </span>
                        {isSelected && <span className="ml-auto text-white">✓</span>}
                    </div>
                );
            })}

            <div className="mt-4 text-xs font-medium uppercase tracking-wide text-zinc-500 text-right">
                {maxSelections ? `Máximo ${maxSelections}` : 'Selección múltiple'}
            </div>
        </div>
    );
};
