"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/components/i18n/language-provider";
import { LANGUAGE_OPTIONS } from "@/lib/i18n/config";
import { updateLanguagePreference } from "../actions";

export function LanguageCard() {
    const { language, setLanguage, t } = useLanguage();
    const [value, setValue] = useState(language);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setValue(language);
    }, [language]);

    async function handleChange(event: ChangeEvent<HTMLSelectElement>) {
        const next = event.target.value;
        if (!next || next === language) return;

        const previous = language;
        setValue(next);
        await setLanguage(next);

        setSaving(true);
        try {
            const result = await updateLanguagePreference(next);
            if (!result.success) {
                throw new Error(result.error || "Update failed");
            }
            toast.success(t("settings.language.success"));
        } catch {
            await setLanguage(previous);
            setValue(previous);
            toast.error(t("settings.language.error"));
        } finally {
            setSaving(false);
        }
    }

    return (
        <Card className="shadow-sm border-border/70">
            <CardHeader>
                <CardTitle className="text-lg">{t("settings.language.title")}</CardTitle>
                <CardDescription>{t("settings.language.helper")}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                        {t("settings.language.label")}
                    </label>
                    <select
                        value={value}
                        onChange={handleChange}
                        disabled={saving}
                        aria-busy={saving}
                        className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                    >
                        {LANGUAGE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </CardContent>
        </Card>
    );
}
