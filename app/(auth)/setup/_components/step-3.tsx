"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step3Schema, type Step3Data, paymentMethods } from "../schema";
import { StepWrapper } from "./step-wrapper";
import { SelectableChip } from "./selectable-chip";
import { FormInput } from "@/components/forms/form-input";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Step3Props {
    defaultValues: Partial<Step3Data>;
    onNext: (data: Step3Data) => void;
    onBack: () => void;
}

export function Step3Channels({ defaultValues, onNext, onBack }: Step3Props) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<Step3Data>({
        resolver: zodResolver(step3Schema),
        defaultValues: {
            whatsappNumber: defaultValues.whatsappNumber || "",
            instagramHandle: defaultValues.instagramHandle || "",
            paymentMethods: defaultValues.paymentMethods || [],
        },
    });

    const selectedPayments = watch("paymentMethods") || [];

    function togglePayment(value: string) {
        const current = selectedPayments;
        const updated = current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value];
        setValue("paymentMethods", updated, { shouldValidate: true });
    }

    return (
        <StepWrapper
            title="How do customers reach you?"
            subtitle="I'll help manage messages and payments."
        >
            <form onSubmit={handleSubmit(onNext)} className="space-y-6">
                <FormInput
                    label="WhatsApp Business Number"
                    placeholder="+91 98765 43210"
                    type="tel"
                    error={errors.whatsappNumber?.message}
                    {...register("whatsappNumber")}
                />

                <FormInput
                    label="Instagram Handle"
                    placeholder="@yourbusiness"
                    hint="Optional"
                    error={errors.instagramHandle?.message}
                    {...register("instagramHandle")}
                />

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                        How do customers pay you?
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {paymentMethods.map((method) => (
                            <SelectableChip
                                key={method.value}
                                label={method.label}
                                selected={selectedPayments.includes(method.value)}
                                onToggle={() => togglePayment(method.value)}
                            />
                        ))}
                    </div>
                    {errors.paymentMethods && (
                        <p className="text-xs text-destructive">{errors.paymentMethods.message}</p>
                    )}
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
