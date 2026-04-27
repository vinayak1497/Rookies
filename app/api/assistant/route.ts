import { NextRequest, NextResponse } from "next/server";
import { getServerTranslations } from "@/lib/i18n/server";
import { LANGUAGE_PROMPT_LABELS } from "@/lib/i18n/config";

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

        const { language, t } = await getServerTranslations();
        const promptLanguage = LANGUAGE_PROMPT_LABELS[language] ?? "English";
        const systemPrompt = `Respond in ${promptLanguage}. Use simple, friendly tone.`;

        // TODO: Integrate with OpenAI API
        // const response = await openai.chat.completions.create({
        //   messages: [
        //     { role: "system", content: systemPrompt },
        //     { role: "user", content: message },
        //   ],
        // });

        return NextResponse.json({
            success: true,
            data: {
                reply: t("assistant.coming_soon"),
                language,
                system_prompt: systemPrompt,
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
