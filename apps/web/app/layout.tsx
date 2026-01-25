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
  title: "SmartMenu | Menu Digital para Restaurantes em Angola - QR Code e Pedidos Digitais",
  description: "Plataforma de menu digital para restaurantes em Angola. Aumente vendas com QR Code, pedidos digitais, KDS e fidelização de clientes. Solução completa para restaurantes angolanos.",
  keywords: ["menu digital restaurante Angola", "QR code restaurante Angola", "pedidos digitais Angola", "KDS cozinha Angola", "menu interativo Angola", "fidelização clientes restaurante", "tecnologia restaurante Luanda", "digitalização restaurante Angola"],
  authors: [{ name: "SmartMenu Team" }],
  openGraph: {
    title: "SmartMenu - Menu Digital para Restaurantes em Angola",
    description: "Transforme seu restaurante com tecnologia digital. QR Code, pedidos automáticos e KDS para aumentar vendas em Angola.",
    type: "website",
    locale: "pt_AO",
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartMenu | Menu Digital Restaurante Angola",
    description: "Aumente o ticket médio do seu restaurante em Angola com menu digital via QR Code.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <head>
        <link rel="alternate" hrefLang="pt-ao" href="https://smartmenu.ao" />
        <link rel="alternate" hrefLang="pt-pt" href="https://smartmenu.pt" />
        <link rel="alternate" hrefLang="en" href="https://smartmenu.com" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SmartMenu" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "SmartMenu Angola",
              "description": "Plataforma de menu digital para restaurantes em Angola com QR Code e pedidos digitais.",
              "url": "https://smartmenu.ao",
              "telephone": "+244 923 456 789",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Rua da Independência, 123",
                "addressLocality": "Luanda",
                "addressRegion": "Luanda",
                "postalCode": "1000",
                "addressCountry": "AO"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "-8.8147",
                "longitude": "13.2302"
              },
              "openingHours": "Mo-Su 08:00-22:00",
              "priceRange": "$$",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "120"
              }
            })
          }}
        />
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
