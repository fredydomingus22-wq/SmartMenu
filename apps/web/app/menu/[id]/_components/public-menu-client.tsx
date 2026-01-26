"use client";

import { useCart } from "@/components/cart/cart-context";
import { CartSheet } from "@/components/cart/cart-sheet";
import { CartAnimationProvider } from "@/components/cart/cart-animation-context";
import { FlyingProduct } from "@/components/cart/flying-product";
import { ReactNode, useEffect, useMemo } from "react";
import { hexToOklchString, getContrastColor } from "@smart-menu/ui";

import { TenantBranding } from "../_types";

function TenantSetter({ tenantId, organizationId }: { tenantId: string; organizationId: string }) {
    const { setTenantContext } = useCart();
    useEffect(() => {
        setTenantContext(tenantId, organizationId);
    }, [tenantId, organizationId, setTenantContext]);
    return null;
}

const FONTS_MAP: Record<string, string> = {
    "Inter": "Inter, sans-serif",
    "Roboto": "'Roboto', sans-serif",
    "Playfair Display": "'Playfair Display', serif",
    "Montserrat": "'Montserrat', sans-serif"
};

const GOOGLE_FONTS_HREF: Record<string, string> = {
    "Roboto": "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap",
    "Playfair Display": "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap",
    "Montserrat": "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap"
};

export function PublicMenuClient({
    children,
    tenantId,
    organizationId,
    branding
}: {
    children: ReactNode;
    tenantId: string;
    organizationId: string;
    branding?: TenantBranding | null;
}) {
    // Inject branding CSS variables
    const brandingStyles = useMemo(() => {
        if (!branding) return {};

        const styles: Record<string, string> = {};

        if (branding.primaryColor) {
            const oklch = hexToOklchString(branding.primaryColor);
            if (oklch) {
                styles['--primary'] = oklch;
                styles['--ring'] = oklch;
                styles['--primary-foreground'] = getContrastColor(branding.primaryColor);
            }
        }

        if (branding.secondaryColor) {
            const oklch = hexToOklchString(branding.secondaryColor);
            if (oklch) {
                styles['--secondary'] = oklch;
                styles['--secondary-foreground'] = getContrastColor(branding.secondaryColor);
            }
        }

        if (branding.borderRadius) {
            styles['--radius'] = branding.borderRadius;
        }

        if (branding.fontFamily && FONTS_MAP[branding.fontFamily]) {
            styles['--font-sans'] = FONTS_MAP[branding.fontFamily];
        }

        return styles;
    }, [branding]);

    const fontHref = branding?.fontFamily ? GOOGLE_FONTS_HREF[branding.fontFamily] : null;

    return (
        <>
            {fontHref && (
                <>
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                    <link href={fontHref} rel="stylesheet" />
                </>
            )}
            <div style={brandingStyles as React.CSSProperties} className="font-sans antialiased">
                <TenantSetter tenantId={tenantId} organizationId={organizationId} />
                <CartAnimationProvider>
                    {children}
                    <FlyingProduct />
                    <CartSheet />
                </CartAnimationProvider>
            </div>
        </>
    );
}
