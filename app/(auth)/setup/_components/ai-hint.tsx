"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

const hints = [
    "Tip: You can change all of this later from settings.",
    "Most businesses finish this in under 2 minutes.",
    "I'll personalize everything based on what you share.",
    "No wrong answers here — just tell me about your business.",
];

export function AiHint() {
    const [currentHint, setCurrentHint] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const showTimer = setTimeout(() => setIsVisible(true), 2000);
        return () => clearTimeout(showTimer);
    }, []);

    useEffect(() => {
        if (!isVisible) return;
        const interval = setInterval(() => {
            setCurrentHint((prev) => (prev + 1) % hints.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [isVisible]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex items-start gap-2.5 rounded-xl border border-border bg-card px-4 py-3 shadow-sm"
                >
                    <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={currentHint}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-xs text-muted-foreground leading-relaxed"
                        >
                            {hints[currentHint]}
                        </motion.p>
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
