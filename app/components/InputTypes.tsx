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
                        className={`group cursor-pointer p-3 rounded border transition-all duration-200 flex items-center gap-4
                            ${isSelected
                                ? 'border-[#0445AF] bg-[rgba(4,69,175,0.05)] ring-1 ring-[#0445AF]'
                                : 'border-gray-300 bg-[rgba(0,0,0,0.02)] hover:bg-[rgba(0,0,0,0.05)] hover:border-gray-400'
                            }`}
                    >
                        <span className={`flex items-center justify-center w-8 h-8 rounded border text-sm font-bold transition-colors
                            ${isSelected ? 'border-[#0445AF] bg-[#0445AF] text-white' : 'border-gray-300 text-gray-500 bg-white'}`}>
                            {letter}
                        </span>
                        <span className="text-xl text-[#262627] font-light">
                            {option}
                        </span>
                        {isSelected && <span className="ml-auto text-[#0445AF] text-xl">✓</span>}
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
                        className={`group cursor-pointer p-3 rounded border transition-all duration-200 flex items-center gap-4
                            ${isSelected
                                ? 'border-[#0445AF] bg-[rgba(4,69,175,0.05)] ring-1 ring-[#0445AF]'
                                : 'border-gray-300 bg-[rgba(0,0,0,0.02)] hover:bg-[rgba(0,0,0,0.05)] hover:border-gray-400'
                            }`}
                    >
                        <span className={`flex items-center justify-center w-8 h-8 rounded border text-sm font-bold transition-colors
                             ${isSelected ? 'border-[#0445AF] bg-[#0445AF] text-white' : 'border-gray-300 text-gray-500 bg-white'}`}>
                            {letter}
                        </span>
                        <span className="text-xl text-[#262627] font-light">
                            {option}
                        </span>
                        {isSelected && <span className="ml-auto text-[#0445AF] text-xl">✓</span>}
                    </div>
                );
            })}

            <div className="mt-4 text-xs font-medium uppercase tracking-wide text-gray-400 text-right">
                {maxSelections ? `Máximo ${maxSelections}` : 'Selección múltiple'}
            </div>
        </div>
    );
};
