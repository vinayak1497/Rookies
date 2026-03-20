"use server";

import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

export type CustomerStats = {
    id: string;
    name: string;
    phone: string | null;
    totalOrders: number;
    totalSpent: number;
    lastOrderDate: string;
};

export async function getCustomersForUser() {
    try {
        const supabase = getSupabaseAdmin();
        const { data: orders, error } = await supabase
            .from("orders")
            .select("customer_name, customer_phone, total_amount, created_at")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("[customers] Supabase error:", error);
            return { error: "Failed to load customers", customers: [] };
        }

        // Aggregate orders by customer phone (or name if phone is missing)
        const customerMap = new Map<string, CustomerStats>();

        for (const o of orders ?? []) {
            // Identifier is preference: phone, then name. Fallback "unknown"
            const identifier = o.customer_phone || o.customer_name || "Unknown Customer";
            
            const existing = customerMap.get(identifier);
            const amount = Number(o.total_amount) || 0;

            if (existing) {
                existing.totalOrders += 1;
                existing.totalSpent += amount;
                // Since orders are sorted by newest first, the first one encountered is the latest
                if (new Date(o.created_at) > new Date(existing.lastOrderDate)) {
                    existing.lastOrderDate = o.created_at;
                }
                if (!existing.name && o.customer_name) {
                     existing.name = o.customer_name;
                }
            } else {
                customerMap.set(identifier, {
                    id: identifier,
                    name: o.customer_name || "Unknown Customer",
                    phone: o.customer_phone || null,
                    totalOrders: 1,
                    totalSpent: amount,
                    lastOrderDate: o.created_at,
                });
            }
        }

        const customers = Array.from(customerMap.values())
             // Sort by totalOrders desc
             .sort((a, b) => b.totalOrders - a.totalOrders);

        return { error: null, customers };
    } catch (err) {
        console.error("[customers] Error:", err);
        return { error: "Failed to load customers", customers: [] };
    }
}
