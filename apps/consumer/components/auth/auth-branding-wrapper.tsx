"use client";

import { ReactNode, useMemo } from "react";
import { hexToOklchString, getContrastColor } from "@/utils/colors";
import { TenantBranding } from "../../app/menu/[id]/_types";

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

export function AuthBrandingWrapper({
    children,
    branding
}: {
    children: ReactNode;
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
        <div style={brandingStyles as React.CSSProperties} className="font-sans antialiased min-h-screen">
            {fontHref && (
                <>
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                    <link href={fontHref} rel="stylesheet" />
                </>
            )}
            {children}
        </div>
    );
}
