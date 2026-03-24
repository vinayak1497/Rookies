import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const schema = z.object({
    orderId: z.string().min(1),
});

function buildError(message: string, status = 400) {
    return NextResponse.json({ success: false, error: message }, { status });
}

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => null);
        const parsed = schema.safeParse(body);

        if (!parsed.success) {
            return buildError("Invalid request payload", 400);
        }

        const { orderId } = parsed.data;
        const supabase = getSupabaseAdmin();

        const { data: order, error: fetchError } = await supabase
            .from("orders")
            .select("id, status")
            .eq("id", orderId)
            .single();

        if (fetchError || !order) {
            return buildError("Order not found", 404);
        }

        const status = (order.status as string | null ?? "").toUpperCase();
        if (status !== "READY") {
            return buildError("Order is not ready for delivery", 400);
        }

        const now = new Date();
        const eta = new Date(now.getTime() + 30 * 60 * 1000);
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        const { error: updateError } = await supabase
            .from("orders")
            .update({
                status: "OUT_FOR_DELIVERY",
                delivery_started_at: now.toISOString(),
                estimated_delivery_time: eta.toISOString(),
                otp,
                otp_verified: false,
            })
            .eq("id", orderId);

        if (updateError) {
            console.error("Start delivery update error", updateError);
            return buildError("Failed to start delivery", 500);
        }

        return NextResponse.json({ success: true, orderId });
    } catch (error) {
        console.error("Start delivery error", error);
        return buildError("Failed to start delivery", 500);
    }
}
