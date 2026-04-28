import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentBusiness } from "@/lib/business";

export async function GET() {
  try {
    const business = await getCurrentBusiness();
    if (!business) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payments = await prisma.paymentRecord.findMany({
      where: {
        business_id: business.id,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    // Update statuses to "overdue" if needed before returning
    const today = new Date();
    const updatedPayments = await Promise.all(
      payments.map(async (payment) => {
        if (payment.status === "pending" && payment.due_date && new Date(payment.due_date) < today) {
          const updated = await prisma.paymentRecord.update({
            where: { id: payment.id },
            data: { status: "overdue" },
          });
          return updated;
        }
        return payment;
      })
    );

    return NextResponse.json(updatedPayments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
