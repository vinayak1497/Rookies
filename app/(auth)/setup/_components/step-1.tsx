"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step1Schema, type Step1Data, businessTypes } from "../schema";
import { StepWrapper } from "./step-wrapper";
import { SelectableCard } from "./selectable-chip";
import { FormInput } from "@/components/forms/form-input";
import { Button } from "@/components/ui/button";

interface Step1Props {
    defaultValues: Partial<Step1Data>;
    onNext: (data: Step1Data) => void;
}

export function Step1BusinessBasics({ defaultValues, onNext }: Step1Props) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<Step1Data>({
        resolver: zodResolver(step1Schema),
        defaultValues: {
            businessName: defaultValues.businessName || "",
            businessType: defaultValues.businessType || "",
            whatYouSell: defaultValues.whatYouSell || "",
        },
    });

    const selectedType = watch("businessType");

    return (
        <StepWrapper
            title="Tell me about your business"
            subtitle="You can change this anytime."
        >
            <form onSubmit={handleSubmit(onNext)} className="space-y-6">
                <FormInput
                    label="What's your business called?"
                    placeholder="e.g. Priya's Kitchen, Sharma Kirana"
                    error={errors.businessName?.message}
                    {...register("businessName")}
                />

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                        What kind of business is it?
                    </label>
                    <div className="grid grid-cols-3 gap-2.5">
                        {businessTypes.map((type) => (
                            <SelectableCard
                                key={type.value}
                                label={type.label}
                                icon={type.icon}
                                selected={selectedType === type.value}
                                onSelect={() => setValue("businessType", type.value, { shouldValidate: true })}
                            />
                        ))}
                    </div>
                    {errors.businessType && (
                        <p className="text-xs text-destructive">{errors.businessType.message}</p>
                    )}
                </div>

                <FormInput
                    label="What do you sell or offer?"
                    placeholder="e.g. Cakes and cookies, Groceries, Tailoring"
                    error={errors.whatYouSell?.message}
                    {...register("whatYouSell")}
                />

                <Button type="submit" className="w-full" size="lg">
                    Continue
                </Button>
            </form>
        </StepWrapper>
    );
}
