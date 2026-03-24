"use server";

import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@/types/database";

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
        const orders = await prisma.order.findMany({
            where: {
                status: {
                    in: ["PLACED", "PREPARING", "READY", "OUT_FOR_DELIVERY", "DELIVERED"],
                },
            },
            orderBy: { created_at: "desc" },
            select: {
                id: true,
                customer_name: true,
                customer_phone: true,
                items: true,
                total_amount: true,
                status: true,
                delivery_time: true,
                source: true,
                created_at: true,
                note: true,
            },
        });

        const mapped = orders.map((o) => ({
            id: o.id,
            order_number: o.id.slice(0, 8).toUpperCase(),
            status: normalizeStatus(o.status as string),
            total_amount: Number(o.total_amount) || 0,
            notes: o.note ?? (Array.isArray(o.items) ? JSON.stringify(o.items) : (o.items as unknown as string | null)),
            source: o.source,
            delivery_date: o.delivery_time ? new Date(o.delivery_time).toISOString() : null,
            created_at: o.created_at instanceof Date ? o.created_at.toISOString() : String(o.created_at ?? ""),
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
