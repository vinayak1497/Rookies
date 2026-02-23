import { z } from "zod";

export const businessTypes = [
    { value: "food", label: "Food & Bakery", icon: "🧁" },
    { value: "retail", label: "Retail & Kirana", icon: "🛒" },
    { value: "services", label: "Services", icon: "✂️" },
    { value: "fashion", label: "Fashion & Boutique", icon: "👗" },
    { value: "freelance", label: "Freelance", icon: "💻" },
    { value: "other", label: "Something else", icon: "✨" },
] as const;

export const paymentMethods = [
    { value: "upi", label: "UPI" },
    { value: "cash", label: "Cash" },
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "udhaar", label: "Udhaar / Credit" },
] as const;

export const brandPersonalities = [
    { value: "friendly", label: "Friendly", icon: "😊" },
    { value: "premium", label: "Premium", icon: "✨" },
    { value: "playful", label: "Playful", icon: "🎉" },
    { value: "traditional", label: "Traditional", icon: "🪔" },
] as const;

export const peakSeasons = [
    { value: "diwali", label: "Diwali" },
    { value: "holi", label: "Holi" },
    { value: "eid", label: "Eid" },
    { value: "christmas", label: "Christmas" },
    { value: "navratri", label: "Navratri" },
    { value: "rakhi", label: "Raksha Bandhan" },
    { value: "valentines", label: "Valentine's Day" },
    { value: "new_year", label: "New Year" },
    { value: "wedding_season", label: "Wedding Season" },
    { value: "onam", label: "Onam" },
] as const;

export const languages = [
    { value: "english", label: "English" },
    { value: "hindi", label: "Hindi" },
    { value: "hinglish", label: "Hinglish" },
    { value: "tamil", label: "Tamil" },
    { value: "telugu", label: "Telugu" },
    { value: "kannada", label: "Kannada" },
    { value: "malayalam", label: "Malayalam" },
    { value: "marathi", label: "Marathi" },
    { value: "bengali", label: "Bengali" },
    { value: "gujarati", label: "Gujarati" },
] as const;

export const refundPreferences = [
    { value: "full_refund", label: "Full refund, no questions" },
    { value: "case_by_case", label: "Case by case" },
    { value: "exchange_only", label: "Exchange only" },
    { value: "no_refunds", label: "No refunds" },
] as const;

export const step1Schema = z.object({
    businessName: z.string().min(2, "Your business needs a name"),
    businessType: z.string().min(1, "Pick what fits best"),
    whatYouSell: z.string().min(2, "Just a quick description"),
});

export const step2Schema = z.object({
    city: z.string().min(2, "Which city are you in?"),
    locality: z.string().optional(),
    deliveryRadius: z.string().optional(),
    workingHoursStart: z.string().min(1, "When do you start your day?"),
    workingHoursEnd: z.string().min(1, "When do you wrap up?"),
});

export const step3Schema = z.object({
    whatsappNumber: z.string().min(10, "Enter a valid WhatsApp number"),
    instagramHandle: z.string().optional(),
    paymentMethods: z.array(z.string()).min(1, "Pick at least one"),
});

export const step4Schema = z.object({
    language: z.string().min(1, "Pick a language"),
    brandPersonality: z.array(z.string()).min(1, "Pick at least one"),
    peakSeasons: z.array(z.string()).optional(),
    refundPreference: z.string().min(1, "Choose a preference"),
});

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type Step4Data = z.infer<typeof step4Schema>;

export type BusinessSetupData = Step1Data & Step2Data & Step3Data & Step4Data;
