export type InvoiceLineItem = {
    name: string;
    quantity: number;
    price: number;
};

/**
 * Safely extract line items from the order's `items` JSONB column.
 * Handles: null, string (legacy JSON-encoded), proper array.
 * Falls back to parsing the `note` field if items is empty.
 */
export function buildInvoiceItems(items: unknown, note: string | null): InvoiceLineItem[] {
    const normalize = (
        raw: { name?: string; quantity?: number; qty?: number; price?: number; unit_price?: number }[]
    ): InvoiceLineItem[] =>
        raw.map((item) => ({
            name: item.name ?? "Item",
            quantity: item.quantity ?? item.qty ?? 1,
            price: Number(item.price ?? item.unit_price ?? 0),
        }));

    // Case 1: proper array
    if (Array.isArray(items) && items.length > 0) {
        return normalize(items);
    }

    // Case 2: JSON-encoded string
    if (typeof items === "string" && items.length > 0) {
        try {
            const parsed = JSON.parse(items);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return normalize(parsed);
            }
        } catch {
            // Not valid JSON — fall through
        }
    }

    // Case 3: fallback to note field
    if (note) {
        try {
            const parsed = JSON.parse(note);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return normalize(parsed);
            }
        } catch {
            // note is plain text — treat as single item
            return [{ name: note, quantity: 1, price: 0 }];
        }
        return [{ name: note, quantity: 1, price: 0 }];
    }

    return [];
}

export function formatInvoiceDate(value?: string | null): string {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function formatOrderNumber(orderId: string): string {
    return orderId.slice(0, 8).toUpperCase();
}

export function formatOrderStatus(status: string): string {
    return status.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}
