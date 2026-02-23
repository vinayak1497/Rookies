"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Flame, Building2, MapPin, Phone, Briefcase, ArrowRight, Sparkles } from "lucide-react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/forms/form-input";

const businessTypes = [
    { value: "home-baker", label: "🧁 Home Baker" },
    { value: "kirana-store", label: "🏪 Kirana Store" },
    { value: "instagram-brand", label: "📸 Instagram Brand" },
    { value: "handicraft", label: "🎨 Handicraft / Artisan" },
    { value: "food-delivery", label: "🍕 Food & Delivery" },
    { value: "boutique", label: "👗 Boutique / Fashion" },
    { value: "services", label: "🔧 Services" },
    { value: "other", label: "📦 Other" },
];

export default function BusinessDetailsPage() {
    const { user } = useUser();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedType, setSelectedType] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const businessName = formData.get("businessName") as string;
        const phone = formData.get("phone") as string;
        const location = formData.get("location") as string;

        try {
            // Store business details in Clerk user metadata
            await user?.update({
                unsafeMetadata: {
                    businessName,
                    businessType: selectedType,
                    phone,
                    location,
                    onboardingComplete: true,
                },
            });

            router.push("/dashboard");
        } catch {
            setIsSubmitting(false);
        }
    }

    return (
        <Card className="border-0 shadow-2xl">
            <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg shadow-primary/30">
                    <Sparkles className="h-7 w-7" />
                </div>
                <CardTitle className="text-2xl font-serif">
                    Tell us about your business
                </CardTitle>
                <CardDescription className="text-base">
                    Help us personalize Rookies for you, <span className="font-medium text-foreground">{user?.firstName || "maker"}</span>!
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Business Name */}
                    <FormInput
                        label="Business Name"
                        name="businessName"
                        type="text"
                        placeholder="e.g., Priya's Kitchen"
                        required
                        disabled={isSubmitting}
                    />

                    {/* Business Type */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                            Business Type
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {businessTypes.map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => setSelectedType(type.value)}
                                    disabled={isSubmitting}
                                    className={`rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition-all text-left ${selectedType === type.value
                                            ? "border-primary bg-peach-soft text-primary shadow-sm"
                                            : "border-border bg-white hover:border-primary/30 hover:bg-peach-soft/30"
                                        }`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Phone */}
                    <FormInput
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        hint="For WhatsApp notifications"
                        disabled={isSubmitting}
                    />

                    {/* Location */}
                    <FormInput
                        label="City / Area"
                        name="location"
                        type="text"
                        placeholder="e.g., Koramangala, Bangalore"
                        disabled={isSubmitting}
                    />

                    <Button
                        type="submit"
                        className="w-full gap-2 text-base py-5 rounded-xl shadow-lg shadow-primary/20"
                        disabled={isSubmitting || !selectedType}
                    >
                        {isSubmitting ? (
                            "Setting things up…"
                        ) : (
                            <>
                                Launch My Dashboard
                                <ArrowRight className="h-4 w-4" />
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
