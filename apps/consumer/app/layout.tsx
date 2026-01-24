import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "../hooks/use-translation";
import { CartProvider } from "../components/cart/cart-context";
import { Toaster } from "@smart-menu/ui/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "SmartMenu - O Seu Menu Digital",
    description: "Peça o seu prato favorito diretamente da mesa.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt">
            <body className={inter.className}>
                <I18nProvider>
                    <CartProvider>
                        {children}
                        <Toaster />
                    </CartProvider>
                </I18nProvider>
            </body>
        </html>
    );
}
