"use server";

import { prisma } from "@/lib/prisma";

export type DeliveryStatus =
    | "PLACED"
    | "CONFIRMED"
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
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                orderNumber: true,
                customerName: true,
                customerPhone: true,
                totalAmount: true,
                status: true,
                deliveryStartedAt: true,
                estimatedDeliveryTime: true,
                otpVerified: true,
                createdAt: true,
            },
        });

        const orders: DeliveryOrder[] = data.map((row) => ({
            id: row.id,
            orderNumber: row.orderNumber ?? row.id.slice(0, 8).toUpperCase(),
            customerName: row.customerName ?? "Walk-in customer",
            customerPhone: row.customerPhone ?? null,
            totalAmount: Number(row.totalAmount) || 0,
            status: normalizeStatus(row.status),
            deliveryStartedAt: row.deliveryStartedAt,
            estimatedDeliveryTime: row.estimatedDeliveryTime,
            otpVerified: Boolean(row.otpVerified),
            createdAt:
                row.createdAt instanceof Date
                    ? row.createdAt.toISOString()
                    : String(row.createdAt ?? ""),
        }));

        return { orders };
    } catch (error) {
        console.error("[delivery] Delivery fetch error", error);
        return { orders: [], error: "Failed to load delivery orders" };
    }
}
