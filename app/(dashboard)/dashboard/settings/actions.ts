"use server";

import { updatePreferredLanguage } from "@/lib/business";

export async function updateLanguagePreference(nextLanguage: string) {
    try {
        const updated = await updatePreferredLanguage(nextLanguage);
        return { success: true, preferredLanguage: updated.preferredLanguage };
    } catch (error) {
        console.error("[settings] Failed to update language", error);
        return { success: false, error: "Unable to update language" };
    }
}
