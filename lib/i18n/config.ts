export const DEFAULT_LANGUAGE = "en" as const;

export const LANGUAGE_OPTIONS = [
    { value: "en", label: "English (Default)" },
    { value: "hi", label: "हिंदी (Hindi)" },
    { value: "mr", label: "मराठी (Marathi)" },
    { value: "gu", label: "ગુજરાતી (Gujarati)" },
    { value: "ta", label: "தமிழ் (Tamil)" },
    { value: "kn", label: "ಕನ್ನಡ (Kannada)" },
] as const;

export type LanguageCode = (typeof LANGUAGE_OPTIONS)[number]["value"];

export const SUPPORTED_LANGUAGE_CODES = new Set<LanguageCode>(
    LANGUAGE_OPTIONS.map((option) => option.value)
);

export const LANGUAGE_PROMPT_LABELS: Record<LanguageCode, string> = {
    en: "English",
    hi: "Hindi",
    mr: "Marathi",
    gu: "Gujarati",
    ta: "Tamil",
    kn: "Kannada",
};
