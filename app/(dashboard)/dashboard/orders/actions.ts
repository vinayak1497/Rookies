"use server";

import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

/**
 * Fetch all orders (Supabase flat `orders` table).
 */
export async function getOrdersForUser() {
    try {
        const supabase = getSupabaseAdmin();
        const { data: orders, error } = await supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("[orders] Supabase error:", error);
            return { error: "Failed to load orders", orders: [] };
        }

        // Map to the shape OrdersList expects
        const mapped = (orders ?? []).map((o) => ({
            id: o.id,
            order_number: o.id.slice(0, 8).toUpperCase(),
            status: o.status || "pending",
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
    } catch (err) {
        console.error("[orders] Error:", err);
        return { error: "Failed to load orders", orders: [] };
    }
}

/**
 * Mark an order as "completed" (delivered).
 */
export async function markOrderDelivered(orderId: string) {
    try {
        const supabase = getSupabaseAdmin();
        const { error } = await supabase
            .from("orders")
            .update({ status: "completed" })
            .eq("id", orderId);

        if (error) {
            console.error("[orders] Update error:", error);
            return { error: "Failed to update order" };
        }

        return { success: true };
    } catch (err) {
        console.error("[orders] Error:", err);
        return { error: "Failed to update order" };
    }
}
