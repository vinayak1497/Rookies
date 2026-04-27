import { redirect } from "next/navigation";
import { getCurrentBusiness, getCurrentDbUser } from "@/lib/business";

export default async function SetupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentDbUser();
    if (!user) {
        redirect("/sign-in");
    }

    const business = await getCurrentBusiness();
    if (business) {
        redirect("/dashboard");
    }

    return children;
}
