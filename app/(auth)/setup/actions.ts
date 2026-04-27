"use server";

import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/firebase-admin";
import { normalizeLanguage } from "@/lib/i18n/loaders";
import type { BusinessSetupData } from "./schema";

function slugify(value: string) {
    const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    return slug || "rookies-business";
}

async function generateUniqueSlug(base: string) {
    let slug = base;
    let suffix = 1;

    while (await prisma.business.findUnique({ where: { slug } })) {
        slug = `${base}-${suffix}`;
        suffix += 1;
    }

    return slug;
}

export async function createBusiness(data: BusinessSetupData) {
    const authUser = await getAuthUser();
    if (!authUser) {
        throw new Error("Authentication required");
    }

    const user = await prisma.user.upsert({
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

    const existing = await prisma.businessMember.findFirst({
        where: { userId: user.id, isActive: true },
        include: { business: true },
    });

    if (existing?.business) {
        return existing.business;
    }

    const baseSlug = slugify(data.businessName);
    const slug = await generateUniqueSlug(baseSlug);
    const preferredLanguage = normalizeLanguage(data.language);

    const business = await prisma.business.create({
        data: {
            name: data.businessName,
            slug,
            type: data.businessType,
            city: data.city,
            address: data.locality || null,
            phone: data.whatsappNumber || null,
            preferredLanguage,
            onboardingData: data,
        },
    });

    await prisma.businessMember.create({
        data: {
            userId: user.id,
            businessId: business.id,
            role: "owner",
        },
    });

    return business;
}
