"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";
import {
    Flame,
    LayoutDashboard,
    ShoppingBag,
    Users,
    IndianRupee,
    Package,
    MessageCircle,
    Settings,
    Menu,
    X,
} from "lucide-react";
import { useState } from "react";

const sidebarLinks = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/orders", label: "Orders", icon: ShoppingBag },
    { href: "/dashboard/customers", label: "Customers", icon: Users },
    { href: "/dashboard/payments", label: "Payments", icon: IndianRupee },
    { href: "/dashboard/inventory", label: "Inventory", icon: Package },
    { href: "/dashboard/whatsapp", label: "WhatsApp", icon: MessageCircle },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname();

    return (
        <aside className={cn("flex flex-col h-full", className)}>
            {/* Logo */}
            <div className="flex h-16 items-center gap-2 px-6 border-b border-border">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Flame className="h-4 w-4" />
                </div>
                <span className="text-lg font-bold">Rookies</span>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {sidebarLinks.map((link) => {
                    const isActive =
                        pathname === link.href ||
                        (link.href !== "/dashboard" && pathname.startsWith(link.href));

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-peach-soft text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <link.icon className="h-4 w-4 shrink-0" />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-background">
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex lg:w-64 lg:flex-col border-r border-border bg-card">
                <Sidebar />
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="fixed inset-0 bg-black/50"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <div className="fixed inset-y-0 left-0 w-64 bg-card shadow-xl">
                        <Sidebar />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="flex h-16 items-center gap-4 border-b border-border bg-card px-4 lg:px-6">
                    <button
                        className="lg:hidden p-2 rounded-md hover:bg-muted"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </button>

                    <div className="flex-1" />

                    {/* Clerk User Button */}
                    <div className="flex items-center gap-3">
                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    avatarBox: "h-8 w-8",
                                },
                            }}
                        />
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto">
                    <Container className="py-6 lg:py-8">
                        {children}
                    </Container>
                </main>
            </div>
        </div>
    );
}
