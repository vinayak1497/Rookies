"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StepWrapperProps {
    title: string;
    subtitle: string;
    children: React.ReactNode;
    className?: string;
}

export function StepWrapper({ title, subtitle, children, className }: StepWrapperProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={cn("w-full", className)}
        >
            <div className="rounded-2xl border border-border bg-card p-8 sm:p-10 shadow-sm">
                <div className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
                        {title}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {subtitle}
                    </p>
                </div>
                {children}
            </div>
        </motion.div>
    );
}
