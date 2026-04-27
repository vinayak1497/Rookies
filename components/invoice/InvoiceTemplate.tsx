import { formatINR } from "@/lib/utils";
import {
    formatInvoiceDate,
    formatOrderNumber,
    formatOrderStatus,
    type InvoiceLineItem,
} from "@/lib/invoice";

export type InvoiceTemplateProps = {
    orderId: string;
    customerName: string | null;
    customerPhone: string | null;
    items: InvoiceLineItem[];
    totalAmount: number;
    status: string;
    createdAt: string;
    invoiceCreatedAt?: string | null;
};

export function InvoiceTemplate({
    orderId,
    customerName,
    customerPhone,
    items,
    totalAmount,
    status,
    createdAt,
    invoiceCreatedAt,
}: InvoiceTemplateProps) {
    const issuedAt = invoiceCreatedAt ?? createdAt;
    const displayName = customerName ?? "Walk-in customer";

    return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Rookies
                    </p>
                    <h2 className="text-2xl font-semibold text-foreground">Invoice</h2>
                    <p className="text-sm text-muted-foreground">Order #{formatOrderNumber(orderId)}</p>
                </div>
                <div className="text-right text-sm">
                    <p className="text-muted-foreground">
                        Issued <span className="text-foreground font-medium">{formatInvoiceDate(issuedAt)}</span>
                    </p>
                    <p className="text-muted-foreground">
                        Status <span className="text-foreground font-medium">{formatOrderStatus(status)}</span>
                    </p>
                </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-border bg-muted/20 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Bill To
                    </p>
                    <div className="mt-2 space-y-1 text-sm">
                        <p className="font-semibold text-foreground">{displayName}</p>
                        <p className="text-muted-foreground">{customerPhone ?? "Phone not shared"}</p>
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-muted/20 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Order Details
                    </p>
                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <p>
                            Order ID <span className="text-foreground font-medium">{orderId}</span>
                        </p>
                        <p>
                            Placed <span className="text-foreground font-medium">{formatInvoiceDate(createdAt)}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Items Table ── */}
            <div className="mt-6 rounded-xl border border-border bg-muted/10 p-4">
                <div className="grid grid-cols-12 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <span className="col-span-5">Item</span>
                    <span className="col-span-2 text-center">Qty</span>
                    <span className="col-span-2 text-right">Price</span>
                    <span className="col-span-3 text-right">Total</span>
                </div>
                <div className="mt-3 space-y-2">
                    {items.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No item details available.</p>
                    ) : (
                        items.map((item, index) => {
                            const lineTotal = item.price * item.quantity;
                            return (
                                <div
                                    key={`${item.name}-${index}`}
                                    className="grid grid-cols-12 text-sm"
                                >
                                    <span className="col-span-5 text-foreground">{item.name}</span>
                                    <span className="col-span-2 text-center text-muted-foreground">
                                        {item.quantity}
                                    </span>
                                    <span className="col-span-2 text-right text-muted-foreground">
                                        {item.price > 0 ? formatINR(item.price) : "-"}
                                    </span>
                                    <span className="col-span-3 text-right font-medium text-foreground">
                                        {lineTotal > 0 ? formatINR(lineTotal) : "-"}
                                    </span>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* ── Total ── */}
            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl font-semibold text-foreground">{formatINR(totalAmount)}</p>
            </div>
        </div>
    );
}
