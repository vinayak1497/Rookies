import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const schema = z.object({
    orderId: z.string().min(1),
});

function buildError(message: string, status = 400) {
    return NextResponse.json({ success: false, error: message }, { status });
}

/**
 * POST /api/orders/start-delivery
 *
 * 1. Validates order is READY
 * 2. Generates a 4-digit OTP
 * 3. Updates order: status → OUT_FOR_DELIVERY, stores OTP
 * 4. Sends OTP to customer via n8n → WhatsApp webhook
 */
export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => null);
        const parsed = schema.safeParse(body);

        if (!parsed.success) {
            return buildError("Invalid request payload", 400);
        }

        const { orderId } = parsed.data;
        const supabase = getSupabaseAdmin();

        // ── 1. Fetch order & validate ──
        const { data: order, error: fetchError } = await supabase
            .from("orders")
            .select("id, status, customer_name, customer_phone")
            .eq("id", orderId)
            .single();

        if (fetchError || !order) {
            return buildError("Order not found", 404);
        }

        const status = (order.status as string | null ?? "").toUpperCase();

        // Prevent duplicate clicks: if already out for delivery, return success
        if (status === "OUT_FOR_DELIVERY") {
            return NextResponse.json({
                success: true,
                orderId,
                message: "Delivery already started",
            });
        }

        if (status !== "READY") {
            return buildError("Order is not ready for delivery", 400);
        }

        // ── 2. Generate OTP ──
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const now = new Date();
        const eta = new Date(now.getTime() + 30 * 60 * 1000); // 30min ETA

        // ── 3. Update order in Supabase ──
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
            console.error("[start-delivery] DB update error", updateError);
            return buildError("Failed to start delivery", 500);
        }

        // ── 4. Send OTP to customer via n8n webhook (WhatsApp) ──
        const customerPhone = order.customer_phone?.trim();
        const customerName = order.customer_name ?? "Customer";

        if (customerPhone) {
            // Use the dedicated OTP webhook URL, fallback to main webhook
            const webhookUrl =
                process.env.N8N_OTP_WEBHOOK_URL ||
                "https://n8n.rookiesn8n.me/webhook/df6855de-8eac-4605-9a8e-9ee07b95a2b5";

            try {
                const webhookRes = await fetch(webhookUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        orderId,
                        name: customerName,
                        phone: customerPhone,
                        otp,
                    }),
                    signal: AbortSignal.timeout(10_000), // 10s timeout
                });

                if (!webhookRes.ok) {
                    console.warn(
                        "[start-delivery] n8n webhook non-OK response:",
                        webhookRes.status,
                        await webhookRes.text().catch(() => "")
                    );
                } else {
                    console.log("[start-delivery] OTP sent to customer via WhatsApp", {
                        orderId,
                        phone: customerPhone,
                    });
                }
            } catch (webhookError) {
                // Webhook failure should NOT block the delivery flow
                console.error("[start-delivery] n8n webhook failed (non-blocking):", webhookError);
            }
        } else {
            console.warn("[start-delivery] No customer phone — skipping OTP WhatsApp notification", {
                orderId,
            });
        }

        return NextResponse.json({
            success: true,
            orderId,
            otpSent: Boolean(customerPhone),
        });
    } catch (error) {
        console.error("[start-delivery] Unexpected error", error);
        return buildError("Failed to start delivery", 500);
    }
}
