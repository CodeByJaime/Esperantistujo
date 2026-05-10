// components/ui/Select.tsx
"use client";
import * as RadixSelect from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";

interface Option {
    value: string;
    label: string;
}

interface SelectProps {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export function Select({ value, onChange, options, placeholder, className, disabled }: SelectProps) {
    const hasOptions = options.length > 0;
    const displayPlaceholder = disabled ? "No hay canales disponibles" : placeholder;

    return (
        <RadixSelect.Root value={value} onValueChange={onChange} disabled={disabled}>
            <RadixSelect.Trigger
                className={`w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm font-sans-dm flex items-center justify-between focus:outline-none focus:border-esperanto-verda transition-all ${disabled ? "cursor-not-allowed opacity-50" : ""} ${className ?? ""}`}
            >
                <RadixSelect.Value placeholder={displayPlaceholder} />
                <RadixSelect.Icon>
                    <ChevronDown className="w-4 h-4 text-white/50" />
                </RadixSelect.Icon>
            </RadixSelect.Trigger>

            <RadixSelect.Portal>
                <RadixSelect.Content className="bg-[#1a1a1a] border border-white/20 rounded-lg overflow-hidden shadow-xl z-50">
                    <RadixSelect.Viewport>
                        {hasOptions ? (
                            options.map((opt) => (
                                <RadixSelect.Item
                                    key={opt.value}
                                    value={opt.value}
                                    className="px-3 py-2 text-sm font-sans-dm text-white/70 hover:bg-white/10 hover:text-white data-[state=checked]:bg-esperanto-verda/20 data-[state=checked]:text-esperanto-verda cursor-pointer focus:outline-none transition-all flex items-center justify-between gap-2"
                                >
                                    <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                                    <RadixSelect.ItemIndicator>
                                        <Check className="w-3 h-3" />
                                    </RadixSelect.ItemIndicator>
                                </RadixSelect.Item>
                            ))
                        ) : (
                            <RadixSelect.Item
                                value="__disabled__"
                                disabled
                                className="px-3 py-2 text-sm font-sans-dm text-white/30 cursor-not-allowed"
                            >
                                <RadixSelect.ItemText>No hay opciones disponibles</RadixSelect.ItemText>
                            </RadixSelect.Item>
                        )}
                    </RadixSelect.Viewport>
                </RadixSelect.Content>
            </RadixSelect.Portal>
        </RadixSelect.Root>
    );
}