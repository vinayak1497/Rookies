"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { Flame } from "lucide-react";
import { toast } from "sonner";
import { ProgressBar } from "./_components/progress-bar";
import { AiHint } from "./_components/ai-hint";
import { Step1BusinessBasics } from "./_components/step-1";
import { Step2Location } from "./_components/step-2";
import { Step3Channels } from "./_components/step-3";
import { Step4Preferences } from "./_components/step-4";
import { SetupComplete } from "./_components/setup-complete";
import type { Step1Data, Step2Data, Step3Data, Step4Data, BusinessSetupData } from "./schema";

const TOTAL_STEPS = 4;

export default function BusinessSetupPage() {
    const [step, setStep] = useState(1);
    const [isComplete, setIsComplete] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<Partial<BusinessSetupData>>({});

    const handleStep1 = useCallback((data: Step1Data) => {
        setFormData((prev) => ({ ...prev, ...data }));
        setStep(2);
    }, []);

    const handleStep2 = useCallback((data: Step2Data) => {
        setFormData((prev) => ({ ...prev, ...data }));
        setStep(3);
    }, []);

    const handleStep3 = useCallback((data: Step3Data) => {
        setFormData((prev) => ({ ...prev, ...data }));
        setStep(4);
    }, []);

    const handleStep4 = useCallback(async (data: Step4Data) => {
        setIsSubmitting(true);
        const finalData = { ...formData, ...data } as BusinessSetupData;
        setFormData(finalData);

        try {
            // TODO: Save to database via server action
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setIsComplete(true);
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }, [formData]);

    const goBack = useCallback(() => {
        setStep((prev) => Math.max(1, prev - 1));
    }, []);

    if (isComplete) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background p-4">
                <div className="w-full max-w-lg">
                    <SetupComplete businessName={formData.businessName || "Your business"} />
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            <div className="w-full max-w-lg space-y-6">
                <div className="flex items-center justify-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Flame className="h-4 w-4" />
                    </div>
                    <span className="text-lg font-semibold text-foreground">Rookies</span>
                </div>

                <ProgressBar currentStep={step} totalSteps={TOTAL_STEPS} />

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <Step1BusinessBasics
                            key="step-1"
                            defaultValues={formData}
                            onNext={handleStep1}
                        />
                    )}
                    {step === 2 && (
                        <Step2Location
                            key="step-2"
                            defaultValues={formData}
                            onNext={handleStep2}
                            onBack={goBack}
                        />
                    )}
                    {step === 3 && (
                        <Step3Channels
                            key="step-3"
                            defaultValues={formData}
                            onNext={handleStep3}
                            onBack={goBack}
                        />
                    )}
                    {step === 4 && (
                        <Step4Preferences
                            key="step-4"
                            defaultValues={formData}
                            onSubmit={handleStep4}
                            onBack={goBack}
                            isSubmitting={isSubmitting}
                        />
                    )}
                </AnimatePresence>

                <AiHint />
            </div>
        </div>
    );
}
