import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log("n8n Webhook Received:", payload);

    // This is where n8n would typically take over and send a WhatsApp message
    // For this implementation, we just log it and return success

    return NextResponse.json({ 
      status: "success", 
      message: "Webhook processed by n8n",
      payload_received: payload 
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}