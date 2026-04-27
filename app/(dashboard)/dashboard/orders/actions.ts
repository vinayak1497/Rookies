"use server";

import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { OrderStatus } from "@/types/database";

/**
 * Fetch all orders (Supabase flat `orders` table), excluding out-for-delivery.
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
        const baseSelect =
            "id, customer_name, customer_phone, items, total_amount, status, delivery_time, source, created_at, note";
        const invoiceSelect = `${baseSelect}, invoice_url, invoice_created_at`;

        let { data: orders, error } = await supabase
            .from("orders")
            .select(invoiceSelect)
            .or("status.is.null,status.not.ilike.%out%for%delivery%")
            .order("created_at", { ascending: false });

        if (error?.code === "42703") {
            console.warn("[orders] Missing invoice columns, retrying without them", error);
            const fallback = await supabase
                .from("orders")
                .select(baseSelect)
                .or("status.is.null,status.not.ilike.%out%for%delivery%")
                .order("created_at", { ascending: false });
            orders = fallback.data?.map((o) => ({
                ...o,
                invoice_url: null as string | null,
                invoice_created_at: null as string | null,
            })) ?? null;
            error = fallback.error;
        }

        if (error || !orders) {
            console.error("[orders] supabase fetch error", error);
            return { error: "Failed to load orders", orders: [] };
        }

        const safeToIso = (value: string | null): string | null => {
            if (!value) return null;
            const date = new Date(value);
            return isNaN(date.getTime()) ? null : date.toISOString();
        };

        const mapped = orders.map((o) => ({
            id: o.id,
            order_number: o.id.slice(0, 8).toUpperCase(),
            status: normalizeStatus(o.status as string),
            total_amount: Number(o.total_amount) || 0,
            notes: o.note ?? (Array.isArray(o.items) ? JSON.stringify(o.items) : (o.items as unknown as string | null)),
            source: o.source,
            delivery_date: safeToIso((o as { delivery_time?: string | null }).delivery_time ?? null),
            invoice_url: (o as { invoice_url?: string | null }).invoice_url ?? null,
            invoice_created_at: safeToIso((o as { invoice_created_at?: string | null }).invoice_created_at ?? null),
            created_at: safeToIso((o as { created_at?: string | null }).created_at ?? null) ??
                (o as { created_at?: string | null }).created_at ?? "",
            customer_name: o.customer_name ?? null,
            customer_phone: o.customer_phone ?? null,
            payments: [] as { status: string; amount: number }[],
        }));

        return { error: null, orders: mapped };
    } catch (err) {
        console.error("[orders] load error", err);
        return { error: "Failed to load orders", orders: [] };
    }
}
