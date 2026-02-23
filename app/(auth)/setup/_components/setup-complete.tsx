"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const capabilities = [
    "Reply to customer messages on WhatsApp",
    "Manage your orders and track payments",
    "Send reminders and follow-ups",
    "Keep your inventory in sync",
];

export function SetupComplete({ businessName }: { businessName: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
        >
            <div className="rounded-2xl border border-border bg-card p-8 sm:p-12 shadow-sm text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                    className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/10"
                >
                    <CheckCircle2 className="h-8 w-8 text-success" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h2 className="text-2xl font-semibold text-foreground tracking-tight">
                        {businessName} is ready.
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6 space-y-4"
                >
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span>Here&apos;s what I&apos;ll handle for you</span>
                    </div>

                    <div className="mx-auto max-w-sm space-y-2.5">
                        {capabilities.map((cap, i) => (
                            <motion.div
                                key={cap}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 + i * 0.1 }}
                                className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-2.5 text-left"
                            >
                                <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                                <span className="text-sm text-foreground">{cap}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                    className="mt-8"
                >
                    <Link href="/dashboard">
                        <Button size="lg" className="w-full sm:w-auto sm:px-12">
                            Go to Your Business
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </motion.div>
    );
}
