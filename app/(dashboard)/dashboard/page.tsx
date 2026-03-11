import type { Metadata } from "next";
import {
    ShoppingBag,
    Users,
    IndianRupee,
    Package,
    TrendingUp,
    ArrowUpRight,
    Clock,
    MessageCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Dashboard",
};

// Force dynamic rendering (reads from DB on every request)
export const dynamic = "force-dynamic";

function getSupabaseAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
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
        hour: "2-digit",
        minute: "2-digit",
    });
}

function parseItems(items: unknown, notes: string | null): { name: string; qty: number }[] {
    // Try the `items` JSONB column first (Supabase flat schema)
    if (items && Array.isArray(items)) {
        return items.map((item: { name?: string; qty?: number; quantity?: number }) => ({
            name: item.name ?? "Item",
            qty: item.qty ?? item.quantity ?? 1,
        }));
    }
    // Fallback: try parsing notes as JSON
    if (!notes) return [];
    try {
        const parsed = JSON.parse(notes);
        if (Array.isArray(parsed)) {
            return parsed.map((item: { name?: string; qty?: number; quantity?: number }) => ({
                name: item.name ?? "Item",
                qty: item.qty ?? item.quantity ?? 1,
            }));
        }
    } catch { /* not JSON */ }
    return [{ name: notes, qty: 1 }];
}

export default async function DashboardPage() {
    let orderCount = 0;
    let totalRevenue = 0;
    let pendingCount = 0;
    let recentOrders: {
        id: string;
        status: string;
        total_amount: number;
        notes: string | null;
        items: unknown;
        source: string | null;
        created_at: string;
        customer_name: string | null;
        customer_phone: string | null;
        delivery_time: string | null;
    }[] = [];

    try {
        const supabase = getSupabaseAdmin();

        // Fetch all orders for stats + recent 5
        const { data: allOrders } = await supabase
            .from("orders")
            .select("id, total_amount, status");

        const { data: recent } = await supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(5);

        if (allOrders) {
            orderCount = allOrders.length;
            totalRevenue = allOrders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
            pendingCount = allOrders.filter((o) => o.status === "pending").length;
        }

        recentOrders = recent ?? [];
    } catch (err) {
        console.error("[Dashboard] DB fetch failed:", err);
    }

    // Unique customer names as a proxy for customer count
    const uniqueCustomers = new Set(recentOrders.map((o) => o.customer_name).filter(Boolean));

    const stats = [
        {
            title: "Total Orders",
            value: String(orderCount),
            change: `${orderCount} total`,
            icon: ShoppingBag,
        },
        {
            title: "Revenue",
            value: formatINR(totalRevenue),
            change: `from ${orderCount} orders`,
            icon: IndianRupee,
        },
        {
            title: "Customers",
            value: String(uniqueCustomers.size || orderCount),
            change: `unique`,
            icon: Users,
        },
        {
            title: "Pending",
            value: String(pendingCount),
            change: "need action",
            icon: Package,
        },
    ];

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                    Welcome to your business overview.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.title} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                {stat.change}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Orders + Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Recent Orders</CardTitle>
                        <Link
                            href="/dashboard/orders"
                            className="text-xs text-primary hover:underline"
                        >
                            View all →
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {recentOrders.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <ShoppingBag className="h-10 w-10 text-muted-foreground/40 mb-3" />
                                <p className="text-sm text-muted-foreground">
                                    No orders yet. They&apos;ll show up here once you start receiving them.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentOrders.map((order) => {
                                    const itemsList = parseItems(order.items, order.notes);
                                    return (
                                        <div
                                            key={order.id}
                                            className="flex items-center justify-between rounded-lg border border-border p-3"
                                        >
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-semibold text-foreground">
                                                        {order.customer_name || "Walk-in"}
                                                    </p>
                                                    {order.source && (
                                                        <span className="inline-flex items-center gap-0.5 rounded-full bg-green-50 text-green-700 px-2 py-0.5 text-[10px] font-medium">
                                                            <MessageCircle className="h-2.5 w-2.5" />
                                                            {order.source}
                                                        </span>
                                                    )}
                                                    <span
                                                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                                            order.status === "completed"
                                                                ? "bg-green-50 text-green-700"
                                                                : "bg-amber-50 text-amber-700"
                                                        }`}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    {itemsList.map((i) => `${i.name} ×${i.qty}`).join(", ") || "—"}
                                                    {order.delivery_time ? ` · ${order.delivery_time}` : ""}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-foreground">
                                                    {formatINR(Number(order.total_amount) || 0)}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground flex items-center gap-0.5 justify-end">
                                                    <Clock className="h-2.5 w-2.5" />
                                                    {formatDate(order.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Activity Log</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <ArrowUpRight className="h-10 w-10 text-muted-foreground/40 mb-3" />
                            <p className="text-sm text-muted-foreground">
                                Your business activity will be tracked here.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
