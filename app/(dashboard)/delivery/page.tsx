import type { Metadata } from "next";
import { DeliveryCard } from "./_components/DeliveryCard";
import { getDeliveryOrders } from "./actions";
import { Map } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Delivery",
};

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-peach-soft mb-4">
                <Map className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">No deliveries in progress</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
                Orders marked as ready will appear here so you can start and track delivery in real time.
            </p>
        </div>
    );
}

export default async function DeliveryPage() {
    const { orders, error } = await getDeliveryOrders();

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-foreground">Delivery</h1>
                <p className="text-muted-foreground">
                    Manage live drop-offs, start runs, and verify deliveries with OTP.
                </p>
            </div>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            {orders.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {orders.map((order) => (
                        <DeliveryCard key={order.id} order={order} />
                    ))}
                </div>
            )}
        </div>
    );
}
