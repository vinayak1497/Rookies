"use server";

import { getSupabaseAdmin } from "@/lib/supabase-admin";

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
    if (
        upper === "PLACED" ||
        upper === "CONFIRMED" ||
        upper === "PREPARING" ||
        upper === "READY" ||
        upper === "OUT_FOR_DELIVERY" ||
        upper === "DELIVERED"
    ) {
        return upper;
    }
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
                "id, order_number, customer_name, customer_phone, total_amount, status, delivery_started_at, estimated_delivery_time, otp_verified, created_at"
            )
            .in("status", ["READY", "OUT_FOR_DELIVERY", "ready", "out_for_delivery"])
            .order("created_at", { ascending: false });

        if (error) {
            return { orders: [], error: "Failed to load delivery orders" };
        }

        const orders: DeliveryOrder[] = (data ?? []).map((row) => ({
            id: row.id,
            orderNumber: row.order_number ?? row.id.slice(0, 8).toUpperCase(),
            customerName: row.customer_name ?? "Walk-in customer",
            customerPhone: row.customer_phone ?? null,
            totalAmount: Number(row.total_amount) || 0,
            status: normalizeStatus(row.status),
            deliveryStartedAt: row.delivery_started_at,
            estimatedDeliveryTime: row.estimated_delivery_time,
            otpVerified: Boolean(row.otp_verified),
            createdAt: row.created_at,
        }));

        return { orders };
    } catch (_err) {
        return { orders: [], error: "Failed to load delivery orders" };
    }
}
