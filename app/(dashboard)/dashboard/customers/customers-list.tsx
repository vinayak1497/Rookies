"use client";

import { Users, Phone, ShoppingBag, IndianRupee, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CustomerStats } from "./actions";

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
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-peach-soft mb-4">
                <Users className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">No customers yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
                Customers will appear here automatically when they place an order.
            </p>
        </div>
    );
}

function CustomerCard({ customer }: { customer: CustomerStats }) {
    return (
        <Card className="overflow-hidden">
            <CardContent className="p-5 space-y-4">
                {/* Customer Info */}
                <div className="flex flex-col gap-1">
                    <span className="text-lg font-bold text-foreground">
                        {customer.name}
                    </span>
                    {customer.phone && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                            <Phone className="h-4 w-4" />
                            {customer.phone}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/50 p-3">
                    <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                            <ShoppingBag className="h-3 w-3" /> Orders
                        </p>
                        <p className="font-semibold text-foreground">{customer.totalOrders}</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                            <IndianRupee className="h-3 w-3" /> Total Spent
                        </p>
                        <p className="font-semibold text-emerald-600">{formatINR(customer.totalSpent)}</p>
                    </div>
                </div>

                {/* Last Order Date */}
                <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground flex items-center justify-between">
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> Last Order
                        </span>
                        <span>{formatDate(customer.lastOrderDate)}</span>
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

export function CustomersList({ initialCustomers }: { initialCustomers: CustomerStats[] }) {
    if (!initialCustomers || initialCustomers.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {initialCustomers.map((customer) => (
                <CustomerCard key={customer.id} customer={customer} />
            ))}
        </div>
    );
}
