"use server";

import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Fetch all orders for the current user's business.
 * Uses Clerk auth to identify the user, then queries Supabase
 * via the admin client (RLS doesn't know about Clerk users).
 */
export async function getOrdersForUser() {
    const { userId } = await auth();
    if (!userId) return { error: "Not authenticated", orders: [] };

    const supabase = await createClient();

    // 1. Find the user's business via business_members
    const { data: membership, error: memberError } = await supabase
        .from("business_members")
        .select("business_id")
        .eq("user_id", userId)
        .eq("is_active", true)
        .limit(1)
        .single();

    if (memberError || !membership) {
        return { error: null, orders: [] };
    }

    // 2. Fetch orders with customer data, sorted newest first
    const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select(`
            *,
            customer:customers(name, phone),
            payments(status, amount)
        `)
        .eq("business_id", membership.business_id)
        .order("created_at", { ascending: false });

    if (ordersError) {
        console.error("[orders] Fetch error:", ordersError.message);
        return { error: ordersError.message, orders: [] };
    }

    return { error: null, orders: orders ?? [] };
}

/**
 * Mark an order as "completed" (delivered).
 */
export async function markOrderDelivered(orderId: string) {
    const { userId } = await auth();
    if (!userId) return { error: "Not authenticated" };

    const supabase = await createClient();

    // Verify user owns this order's business
    const { data: order } = await supabase
        .from("orders")
        .select("business_id")
        .eq("id", orderId)
        .single();

    if (!order) return { error: "Order not found" };

    const { data: membership } = await supabase
        .from("business_members")
        .select("id")
        .eq("business_id", order.business_id)
        .eq("user_id", userId)
        .eq("is_active", true)
        .single();

    if (!membership) return { error: "Unauthorized" };

    // Update the order status
    const { error } = await supabase
        .from("orders")
        .update({ status: "completed" })
        .eq("id", orderId);

    if (error) return { error: error.message };
    return { success: true };
}
