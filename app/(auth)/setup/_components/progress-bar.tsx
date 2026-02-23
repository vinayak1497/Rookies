"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
    const progress = ((currentStep) / totalSteps) * 100;

    return (
        <div className="w-full space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                    Step {currentStep} of {totalSteps}
                </span>
                <span className="text-xs text-muted-foreground">
                    {Math.round(progress)}% done
                </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
            </div>
        </div>
    );
}
