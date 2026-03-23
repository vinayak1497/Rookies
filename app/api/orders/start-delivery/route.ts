import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const schema = z.object({
    orderId: z.string().min(1),
    destination: z
        .object({
            lat: z.number(),
            lng: z.number(),
        })
        .optional(),
});

const FALLBACK_COORDS = {
    origin: { lat: 12.9716, lng: 77.5946 },
    destination: { lat: 12.9816, lng: 77.6146 },
};

async function resolveCoordinates(
    destinationOverride?: { lat: number; lng: number }
): Promise<{ origin: { lat: number; lng: number }; destination: { lat: number; lng: number } }> {
    if (destinationOverride) {
        return {
            origin: {
                lat: destinationOverride.lat + 0.01,
                lng: destinationOverride.lng,
            },
            destination: destinationOverride,
        };
    }

    try {
        const res = await fetch("https://ipapi.co/json/");
        if (res.ok) {
            const payload = await res.json();
            if (payload?.latitude && payload?.longitude) {
                const lat = Number(payload.latitude);
                const lng = Number(payload.longitude);
                if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
                    return {
                        origin: { lat: lat + 0.01, lng },
                        destination: { lat, lng: lng + 0.015 },
                    };
                }
            }
        }
    } catch (_error) {
        // Silent fallback to defaults when IP lookup fails
    }

    return FALLBACK_COORDS;
}

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

    const apiKey = process.env.OPENROUTESERVICE_API_KEY;
    if (!apiKey) {
        return buildError("OpenRouteService API key is not configured", 500);
    }

    const { orderId, destination } = parsed.data;

    const { data: order, error: fetchError } = await supabase
        .from("orders")
        .select("id, status")
        .eq("id", orderId)
        .single();

    if (fetchError || !order) {
        return buildError("Order not found", 404);
    }

    const normalizedStatus = (order.status ?? "").toUpperCase();
    if (normalizedStatus !== "READY") {
        return buildError("Order is not ready for delivery", 400);
    }

    const coordinates = await resolveCoordinates(destination);

    const orsResponse = await fetch("https://api.openrouteservice.org/v2/directions/driving-car", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: apiKey,
        },
        body: JSON.stringify({
            coordinates: [
                [coordinates.origin.lng, coordinates.origin.lat],
                [coordinates.destination.lng, coordinates.destination.lat],
            ],
        }),
    });

    if (!orsResponse.ok) {
        return buildError("Failed to fetch route details", 502);
    }

    const orsPayload = await orsResponse.json();
    const durationSeconds = Math.max(
        60,
        Math.round(
            Number(
                orsPayload?.features?.[0]?.properties?.summary?.duration ?? 0
            )
        )
    );

    const now = new Date();
    const eta = new Date(now.getTime() + durationSeconds * 1000);
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
        return buildError("Failed to update order", 500);
    }

    return NextResponse.json({
        success: true,
        deliveryStartedAt: now.toISOString(),
        estimatedDeliveryTime: eta.toISOString(),
    });
}
