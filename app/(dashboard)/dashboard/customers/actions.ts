"use server";

import { getSupabaseAdmin } from "@/lib/supabase-admin";

export type CustomerStats = {
    id: string;
    name: string;
    phone: string | null;
    email: string | null;
    identityKey: string;
    totalOrders: number;
    totalSpent: number;
    lastOrderDate: string;
};

/**
 * Fetch customers from the `customers` table (source of truth),
 * then compute order stats by joining against orders via identity_key.
 *
 * identity_key = lower(customer_name || '_' || customer_phone) on orders
 * matched against customers.identity_key.
 */
export async function getCustomersForUser() {
    try {
        const supabase = getSupabaseAdmin();

        // ── Step 1: Fetch all customers from the customers table ──
        const { data: customers, error: customersError } = await supabase
            .from("customers")
            .select("id, name, phone, email, identity_key, created_at")
            .order("created_at", { ascending: false });

        if (customersError) {
            console.error("[customers] Error fetching customers:", customersError);
            return { error: "Failed to load customers", customers: [] };
        }

        if (!customers || customers.length === 0) {
            return { error: null, customers: [] };
        }

        // ── Step 2: Fetch all orders for aggregation ──
        const { data: orders, error: ordersError } = await supabase
            .from("orders")
            .select("customer_name, customer_phone, total_amount, created_at");

        if (ordersError) {
            console.error("[customers] Error fetching orders for stats:", ordersError);
            // Still return customers even if orders fail — just with zero stats
        }

        // ── Step 3: Build order stats map keyed by computed identity_key ──
        const orderStatsMap = new Map<
            string,
            { totalOrders: number; totalSpent: number; lastOrderDate: string }
        >();

        for (const o of orders ?? []) {
            const name = (o.customer_name ?? "unknown").trim().toLowerCase().replace(/\s+/g, "_");
            const phone = (o.customer_phone ?? "no_phone").trim();
            const key = `${name}_${phone}`;
            const amount = Number(o.total_amount) || 0;

            const existing = orderStatsMap.get(key);
            if (existing) {
                existing.totalOrders += 1;
                existing.totalSpent += amount;
                if (o.created_at && new Date(o.created_at) > new Date(existing.lastOrderDate)) {
                    existing.lastOrderDate = o.created_at;
                }
            } else {
                orderStatsMap.set(key, {
                    totalOrders: 1,
                    totalSpent: amount,
                    lastOrderDate: o.created_at ?? "",
                });
            }
        }

        // ── Step 4: Merge customer rows with order stats ──
        const result: CustomerStats[] = customers.map((c) => {
            const ik = c.identity_key ?? "";
            const stats = orderStatsMap.get(ik);

            return {
                id: c.id,
                name: c.name ?? "Unknown Customer",
                phone: c.phone ?? null,
                email: c.email ?? null,
                identityKey: ik,
                totalOrders: stats?.totalOrders ?? 0,
                totalSpent: stats?.totalSpent ?? 0,
                lastOrderDate: stats?.lastOrderDate ?? c.created_at ?? "",
            };
        });

        // Sort by most recent order first, then by most orders
        result.sort((a, b) => {
            if (b.totalOrders !== a.totalOrders) return b.totalOrders - a.totalOrders;
            if (!a.lastOrderDate) return 1;
            if (!b.lastOrderDate) return -1;
            return new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime();
        });

        return { error: null, customers: result };
    } catch (err) {
        console.error("[customers] Error:", err);
        return { error: "Failed to load customers", customers: [] };
    }
}
