"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step2Schema, type Step2Data } from "../schema";
import { StepWrapper } from "./step-wrapper";
import { FormInput } from "@/components/forms/form-input";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Step2Props {
    defaultValues: Partial<Step2Data>;
    onNext: (data: Step2Data) => void;
    onBack: () => void;
}

export function Step2Location({ defaultValues, onNext, onBack }: Step2Props) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Step2Data>({
        resolver: zodResolver(step2Schema),
        defaultValues: {
            city: defaultValues.city || "",
            locality: defaultValues.locality || "",
            deliveryRadius: defaultValues.deliveryRadius || "",
            workingHoursStart: defaultValues.workingHoursStart || "09:00",
            workingHoursEnd: defaultValues.workingHoursEnd || "21:00",
        },
    });

    return (
        <StepWrapper
            title="Where do you work from?"
            subtitle="This helps me plan deliveries and busy days."
        >
            <form onSubmit={handleSubmit(onNext)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput
                        label="City"
                        placeholder="e.g. Mumbai, Bangalore"
                        error={errors.city?.message}
                        {...register("city")}
                    />
                    <FormInput
                        label="Area / Locality"
                        placeholder="e.g. Koramangala, Andheri"
                        hint="Optional"
                        error={errors.locality?.message}
                        {...register("locality")}
                    />
                </div>

                <FormInput
                    label="How far can you deliver?"
                    placeholder="e.g. 5 km, Entire city, No delivery"
                    hint="Optional"
                    error={errors.deliveryRadius?.message}
                    {...register("deliveryRadius")}
                />

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                        What are your working hours?
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs text-muted-foreground">Start</label>
                            <input
                                type="time"
                                className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                                {...register("workingHoursStart")}
                            />
                            {errors.workingHoursStart && (
                                <p className="text-xs text-destructive">{errors.workingHoursStart.message}</p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs text-muted-foreground">End</label>
                            <input
                                type="time"
                                className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                                {...register("workingHoursEnd")}
                            />
                            {errors.workingHoursEnd && (
                                <p className="text-xs text-destructive">{errors.workingHoursEnd.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={onBack} size="lg" className="w-auto">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button type="submit" className="flex-1" size="lg">
                        Continue
                    </Button>
                </div>
            </form>
        </StepWrapper>
    );
}
