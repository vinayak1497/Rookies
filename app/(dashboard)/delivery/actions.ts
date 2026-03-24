"use server";

import { prisma } from "@/lib/prisma";

export type DeliveryStatus =
    | "PLACED"
    | "PREPARING"
    | "READY"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED";

export interface DeliveryOrder {
    id: string;
    orderNumber: string;
    customerName: string;
    customerPhone: string | null;
    totalAmount: number;
    status: DeliveryStatus;
    deliveryStartedAt: string | null;
    estimatedDeliveryTime: string | null;
    otpVerified: boolean;
    createdAt: string;
}

function normalizeStatus(status: string | null): DeliveryStatus {
    const upper = (status ?? "PLACED").toUpperCase();
    if (upper === "COMPLETED") return "DELIVERED";
    if (upper === "PENDING") return "PLACED";
    if (
        upper === "PLACED" ||
        upper === "PREPARING" ||
        upper === "READY" ||
        upper === "OUT_FOR_DELIVERY" ||
        upper === "DELIVERED"
    ) {
        return upper;
    }
    console.warn("[delivery] Unknown status fallback", { status, fallback: "PLACED" });
    return "PLACED";
}

export async function getDeliveryOrders(): Promise<{
    orders: DeliveryOrder[];
    error?: string;
}> {
    try {
        const data = await prisma.order.findMany({
            where: {
                status: {
                    in: ["READY", "OUT_FOR_DELIVERY"],
                },
            },
            orderBy: { created_at: "desc" },
            select: {
                id: true,
                customer_name: true,
                customer_phone: true,
                total_amount: true,
                status: true,
                delivery_started_at: true,
                estimated_delivery_time: true,
                otp_verified: true,
                created_at: true,
            },
        });

        const orders: DeliveryOrder[] = data.map((row) => ({
            id: row.id,
            orderNumber: row.id.slice(0, 8).toUpperCase(),
            customerName: row.customer_name ?? "Walk-in customer",
            customerPhone: row.customer_phone ?? null,
            totalAmount: Number(row.total_amount) || 0,
            status: normalizeStatus(row.status),
            deliveryStartedAt: row.delivery_started_at,
            estimatedDeliveryTime: row.estimated_delivery_time,
            otpVerified: Boolean(row.otp_verified),
            createdAt:
                row.created_at instanceof Date
                    ? row.created_at.toISOString()
                    : String(row.created_at ?? ""),
        }));

        return { orders };
    } catch (error) {
        console.error("[delivery] Delivery fetch error", error);
        return { orders: [], error: "Failed to load delivery orders" };
    }
}
