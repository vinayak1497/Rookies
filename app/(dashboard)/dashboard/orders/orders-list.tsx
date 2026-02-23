"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
    Phone,
    Clock,
    MessageCircle,
    CheckCircle2,
    PackageOpen,
    ShoppingBag,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { markOrderDelivered } from "./actions";
import { toast } from "sonner";

// ─── Types for the Supabase joined query ───

interface OrderCustomer {
    name: string;
    phone: string | null;
}

interface OrderPayment {
    status: string;
    amount: number;
}

interface OrderRow {
    id: string;
    order_number: string;
    status: string;
    total_amount: number;
    notes: string | null;
    source: string | null;
    delivery_date: string | null;
    created_at: string;
    customer: OrderCustomer | null;
    payments: OrderPayment[];
}

// ─── Helpers ───

function formatINR(amount: number): string {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

/** Try to parse items from the notes field (JSON array or plain text). */
function parseItems(notes: string | null): { name: string; quantity: number }[] {
    if (!notes) return [];
    try {
        const parsed = JSON.parse(notes);
        if (Array.isArray(parsed)) {
            return parsed.map((item: { name?: string; quantity?: number; qty?: number }) => ({
                name: item.name ?? "Item",
                quantity: item.quantity ?? item.qty ?? 1,
            }));
        }
    } catch {
        // Not JSON — return as single line item
    }
    return [{ name: notes, quantity: 1 }];
}

function isPaid(payments: OrderPayment[]): boolean {
    return payments.some((p) => p.status === "received");
}

// ─── Status / Payment Badges ───

function StatusBadge({ status }: { status: string }) {
    const isDelivered = status === "completed";
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                isDelivered
                    ? "bg-green-50 text-green-700"
                    : "bg-amber-50 text-amber-700"
            }`}
        >
            {isDelivered ? (
                <CheckCircle2 className="h-3 w-3" />
            ) : (
                <Clock className="h-3 w-3" />
            )}
            {isDelivered ? "Delivered" : "Pending"}
        </span>
    );
}

function PaymentBadge({ paid }: { paid: boolean }) {
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                paid
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
            }`}
        >
            {paid ? "Paid" : "Unpaid"}
        </span>
    );
}

function SourceBadge({ source }: { source: string | null }) {
    if (!source) return null;
    return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 text-green-700 px-2.5 py-0.5 text-xs font-medium">
            <MessageCircle className="h-3 w-3" />
            {source.charAt(0).toUpperCase() + source.slice(1)}
        </span>
    );
}

// ─── Order Card ───

function OrderCard({ order }: { order: OrderRow }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const items = parseItems(order.notes);
    const paid = isPaid(order.payments);
    const isDelivered = order.status === "completed";

    function handleMarkDelivered() {
        startTransition(async () => {
            const result = await markOrderDelivered(order.id);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(`Order ${order.order_number} marked as delivered`);
                router.refresh();
            }
        });
    }

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-5 space-y-4">
                {/* Top row: order number + badges */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-bold text-foreground">
                        #{order.order_number}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                        <StatusBadge status={order.status} />
                        <PaymentBadge paid={paid} />
                        <SourceBadge source={order.source} />
                    </div>
                </div>

                {/* Customer */}
                {order.customer && (
                    <div className="space-y-0.5">
                        <p className="text-sm font-semibold text-foreground">
                            {order.customer.name}
                        </p>
                        {order.customer.phone && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {order.customer.phone}
                            </p>
                        )}
                    </div>
                )}

                {/* Items */}
                {items.length > 0 && (
                    <div className="rounded-lg bg-muted/50 p-3">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                            Items
                        </p>
                        <ul className="space-y-0.5">
                            {items.map((item, i) => (
                                <li key={i} className="text-sm text-foreground flex justify-between">
                                    <span>{item.name}</span>
                                    <span className="text-muted-foreground">×{item.quantity}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Amount + Delivery */}
                <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-foreground">
                        {formatINR(order.total_amount)}
                    </p>
                    {order.delivery_date && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(order.delivery_date)}
                        </p>
                    )}
                </div>

                {/* Created time */}
                <p className="text-xs text-muted-foreground">
                    Placed on {formatDate(order.created_at)}
                </p>

                {/* CTA */}
                {!isDelivered && (
                    <Button
                        className="w-full"
                        onClick={handleMarkDelivered}
                        isLoading={isPending}
                    >
                        <CheckCircle2 className="h-4 w-4" />
                        Mark as Delivered
                    </Button>
                )}

                {isDelivered && (
                    <div className="flex items-center justify-center gap-1.5 text-sm text-green-600 font-medium py-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Delivered
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// ─── Empty State ───

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-peach-soft mb-4">
                <PackageOpen className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">No orders yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
                When customers place orders on WhatsApp, they&apos;ll appear here automatically.
            </p>
        </div>
    );
}

// ─── Main List Component ───

export function OrdersList({ initialOrders }: { initialOrders: OrderRow[] }) {
    if (!initialOrders || initialOrders.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {initialOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
            ))}
        </div>
    );
}
