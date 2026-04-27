import { getPreferredLanguage } from "@/lib/business";
import { loadMessagesWithFallback } from "./loaders";
import { createTranslator } from "./translate";

export async function getServerTranslations() {
    const preferredLanguage = await getPreferredLanguage();
    const { language, messages, fallbackMessages } = await loadMessagesWithFallback(
        preferredLanguage
    );

    return {
        language,
        messages,
        fallbackMessages,
        t: createTranslator(messages, fallbackMessages),
    };
}
