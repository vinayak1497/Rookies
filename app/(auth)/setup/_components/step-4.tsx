"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    step4Schema,
    type Step4Data,
    languages,
    brandPersonalities,
    peakSeasons,
    refundPreferences,
} from "../schema";
import { StepWrapper } from "./step-wrapper";
import { SelectableChip } from "./selectable-chip";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Step4Props {
    defaultValues: Partial<Step4Data>;
    onSubmit: (data: Step4Data) => void;
    onBack: () => void;
    isSubmitting: boolean;
}

export function Step4Preferences({ defaultValues, onSubmit, onBack, isSubmitting }: Step4Props) {
    const {
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<Step4Data>({
        resolver: zodResolver(step4Schema),
        defaultValues: {
            language: defaultValues.language || "",
            brandPersonality: defaultValues.brandPersonality || [],
            peakSeasons: defaultValues.peakSeasons || [],
            refundPreference: defaultValues.refundPreference || "",
        },
    });

    const selectedLang = watch("language");
    const selectedPersonality = watch("brandPersonality") || [];
    const selectedSeasons = watch("peakSeasons") || [];
    const selectedRefund = watch("refundPreference");

    function togglePersonality(value: string) {
        const updated = selectedPersonality.includes(value)
            ? selectedPersonality.filter((v) => v !== value)
            : [...selectedPersonality, value];
        setValue("brandPersonality", updated, { shouldValidate: true });
    }

    function toggleSeason(value: string) {
        const updated = selectedSeasons.includes(value)
            ? selectedSeasons.filter((v) => v !== value)
            : [...selectedSeasons, value];
        setValue("peakSeasons", updated, { shouldValidate: true });
    }

    return (
        <StepWrapper
            title="Your style & preferences"
            subtitle="This helps me talk like you and plan ahead."
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                        What language do you prefer?
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {languages.map((lang) => (
                            <SelectableChip
                                key={lang.value}
                                label={lang.label}
                                selected={selectedLang === lang.value}
                                onToggle={() => setValue("language", lang.value, { shouldValidate: true })}
                            />
                        ))}
                    </div>
                    {errors.language && (
                        <p className="text-xs text-destructive">{errors.language.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                        How would you describe your brand?
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {brandPersonalities.map((p) => (
                            <SelectableChip
                                key={p.value}
                                label={p.label}
                                icon={p.icon}
                                selected={selectedPersonality.includes(p.value)}
                                onToggle={() => togglePersonality(p.value)}
                            />
                        ))}
                    </div>
                    {errors.brandPersonality && (
                        <p className="text-xs text-destructive">{errors.brandPersonality.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                        When is your busiest time?
                    </label>
                    <p className="text-xs text-muted-foreground">Pick all that apply — optional</p>
                    <div className="flex flex-wrap gap-2">
                        {peakSeasons.map((season) => (
                            <SelectableChip
                                key={season.value}
                                label={season.label}
                                selected={selectedSeasons.includes(season.value)}
                                onToggle={() => toggleSeason(season.value)}
                            />
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                        How do you handle refunds?
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {refundPreferences.map((pref) => (
                            <SelectableChip
                                key={pref.value}
                                label={pref.label}
                                selected={selectedRefund === pref.value}
                                onToggle={() => setValue("refundPreference", pref.value, { shouldValidate: true })}
                            />
                        ))}
                    </div>
                    {errors.refundPreference && (
                        <p className="text-xs text-destructive">{errors.refundPreference.message}</p>
                    )}
                </div>

                <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={onBack} size="lg" className="w-auto" disabled={isSubmitting}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button type="submit" className="flex-1" size="lg" isLoading={isSubmitting}>
                        Set Up My Business
                    </Button>
                </div>
            </form>
        </StepWrapper>
    );
}
