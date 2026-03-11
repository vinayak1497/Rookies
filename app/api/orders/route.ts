import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

/**
 * GET /api/orders
 * Returns the latest 50 orders from Supabase.
 */
export async function GET() {
    try {
        const supabase = getSupabaseAdmin();

        const { data: orders, error } = await supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(50);

        if (error) {
            console.error("[orders API] Supabase error:", error);
            return NextResponse.json(
                { error: "Failed to fetch orders" },
                { status: 500 }
            );
        }

        return NextResponse.json(orders ?? []);
    } catch (error) {
        console.error("[orders API] Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch orders" },
            { status: 500 }
        );
    }
}
