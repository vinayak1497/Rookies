import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export async function Navbar() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-primary/10 glass-nav">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-2xl font-serif font-black tracking-[0.2em] text-clay uppercase">
                        Rookies
                    </span>
                </Link>

                {/* Nav Links */}
                <div className="hidden md:flex items-center gap-10">
                    <Link
                        href="#solutions"
                        className="text-[11px] font-semibold uppercase tracking-[0.15em] hover:text-primary transition-colors"
                    >
                        Solutions
                    </Link>
                    <Link
                        href="#virtual-team"
                        className="text-[11px] font-semibold uppercase tracking-[0.15em] hover:text-primary transition-colors"
                    >
                        Virtual Team
                    </Link>
                    <Link
                        href="#pricing"
                        className="text-[11px] font-semibold uppercase tracking-[0.15em] hover:text-primary transition-colors"
                    >
                        Pricing
                    </Link>
                </div>

                {/* Auth */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <Link href="/dashboard">
                                <button className="text-sm font-semibold px-4 py-2 hover:text-primary transition-colors">
                                    Dashboard
                                </button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href="/sign-in">
                                <button className="text-sm font-semibold px-4 py-2 hover:text-primary transition-colors">
                                    Log In
                                </button>
                            </Link>
                            <Link href="/sign-up">
                                <button className="bg-primary text-white text-sm font-bold px-6 py-2.5 rounded-lg hover:brightness-110 transition-all shadow-lg shadow-primary/20">
                                    Get Started Free
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
