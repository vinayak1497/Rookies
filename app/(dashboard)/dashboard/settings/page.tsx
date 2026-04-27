import { LanguageCard } from "./_components/language-card";
import { getServerTranslations } from "@/lib/i18n/server";

export const metadata = {
    title: "Settings",
};

export default async function SettingsPage() {
    const { t } = await getServerTranslations();

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-foreground">{t("settings.title")}</h1>
                <p className="text-muted-foreground">{t("settings.subtitle")}</p>
            </div>

            <div className="grid gap-6">
                <LanguageCard />
            </div>
        </div>
    );
}
