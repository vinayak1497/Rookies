import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const schema = z.object({
    orderId: z.string().min(1),
    nextStatus: z.enum([
        "PLACED",
        "CONFIRMED",
        "PREPARING",
        "READY",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
    ]),
});

const transitions: Record<string, string> = {
    PLACED: "CONFIRMED",
    CONFIRMED: "PREPARING",
    PREPARING: "READY",
    READY: "OUT_FOR_DELIVERY",
    OUT_FOR_DELIVERY: "DELIVERED",
};

function buildError(message: string, status = 400) {
    return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
    const body = await request.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
        return buildError("Invalid request payload", 400);
    }

    const supabase = getSupabaseAdmin();
    const { orderId, nextStatus } = parsed.data;

    const { data: order, error: fetchError } = await supabase
        .from("orders")
        .select("id, status")
        .eq("id", orderId)
        .single();

    if (fetchError || !order) {
        return buildError("Order not found", 404);
    }

    const current = (order.status as string | null)?.toUpperCase() ?? "PLACED";
    const allowedNext = transitions[current];

    if (!allowedNext || allowedNext !== nextStatus) {
        return buildError("Invalid status transition", 400);
    }

    const { error: updateError } = await supabase
        .from("orders")
        .update({ status: nextStatus })
        .eq("id", orderId);

    if (updateError) {
        return buildError("Failed to update order", 500);
    }

    return NextResponse.json({ success: true });
}
