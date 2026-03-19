import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * n8n Webhook Endpoint
 * POST /api/webhooks/n8n
 *
 * Handles:
 * - Order creation
 * - Mock delivery creation
 * - (Future) payment updates
 */

// Admin Supabase client
function getSupabaseAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log("[n8n webhook] Incoming:", JSON.stringify(body));

        const supabase = getSupabaseAdmin();

        // 👇 detect request type
        const type = body.type || "order";

        // =========================================================
        // 🟢 1. ORDER CREATION
        // =========================================================
        if (type === "order") {
            const {
                business_id,
                customer_name,
                customer_phone,
                items,
                total_amount,
                delivery_time,
                source
            } = body;

            if (!customer_name && !items) {
                return NextResponse.json(
                    { success: false, error: "Missing required fields" },
                    { status: 400 }
                );
            }

            const { data: order, error } = await supabase
                .from("orders")
                .insert({
                    business_id: business_id || "default-business-id",
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
                console.error("[ORDER ERROR]:", error);
                return NextResponse.json({ success: false }, { status: 500 });
            }

            return NextResponse.json({
                success: true,
                type: "order",
                order_id: order.id
            });
        }

        // =========================================================
        // 🚴 2. DELIVERY CREATION
        // =========================================================
        if (type === "delivery") {
            const { order_id, customer_name, customer_phone, address } = body;

            const partners = [
                { name: "Ravi Kumar", vehicle: "Bike" },
                { name: "Amit Singh", vehicle: "Scooter" },
                { name: "Imran Shaikh", vehicle: "Bike" }
            ];

            const random = partners[Math.floor(Math.random() * partners.length)];

            const delivery_id = "DEL_" + Date.now();

            const etaMinutes = Math.floor(Math.random() * 20) + 20;

            const delivery = {
                delivery_id,
                order_id,
                customer_name,
                customer_phone,
                address,
                partner_name: random.name,
                vehicle: random.vehicle,
                eta: `${etaMinutes} mins`,
                status: "assigned"
            };

            console.log("[DELIVERY CREATED]:", delivery);

            return NextResponse.json({
                success: true,
                type: "delivery",
                delivery
            });
        }

        // =========================================================
        // 💰 3. PAYMENT UPDATE (FUTURE READY)
        // =========================================================
        if (type === "payment") {
            const { order_id, status } = body;

            await supabase
                .from("orders")
                .update({ status: status || "paid" })
                .eq("id", order_id);

            return NextResponse.json({
                success: true,
                type: "payment",
                updated: true
            });
        }

        return NextResponse.json(
            { success: false, error: "Invalid type" },
            { status: 400 }
        );

    } catch (error) {
        console.error("[WEBHOOK ERROR]:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}

// GET handler
export async function GET() {
    return NextResponse.json({
        status: "ok",
        message: "Webhook active",
        supported_types: ["order", "delivery", "payment"]
    });
}