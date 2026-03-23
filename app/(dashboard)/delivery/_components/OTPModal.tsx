"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface OTPModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    orderId: string;
    onVerified: () => void;
}

export function OTPModal({ open, onOpenChange, orderId, onVerified }: OTPModalProps) {
    const [otp, setOtp] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!otp.trim()) {
            toast.error("Enter the 4-digit OTP");
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch("/api/orders/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, otp: otp.trim() }),
            });
            const data = await res.json();

            if (!res.ok) {
                toast.error(data?.error ?? "Failed to verify delivery");
            } else {
                toast.success("Delivery verified");
                setOtp("");
                onVerified();
                onOpenChange(false);
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogClose aria-label="Close" />
                <DialogHeader>
                    <DialogTitle>Verify delivery</DialogTitle>
                    <DialogDescription>
                        Confirm completion by validating the OTP shared with the customer.
                    </DialogDescription>
                </DialogHeader>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground" htmlFor="otp">
                            4-digit OTP
                        </label>
                        <Input
                            id="otp"
                            inputMode="numeric"
                            maxLength={4}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                            placeholder="1234"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={submitting}>
                            Verify Delivery
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
