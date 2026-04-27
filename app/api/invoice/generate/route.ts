import { NextResponse } from "next/server";
import { z } from "zod";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { uploadToS3 } from "@/lib/s3";
import {
    buildInvoiceItems,
    formatInvoiceDate,
    formatOrderNumber,
    formatOrderStatus,
    type InvoiceLineItem,
} from "@/lib/invoice";

export const runtime = "nodejs";

const schema = z.object({
    orderId: z.string().min(1),
});

type InvoiceOrderRow = {
    id: string;
    customer_name: string | null;
    customer_phone: string | null;
    items: unknown;
    total_amount: number | string | null;
    status: string | null;
    created_at: string | null;
    note: string | null;
    invoice_url: string | null;
    invoice_created_at: string | null;
};

function buildError(message: string, status = 400) {
    return NextResponse.json({ success: false, error: message }, { status });
}

/**
 * Strip non-ASCII characters from text to avoid pdf-lib encoding errors.
 * Replaces ₹ with "INR " so the symbol renders properly.
 */
function safePdfText(value: string): string {
    return value
        .replace(/₹/g, "INR ")
        .replace(/[^\x20-\x7E]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

/** Format a number as INR without the ₹ symbol (ASCII-safe for pdf-lib). */
function pdfINR(amount: number): string {
    return `INR ${amount.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

// ─── PDF Generation ───

async function generateInvoicePdfBuffer(
    order: InvoiceOrderRow,
    items: InvoiceLineItem[]
): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4
    const { width, height } = page.getSize();

    const margin = 48;
    let cursorY = height - margin;

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const dark = rgb(0.12, 0.12, 0.12);
    const muted = rgb(0.45, 0.45, 0.45);
    const line = rgb(0.87, 0.87, 0.87);

    const contentWidth = width - margin * 2;

    // ── Header ──
    page.drawText(safePdfText("Rookies"), { x: margin, y: cursorY, size: 18, font: bold, color: dark });
    page.drawText(safePdfText("Invoice"), {
        x: width - margin - bold.widthOfTextAtSize("Invoice", 18),
        y: cursorY,
        size: 18,
        font: bold,
        color: dark,
    });

    cursorY -= 26;

    // ── Order info ──
    const issuedAt = formatInvoiceDate(order.invoice_created_at ?? order.created_at ?? null);
    page.drawText(safePdfText(`Order #${formatOrderNumber(order.id)}`), {
        x: margin, y: cursorY, size: 11, font: bold, color: dark,
    });
    const issuedText = safePdfText(`Issued: ${issuedAt}`);
    page.drawText(issuedText, {
        x: width - margin - font.widthOfTextAtSize(issuedText, 10),
        y: cursorY, size: 10, font, color: muted,
    });

    cursorY -= 16;

    // ── Customer + Status ──
    const status = formatOrderStatus((order.status ?? "PLACED").toUpperCase());
    const customerName = order.customer_name ?? "Walk-in customer";
    const customerPhone = order.customer_phone ?? "Phone not shared";

    page.drawText(safePdfText(`Customer: ${customerName}`), {
        x: margin, y: cursorY, size: 10, font, color: muted,
    });
    const statusText = safePdfText(`Status: ${status}`);
    page.drawText(statusText, {
        x: width - margin - font.widthOfTextAtSize(statusText, 10),
        y: cursorY, size: 10, font, color: muted,
    });

    cursorY -= 14;

    page.drawText(safePdfText(`Phone: ${customerPhone}`), {
        x: margin, y: cursorY, size: 10, font, color: muted,
    });

    cursorY -= 20;

    // ── Divider ──
    page.drawLine({ start: { x: margin, y: cursorY }, end: { x: width - margin, y: cursorY }, thickness: 1, color: line });
    cursorY -= 14;

    // ── Table Header: Item | Qty | Price | Total ──
    const colItem = margin;
    const colQty = margin + contentWidth * 0.55;
    const colPrice = margin + contentWidth * 0.70;
    const colTotal = margin + contentWidth * 0.88;

    page.drawText("Item", { x: colItem, y: cursorY, size: 10, font: bold, color: muted });
    page.drawText("Qty", { x: colQty, y: cursorY, size: 10, font: bold, color: muted });
    page.drawText("Price", { x: colPrice, y: cursorY, size: 10, font: bold, color: muted });
    page.drawText("Total", { x: colTotal, y: cursorY, size: 10, font: bold, color: muted });

    cursorY -= 10;

    page.drawLine({ start: { x: margin, y: cursorY }, end: { x: width - margin, y: cursorY }, thickness: 1, color: line });
    cursorY -= 14;

    // ── Table Rows ──
    if (items.length === 0) {
        page.drawText(safePdfText("No item details available."), {
            x: margin, y: cursorY, size: 10, font, color: muted,
        });
        cursorY -= 16;
    } else {
        for (const item of items) {
            if (cursorY < margin + 80) break; // page overflow safety

            const lineTotal = item.price * item.quantity;

            page.drawText(safePdfText(item.name), { x: colItem, y: cursorY, size: 10, font, color: dark });
            page.drawText(String(item.quantity), { x: colQty, y: cursorY, size: 10, font, color: muted });

            if (item.price > 0) {
                page.drawText(safePdfText(pdfINR(item.price)), { x: colPrice, y: cursorY, size: 10, font, color: muted });
                page.drawText(safePdfText(pdfINR(lineTotal)), { x: colTotal, y: cursorY, size: 10, font, color: dark });
            } else {
                page.drawText("-", { x: colPrice, y: cursorY, size: 10, font, color: muted });
                page.drawText("-", { x: colTotal, y: cursorY, size: 10, font, color: muted });
            }

            cursorY -= 18;
        }
    }

    cursorY -= 6;

    // ── Total line ──
    page.drawLine({ start: { x: margin, y: cursorY }, end: { x: width - margin, y: cursorY }, thickness: 1, color: line });
    cursorY -= 20;

    const totalStr = safePdfText(pdfINR(Number(order.total_amount) || 0));
    page.drawText("Total", {
        x: colPrice, y: cursorY, size: 12, font: bold, color: dark,
    });
    page.drawText(totalStr, {
        x: colTotal, y: cursorY, size: 12, font: bold, color: dark,
    });

    // ── Footer ──
    cursorY -= 40;
    page.drawText(safePdfText("Thank you for your order!"), {
        x: margin, y: cursorY, size: 9, font, color: muted,
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
}

// ─── Route Handler ───

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => null);
        const parsed = schema.safeParse(body);
        if (!parsed.success) {
            return buildError("Invalid request payload", 400);
        }

        const { orderId } = parsed.data;
        const supabase = getSupabaseAdmin();

        // ── 1. Fetch the order ──
        const baseSelect =
            "id, customer_name, customer_phone, items, total_amount, status, created_at, note";
        const invoiceSelect = `${baseSelect}, invoice_url, invoice_created_at`;

        let { data: order, error } = await supabase
            .from("orders")
            .select(invoiceSelect)
            .eq("id", orderId)
            .single();

        if (error?.code === "42703") {
            console.warn("[invoice] Missing invoice columns, retrying without them", error);
            const fallback = await supabase
                .from("orders")
                .select(baseSelect)
                .eq("id", orderId)
                .single();
            error = fallback.error;
            if (fallback.data) {
                order = {
                    ...fallback.data,
                    invoice_url: null,
                    invoice_created_at: null,
                } as InvoiceOrderRow;
            }
        }

        if (error || !order) {
            console.error("[invoice] order fetch error", error);
            return buildError("Order not found", 404);
        }

        const typedOrder = order as InvoiceOrderRow;

        // ── 2. If invoice already exists, return it ──
        if (typedOrder.invoice_url) {
            return NextResponse.json({ success: true, invoice_url: typedOrder.invoice_url });
        }

        // ── 3. Validate order status ──
        const status = (typedOrder.status ?? "PLACED").toUpperCase();
        if (status !== "READY") {
            return buildError("Invoice can only be created for READY orders", 400);
        }

        // ── 4. Build items & generate PDF ──
        const items = buildInvoiceItems(typedOrder.items, typedOrder.note ?? null);
        const pdfBuffer = await generateInvoicePdfBuffer(typedOrder, items);

        // ── 5. Upload to S3 ──
        const fileName = `invoices/${typedOrder.id}-${Date.now()}.pdf`;
        let invoiceUrl: string;
        try {
            invoiceUrl = await uploadToS3(pdfBuffer, fileName, "application/pdf");
        } catch (s3Error) {
            console.error("[invoice] S3 upload error", s3Error);
            return buildError("Failed to upload invoice to storage", 500);
        }

        // ── 6. Save URL to database ──
        const invoiceCreatedAt = new Date().toISOString();
        const { error: updateError } = await supabase
            .from("orders")
            .update({
                invoice_url: invoiceUrl,
                invoice_created_at: invoiceCreatedAt,
            })
            .eq("id", typedOrder.id);

        if (updateError) {
            console.error("[invoice] DB update error", updateError);
            if (updateError.code === "42703") {
                return buildError(
                    "Invoice columns missing in orders table. Run migration: ALTER TABLE orders ADD COLUMN invoice_url text, ADD COLUMN invoice_created_at timestamptz;",
                    500
                );
            }
            return buildError("Failed to save invoice URL", 500);
        }

        // ── 7. Return URL to frontend ──
        return NextResponse.json({ success: true, invoice_url: invoiceUrl });
    } catch (error) {
        console.error("[invoice] generate error", error);
        return buildError("Failed to generate invoice", 500);
    }
}
