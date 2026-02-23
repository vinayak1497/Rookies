import { NextRequest, NextResponse } from "next/server";

/**
 * AI Assistant Endpoint
 * POST /api/assistant
 *
 * Future implementation:
 * - Accept user message
 * - Send to OpenAI / other LLM
 * - Stream response back
 * - Include business context from the user's data
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { message } = body;

        if (!message) {
            return NextResponse.json(
                { success: false, error: "Message is required" },
                { status: 400 }
            );
        }

        // TODO: Integrate with OpenAI API
        // const response = await openai.chat.completions.create({ ... });

        return NextResponse.json({
            success: true,
            data: {
                reply:
                    "🚧 AI Assistant is coming soon! This endpoint will connect to OpenAI to help you manage your business.",
            },
        });
    } catch (error) {
        console.error("[assistant] Error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
