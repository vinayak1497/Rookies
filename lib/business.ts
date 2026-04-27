import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/firebase-admin";
import { DEFAULT_LANGUAGE } from "@/lib/i18n/config";
import { normalizeLanguage } from "@/lib/i18n/loaders";

export async function getCurrentDbUser() {
    const authUser = await getAuthUser();
    if (!authUser) return null;

    return prisma.user.upsert({
        where: { firebaseUid: authUser.uid },
        update: {
            email: authUser.email || null,
            name: authUser.name || null,
            phone: authUser.phone_number || null,
        },
        create: {
            firebaseUid: authUser.uid,
            email: authUser.email || null,
            name: authUser.name || authUser.email?.split("@")[0] || null,
            phone: authUser.phone_number || null,
        },
    });
}

export async function getCurrentUser() {
    return getCurrentDbUser();
}

export async function getCurrentBusinessMember() {
    const user = await getCurrentDbUser();
    if (!user) return null;

    return prisma.businessMember.findFirst({
        where: { userId: user.id, isActive: true },
        orderBy: { joinedAt: "asc" },
    });
}

export async function getCurrentBusiness() {
    const member = await getCurrentBusinessMember();
    if (!member) return null;

    return prisma.business.findUnique({
        where: { id: member.businessId },
        select: {
            id: true,
            name: true,
            slug: true,
            preferredLanguage: true,
        },
    });
}

export async function getPreferredLanguage() {
    const business = await getCurrentBusiness();
    const preferred = business?.preferredLanguage ?? DEFAULT_LANGUAGE;
    return normalizeLanguage(preferred);
}

export async function updatePreferredLanguage(nextLanguage: string) {
    const member = await getCurrentBusinessMember();
    if (!member) {
        throw new Error("No active business found for user");
    }

    const normalized = normalizeLanguage(nextLanguage);

    return prisma.business.update({
        where: { id: member.businessId },
        data: { preferredLanguage: normalized },
        select: { preferredLanguage: true },
    });
}
