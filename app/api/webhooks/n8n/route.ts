import { NextRequest, NextResponse } from "next/server";

/**
 * n8n Webhook Endpoint
 * POST /api/webhooks/n8n
 *
 * This endpoint will receive webhooks from n8n workflows.
 * Future implementation:
 * - Validate webhook secret
 * - Parse n8n event payload
 * - Route to appropriate handler (order updates, WhatsApp triggers, etc.)
 */
export async function POST(request: NextRequest) {
    try {
        // TODO: Validate webhook secret
        // const secret = request.headers.get("x-webhook-secret");
        // if (secret !== process.env.N8N_WEBHOOK_SECRET) {
        //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        // }

        const body = await request.json();

        // TODO: Process n8n webhook payload
        console.log("[n8n webhook] Received:", JSON.stringify(body).slice(0, 200));

        return NextResponse.json({
            success: true,
            message: "Webhook received",
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
 * GET handler for webhook verification.
 */
export async function GET() {
    return NextResponse.json({
        status: "ok",
        endpoint: "n8n-webhook",
        message: "Send POST requests to this endpoint from n8n workflows.",
    });
}
