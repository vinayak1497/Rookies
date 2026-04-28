import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { RookiesSplash } from "@/components/intro/RookiesSplash";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RookiesSplash>
            <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1 pt-20">{children}</main>
                <Footer />
            </div>
        </RookiesSplash>
    );
}
