import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Rookies — Virtual COO for Indian Small Businesses",
    template: "%s | Rookies",
  },
  description:
    "Run your small business like a pro. Rookies helps home bakers, kirana stores, and Instagram-first brands manage orders, payments, inventory, and WhatsApp — all in one place.",
  keywords: [
    "small business",
    "India",
    "COO",
    "business management",
    "kirana",
    "home baker",
    "WhatsApp automation",
    "inventory",
    "payments",
  ],
  authors: [{ name: "Rookies" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Rookies",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
        <body className="antialiased">
          {children}
          <Toaster
          position="top-right"
          richColors
            toastOptions={{
              style: {
                fontFamily: "var(--font-inter)",
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
