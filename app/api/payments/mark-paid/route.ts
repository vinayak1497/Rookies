import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentBusiness } from "@/lib/business";

export async function POST(request: Request) {
  try {
    const business = await getCurrentBusiness();
    if (!business) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Missing payment ID" }, { status: 400 });
    }

    const payment = await prisma.paymentRecord.update({
      where: {
        id,
        business_id: business.id, // Scoped to business
      },
      data: {
        status: "paid",
        paid_at: new Date(),
      },
    });

    return NextResponse.json(payment);
  } catch (error) {
    console.error("Error marking payment as paid:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
