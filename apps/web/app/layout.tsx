import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from '@/components/cart/cart-context';
import { I18nProvider } from '@/hooks/use-translation';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmartMenu | O Futuro da Gastronomia Digital",
  description: "Plataforma de pedidos via QR Code para restaurantes. Aumente o ticket médio, reduza custos e fidelize clientes com tecnologia de ponta.",
  keywords: ["menu digital", "qr code restaurante", "pedidos digitais", "kds", "fidelidade restaurante"],
  authors: [{ name: "SmartMenu Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "SmartMenu",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "50000",
                "priceCurrency": "AOA"
              },
              "description": "Plataforma de pedidos digitais via QR Code para restaurantes em Angola.",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "120"
              }
            })
          }}
        />
        <I18nProvider>
          <CartProvider>{children}</CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
