import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const schema = z.object({
    orderId: z.string().min(1),
    otp: z.string().min(4).max(6),
});

function buildError(message: string, status = 400) {
    return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
    const supabase = getSupabaseAdmin();

    const body = await request.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
        return buildError("Invalid request payload", 400);
    }

    const { orderId, otp } = parsed.data;

    const { data: order, error } = await supabase
        .from("orders")
        .select("id, otp, status")
        .eq("id", orderId)
        .single();

    if (error || !order) {
        return buildError("Order not found", 404);
    }

    if (!order.otp || order.otp !== otp) {
        return buildError("Incorrect OTP", 400);
    }

    const { error: updateError } = await supabase
        .from("orders")
        .update({ status: "DELIVERED", otp_verified: true })
        .eq("id", orderId);

    if (updateError) {
        return buildError("Failed to verify delivery", 500);
    }

    return NextResponse.json({ success: true });
}
