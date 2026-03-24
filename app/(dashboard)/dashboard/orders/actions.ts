"use server";

import { createClient } from "@supabase/supabase-js";
import { OrderStatus } from "@/types/database";

function getSupabaseAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

/**
 * Fetch all orders (Supabase flat `orders` table).
 */
function normalizeStatus(status: string | null): OrderStatus {
    const upper = (status ?? "PLACED").toUpperCase();
    if (
        upper === "PLACED" ||
        upper === "PREPARING" ||
        upper === "READY" ||
        upper === "OUT_FOR_DELIVERY" ||
        upper === "DELIVERED"
    ) {
        return upper as OrderStatus;
    }
    console.warn("[orders] Unknown status fallback", { status, fallback: "PLACED" });
    return "PLACED";
}

export async function getOrdersForUser() {
    try {
        const supabase = getSupabaseAdmin();
        const { data: orders, error } = await supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            return { error: "Failed to load orders", orders: [] };
        }

        // Map to the shape OrdersList expects
        const mapped = (orders ?? []).map((o) => ({
            id: o.id,
            order_number: o.id.slice(0, 8).toUpperCase(),
            status: normalizeStatus(o.status),
            total_amount: Number(o.total_amount) || 0,
            notes: Array.isArray(o.items) ? JSON.stringify(o.items) : o.items,
            source: o.source,
            delivery_date: o.delivery_time || null,
            created_at: o.created_at,
            customer: o.customer_name
                ? { name: o.customer_name, phone: o.customer_phone || null }
                : null,
            payments: [] as { status: string; amount: number }[],
        }));

        return { error: null, orders: mapped };
    } catch (_err) {
        return { error: "Failed to load orders", orders: [] };
    }
}
