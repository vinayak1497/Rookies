import type { Metadata } from "next";
import { getOrdersForUser } from "./actions";
import { OrdersList } from "./orders-list";

export const metadata: Metadata = {
    title: "Orders",
};

export default async function OrdersPage() {
    const { orders, error } = await getOrdersForUser();

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">Orders</h1>
                <p className="text-muted-foreground mt-1">
                    Track and manage your incoming orders.
                </p>
            </div>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    Something went wrong loading orders. Please try again.
                </div>
            )}

            <OrdersList initialOrders={orders} />
        </div>
    );
}
