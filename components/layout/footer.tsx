import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-background py-12 border-t border-primary/10">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <span className="font-serif font-black text-xl tracking-[0.2em] uppercase">
                        Rookies
                    </span>
                </Link>

                {/* Copyright */}
                <div className="text-foreground/40 text-sm">
                    © {new Date().getFullYear()} Rookies Inc. All rights reserved. Designed for makers.
                </div>

                {/* Social Links */}
                <div className="flex gap-6">
                    <a
                        href="#"
                        className="text-foreground/60 hover:text-primary transition-colors"
                        aria-label="Community"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </a>
                    <a
                        href="#"
                        className="text-foreground/60 hover:text-primary transition-colors"
                        aria-label="Website"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="2" y1="12" x2="22" y2="12" />
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                    </a>
                    <a
                        href="#"
                        className="text-foreground/60 hover:text-primary transition-colors"
                        aria-label="Email"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                        </svg>
                    </a>
                </div>
            </div>
        </footer>
    );
}
