import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentBusiness } from "@/lib/business";

export async function POST(request: Request) {
  try {
    const business = await getCurrentBusiness();
    if (!business) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { customer_name, phone, amount, due_date, source } = body;

    if (!customer_name || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Logic for initial status
    let status = "pending";
    const today = new Date();
    const dueDateObj = due_date ? new Date(due_date) : null;

    if (dueDateObj && dueDateObj < today) {
      status = "overdue";
    }

    const payment = await prisma.paymentRecord.create({
      data: {
        business_id: business.id,
        customer_name,
        phone,
        amount: parseFloat(amount),
        due_date: dueDateObj,
        status,
        source: source || "manual",
      },
    });

    return NextResponse.json(payment);
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
