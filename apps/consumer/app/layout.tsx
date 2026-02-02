import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/hooks/use-translation";
import { CartProvider } from "@/components/cart/cart-context";
import { Toaster } from "@smart-menu/ui";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "SmartMenu - O Seu Menu Digital",
    description: "Peça o seu prato favorito diretamente da mesa.",
    authors: [{ name: "SmartMenu Team" }],
    openGraph: {
        title: "SmartMenu - O Seu Menu Digital",
        description: "Peça o seu prato favorito diretamente da mesa.",
        type: "website",
        locale: "pt_AO",
    },
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
};

import { MarketingNotificationBanner } from "@/components/automation/marketing-notification-banner";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt">
            <head>
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <link rel="icon" type="image/png" href="/favicon.png" />
                <link rel="apple-touch-icon" href="/favicon.png" />
            </head>
            <body className={inter.className}>
                <I18nProvider>
                    <CartProvider>
                        <MarketingNotificationBanner />
                        {children}
                        <Toaster position="top-center" richColors />
                    </CartProvider>
                </I18nProvider>
            </body>
        </html>
    );
}
