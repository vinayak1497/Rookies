"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SelectableChipProps {
    label: string;
    icon?: string;
    selected: boolean;
    onToggle: () => void;
    disabled?: boolean;
}

export function SelectableChip({ label, icon, selected, onToggle, disabled }: SelectableChipProps) {
    return (
        <button
            type="button"
            onClick={onToggle}
            disabled={disabled}
            className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer select-none",
                selected
                    ? "border-primary bg-primary/8 text-foreground ring-1 ring-primary/20"
                    : "border-border bg-white text-muted-foreground hover:border-primary/30 hover:text-foreground",
                disabled && "opacity-50 cursor-not-allowed"
            )}
        >
            {icon && <span className="text-base">{icon}</span>}
            {label}
        </button>
    );
}

interface SelectableCardProps {
    label: string;
    icon: string;
    selected: boolean;
    onSelect: () => void;
    disabled?: boolean;
}

export function SelectableCard({ label, icon, selected, onSelect, disabled }: SelectableCardProps) {
    return (
        <button
            type="button"
            onClick={onSelect}
            disabled={disabled}
            className={cn(
                "flex flex-col items-center gap-2 rounded-xl border p-4 sm:p-5 transition-all duration-200 cursor-pointer select-none",
                selected
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                    : "border-border bg-white hover:border-primary/30",
                disabled && "opacity-50 cursor-not-allowed"
            )}
        >
            <span className="text-2xl">{icon}</span>
            <span className={cn(
                "text-sm font-medium",
                selected ? "text-foreground" : "text-muted-foreground"
            )}>
                {label}
            </span>
        </button>
    );
}
