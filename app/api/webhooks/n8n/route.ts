import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * n8n Webhook Endpoint
 * POST /api/webhooks/n8n
 *
 * Receives parsed WhatsApp orders from the n8n AI workflow.
 * Inserts directly into the Supabase `orders` table via REST API.
 */

// Admin Supabase client (uses service role key — bypasses RLS)
function getSupabaseAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

export async function POST(request: NextRequest) {
    try {
        // Validate webhook secret (skip if not configured — allows easy initial testing)
        const secret = request.headers.get("x-rookies-secret");
        const expectedSecret = process.env.ROOKIES_WEBHOOK_SECRET;
        if (expectedSecret && secret !== expectedSecret) {
            console.warn("[n8n webhook] Invalid secret received");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        console.log("[n8n webhook] Incoming order:", JSON.stringify(body));

        // Validate required fields
        const { business_id, customer_name, customer_phone, items, total_amount, delivery_time, source } = body;
        if (!customer_name && !items) {
            return NextResponse.json(
                { success: false, error: "Missing required fields: customer_name or items" },
                { status: 400 }
            );
        }

        const supabase = getSupabaseAdmin();

        // Only pass business_id if it looks like a real UUID (prevents FK / type errors)
        const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const validBusinessId = business_id && UUID_REGEX.test(business_id) ? business_id : null;

        const { data: order, error } = await supabase
            .from("orders")
            .insert({
                ...(validBusinessId ? { business_id: validBusinessId } : {}),
                customer_name: customer_name || "Unknown",
                customer_phone: customer_phone ? String(customer_phone) : null,
                items: items || [],
                total_amount: total_amount ?? 0,
                delivery_time: delivery_time || null,
                source: source || "whatsapp",
                status: "pending",
            })
            .select()
            .single();

        if (error) {
            console.error("[n8n webhook] Supabase insert error:", error);
            return NextResponse.json(
                { success: false, error: "Failed to save order" },
                { status: 500 }
            );
        }

        console.log("[n8n webhook] Order created:", order.id);

        return NextResponse.json({
            success: true,
            order: {
                id: order.id,
                status: order.status,
                customer_name: order.customer_name,
            },
        });
    } catch (error) {
        console.error("[n8n webhook] Error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}

/**
 * GET handler for webhook verification / health check.
 */
export async function GET() {
    return NextResponse.json({
        status: "ok",
        endpoint: "n8n-webhook",
        message: "Send POST requests to this endpoint from n8n workflows.",
    });
}
