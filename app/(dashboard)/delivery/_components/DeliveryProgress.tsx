"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface DeliveryProgressProps {
    startedAt: string;
    estimatedDeliveryTime: string;
    className?: string;
}

function formatRemaining(ms: number) {
    const totalSeconds = Math.max(Math.floor(ms / 1000), 0);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes <= 0) {
        return `${seconds}s left`;
    }
    if (minutes < 60) {
        return `${minutes}m ${seconds.toString().padStart(2, "0")} left`;
    }
    const hours = Math.floor(minutes / 60);
    const remMinutes = minutes % 60;
    return `${hours}h ${remMinutes}m left`;
}

export function DeliveryProgress({ startedAt, estimatedDeliveryTime, className }: DeliveryProgressProps) {
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        const timer = window.setInterval(() => setNow(Date.now()), 1000);
        return () => window.clearInterval(timer);
    }, []);

    const { percent, remainingLabel } = useMemo(() => {
        const startMs = new Date(startedAt).getTime();
        const etaMs = new Date(estimatedDeliveryTime).getTime();
        if (Number.isNaN(startMs) || Number.isNaN(etaMs) || etaMs <= startMs) {
            return { percent: 0, remainingLabel: "ETA unavailable" };
        }

        const duration = etaMs - startMs;
        const elapsed = now - startMs;
        const rawPercent = (elapsed / duration) * 100;
        const clamped = Math.max(0, Math.min(100, rawPercent));
        const remainingMs = Math.max(etaMs - now, 0);

        return { percent: clamped, remainingLabel: formatRemaining(remainingMs) };
    }, [estimatedDeliveryTime, now, startedAt]);

    return (
        <div className={cn("space-y-2", className)}>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                    className="h-full w-full origin-left scale-x-0 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-primary transition-transform duration-300"
                    style={{ transform: `scaleX(${percent / 100})` }}
                />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>In transit</span>
                <span className="font-medium text-foreground">{remainingLabel}</span>
            </div>
        </div>
    );
}
