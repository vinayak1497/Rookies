import { NextResponse } from "next/server";
import { getCurrentBusiness } from "@/lib/business";

export async function POST(request: Request) {
  try {
    const business = await getCurrentBusiness();
    if (!business) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { customer_name, phone, amount } = body;

    if (!customer_name || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Call the n8n webhook
    // In a real production setup, this would be an external URL
    // For now, we call our own internal webhook simulation
    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/webhooks/n8n`;

    const payload = {
      type: "payment_reminder",
      customer_name,
      phone,
      amount,
      message: `Hi ${customer_name}, just a reminder for ₹${amount} pending payment.`,
      business_name: business.name,
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to trigger webhook");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending reminder:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
