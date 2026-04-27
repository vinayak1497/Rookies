import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGE_CODES, type LanguageCode } from "./config";
import type { Messages } from "./translate";

export function normalizeLanguage(language?: string | null): LanguageCode {
    if (!language) return DEFAULT_LANGUAGE;
    const normalized = language.toLowerCase();
    if (SUPPORTED_LANGUAGE_CODES.has(normalized as LanguageCode)) {
        return normalized as LanguageCode;
    }
    return DEFAULT_LANGUAGE;
}

export async function loadMessages(language?: string | null): Promise<Messages> {
    const normalized = normalizeLanguage(language);

    try {
        const module = await import(`@/locales/${normalized}.json`);
        return module.default as Messages;
    } catch (error) {
        if (normalized === DEFAULT_LANGUAGE) return {};
        const fallback = await import(`@/locales/${DEFAULT_LANGUAGE}.json`);
        return fallback.default as Messages;
    }
}

export async function loadMessagesWithFallback(language?: string | null) {
    const normalized = normalizeLanguage(language);
    const messages = await loadMessages(normalized);

    if (normalized === DEFAULT_LANGUAGE) {
        return {
            language: normalized,
            messages,
            fallbackMessages: {},
        };
    }

    const fallbackMessages = await loadMessages(DEFAULT_LANGUAGE);
    return {
        language: normalized,
        messages,
        fallbackMessages,
    };
}
