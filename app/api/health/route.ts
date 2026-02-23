import { NextResponse } from "next/server";

/**
 * Health check endpoint.
 * GET /api/health
 */
export async function GET() {
    return NextResponse.json({
        status: "ok",
        service: "rookies",
        timestamp: new Date().toISOString(),
    });
}
