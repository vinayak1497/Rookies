import Link from "next/link";
import { Flame } from "lucide-react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-peach-soft via-background to-background p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-2 mb-8">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        <Flame className="h-5 w-5" />
                    </div>
                    <span className="text-2xl font-bold text-foreground">Rookies</span>
                </Link>

                {children}
            </div>
        </div>
    );
}
