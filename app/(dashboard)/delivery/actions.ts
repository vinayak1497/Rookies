"use server";

import { getSupabaseAdmin } from "@/lib/supabase-admin";

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
        const supabase = getSupabaseAdmin();
        const { data, error } = await supabase
            .from("orders")
            .select(
                "id, customer_name, customer_phone, total_amount, status, delivery_started_at, estimated_delivery_time, otp_verified, created_at"
            )
            .in("status", ["READY", "OUT_FOR_DELIVERY"])
            .order("created_at", { ascending: false });

        if (error || !data) {
            console.error("[delivery] supabase fetch error", error);
            return { orders: [], error: "Failed to load delivery orders" };
        }

        const safeToIso = (value: string | null): string | null => {
            if (!value) return null;
            const date = new Date(value);
            return isNaN(date.getTime()) ? null : date.toISOString();
        };

        const orders: DeliveryOrder[] = data.map((row) => ({
            id: row.id,
            orderNumber: row.id.slice(0, 8).toUpperCase(),
            customerName: row.customer_name ?? "Walk-in customer",
            customerPhone: row.customer_phone ?? null,
            totalAmount: Number(row.total_amount) || 0,
            status: normalizeStatus(row.status),
            deliveryStartedAt: safeToIso((row as { delivery_started_at?: string | null }).delivery_started_at ?? null),
            estimatedDeliveryTime: safeToIso((row as { estimated_delivery_time?: string | null }).estimated_delivery_time ?? null),
            otpVerified: Boolean(row.otp_verified),
            createdAt:
                safeToIso((row as { created_at?: string | null }).created_at ?? null) ??
                (row as { created_at?: string | null }).created_at ?? "",
        }));

        return { orders };
    } catch (error) {
        console.error("[delivery] Delivery fetch error", error);
        return { orders: [], error: "Failed to load delivery orders" };
    }
}
