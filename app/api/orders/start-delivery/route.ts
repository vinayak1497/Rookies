import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
    orderId: z.string().min(1),
});

function buildError(message: string, status = 400) {
    return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => null);
        const parsed = schema.safeParse(body);

        if (!parsed.success) {
            return buildError("Invalid request payload", 400);
        }

        const { orderId } = parsed.data;

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            select: { id: true, status: true },
        });

        if (!order) {
            return buildError("Order not found", 404);
        }

        const status = (order.status ?? "").toUpperCase();
        if (status !== "READY") {
            return buildError("Order is not ready for delivery", 400);
        }

        const now = new Date();
        const eta = new Date(now.getTime() + 30 * 60 * 1000);
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        await prisma.order.update({
            where: { id: orderId },
            data: {
                status: "OUT_FOR_DELIVERY",
                deliveryStartedAt: now,
                estimatedDeliveryTime: eta,
                otp,
                otpVerified: false,
            },
        });

        return NextResponse.json({ success: true, orderId });
    } catch (error) {
        console.error("Start delivery error", error);
        return buildError("Failed to start delivery", 500);
    }
}
