"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Messages } from "@/lib/i18n/translate";
import { createTranslator } from "@/lib/i18n/translate";
import { loadMessagesWithFallback, normalizeLanguage } from "@/lib/i18n/loaders";
import type { LanguageCode } from "@/lib/i18n/config";

interface LanguageContextValue {
    language: LanguageCode;
    messages: Messages;
    fallbackMessages: Messages;
    setLanguage: (next: string) => Promise<void>;
    t: (key: string, values?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

interface LanguageProviderProps {
    initialLanguage: string;
    initialMessages: Messages;
    initialFallbackMessages?: Messages;
    children: ReactNode;
}

export function LanguageProvider({
    initialLanguage,
    initialMessages,
    initialFallbackMessages,
    children,
}: LanguageProviderProps) {
    const [language, setLanguageState] = useState<LanguageCode>(
        normalizeLanguage(initialLanguage)
    );
    const [messages, setMessages] = useState<Messages>(initialMessages);
    const [fallbackMessages, setFallbackMessages] = useState<Messages>(
        initialFallbackMessages ?? {}
    );

    const t = useMemo(
        () => createTranslator(messages, fallbackMessages),
        [messages, fallbackMessages]
    );

    const setLanguage = useCallback(
        async (next: string) => {
            const normalized = normalizeLanguage(next);
            if (normalized === language) return;

            const { messages: nextMessages, fallbackMessages: nextFallback } =
                await loadMessagesWithFallback(normalized);

            setLanguageState(normalized);
            setMessages(nextMessages);
            setFallbackMessages(nextFallback);
        },
        [language]
    );

    const value = useMemo(
        () => ({ language, messages, fallbackMessages, setLanguage, t }),
        [language, messages, fallbackMessages, setLanguage, t]
    );

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within LanguageProvider");
    }
    return context;
}

export function useTranslations() {
    return useLanguage().t;
}
