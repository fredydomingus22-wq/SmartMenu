/**
 * Simple utility to convert Hex colors to OKLCH components (L C H)
 * This is a simplified version for programmatic branding.
 */

export function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255
    } : null;
}

// Simplified RGB to OKLCH conversion
// Based on typical color science formulas
export function rgbToOklch(r: number, g: number, b: number) {
    // 1. Linearize RGB
    const lr = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    const lg = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    const lb = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

    // 2. Linear RGB to LMS
    const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
    const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969466 * lb;
    const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

    // 3. LMS to OKLMS
    const l_ = Math.cbrt(l);
    const m_ = Math.cbrt(m);
    const s_ = Math.cbrt(s);

    // 4. OKLMS to OKLCH
    const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720403 * s_;
    const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
    const b_ = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;

    const C = Math.sqrt(a * a + b_ * b_);
    const h = Math.atan2(b_, a) * (180 / Math.PI);
    const H = h >= 0 ? h : h + 360;

    return {
        L: parseFloat(L.toFixed(3)),
        C: parseFloat(C.toFixed(3)),
        H: parseFloat(H.toFixed(3))
    };
}

export function hexToOklchString(hex: string) {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;
    const oklch = rgbToOklch(rgb.r, rgb.g, rgb.b);
    return `${oklch.L} ${oklch.C} ${oklch.H}`;
}

export function getContrastColor(hex: string) {
    const rgb = hexToRgb(hex);
    if (!rgb) return "0.985 0 0"; // Default white-ish (OKLCH)

    // Using relative luminance formula
    // L = 0.2126 * R + 0.7152 * G + 0.0722 * B
    const luminance = 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;

    // If bright, return dark text (zinc-900 equivalent: 0.145 0 0)
    // If dark, return light text (white: 1 0 0 or our foreground: 0.985 0 0)
    return luminance > 0.5 ? "0.145 0 0" : "0.985 0 0";
}
