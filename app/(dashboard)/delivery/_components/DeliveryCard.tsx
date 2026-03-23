"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DeliveryOrder } from "../actions";
import { DeliveryProgress } from "./DeliveryProgress";
import { OTPModal } from "./OTPModal";
import { Clock, CheckCircle2, Truck, User } from "lucide-react";

function formatINR(amount: number): string {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
}

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getStatusBadge(status: DeliveryOrder["status"]) {
    switch (status) {
        case "READY":
            return { label: "Ready", className: "bg-amber-50 text-amber-700" };
        case "OUT_FOR_DELIVERY":
            return { label: "Out for delivery", className: "bg-orange-50 text-orange-700" };
        case "DELIVERED":
            return { label: "Delivered", className: "bg-emerald-50 text-emerald-700" };
        default:
            return { label: status, className: "bg-muted text-foreground" };
    }
}

export function DeliveryCard({ order }: { order: DeliveryOrder }) {
    const router = useRouter();
    const [startLoading, setStartLoading] = useState(false);
    const [otpOpen, setOtpOpen] = useState(false);

    const statusBadge = useMemo(() => getStatusBadge(order.status), [order.status]);

    async function handleStartDelivery() {
        setStartLoading(true);
        try {
            const res = await fetch("/api/orders/start-delivery", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId: order.id }),
            });
            const data = await res.json();

            if (!res.ok) {
                toast.error(data?.error ?? "Failed to start delivery");
            } else {
                toast.success("Delivery started");
                router.refresh();
            }
        } catch (error) {
            toast.error("Unable to start delivery");
        } finally {
            setStartLoading(false);
        }
    }

    return (
        <>
            <Card className="overflow-hidden shadow-sm border border-border/70 bg-card">
                <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">Order</p>
                            <p className="text-lg font-semibold text-foreground">#{order.orderNumber}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Placed on {formatDate(order.createdAt)}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span
                                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${statusBadge.className}`}
                            >
                                {statusBadge.label}
                            </span>
                            {order.otpVerified && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    OTP Verified
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-muted/60 p-4">
                        <div className="flex items-center gap-3 text-foreground">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-peach-soft text-primary">
                                <User className="h-4 w-4" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="font-semibold">{order.customerName}</p>
                                {order.customerPhone && (
                                    <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
                                )}
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-muted-foreground">Amount</p>
                            <p className="text-lg font-semibold text-foreground">
                                {formatINR(order.totalAmount)}
                            </p>
                        </div>
                    </div>

                    {order.status === "READY" && (
                        <Button className="w-full" onClick={handleStartDelivery} isLoading={startLoading}>
                            <Truck className="h-4 w-4" />
                            Start Delivery
                        </Button>
                    )}

                    {order.status === "OUT_FOR_DELIVERY" && (
                        <div className="space-y-3">
                            {order.deliveryStartedAt && order.estimatedDeliveryTime ? (
                                <DeliveryProgress
                                    startedAt={order.deliveryStartedAt}
                                    estimatedDeliveryTime={order.estimatedDeliveryTime}
                                />
                            ) : (
                                <div className="rounded-lg border border-dashed border-border bg-muted/40 p-3 text-xs text-muted-foreground">
                                    ETA pending. Delivery timing will update once started.
                                </div>
                            )}
                            <Button
                                variant="secondary"
                                className="w-full"
                                onClick={() => setOtpOpen(true)}
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                Verify OTP
                            </Button>
                        </div>
                    )}

                    {order.status === "DELIVERED" && (
                        <div className="flex items-center justify-center gap-2 rounded-lg bg-emerald-50 py-3 text-sm font-semibold text-emerald-700">
                            <CheckCircle2 className="h-4 w-4" />
                            Delivery completed
                        </div>
                    )}
                </CardContent>
            </Card>

            <OTPModal
                open={otpOpen}
                onOpenChange={setOtpOpen}
                orderId={order.id}
                onVerified={() => router.refresh()}
            />
        </>
    );
}
