"use client";

import { useCallback, useRef, useState } from "react";

/**
 * Custom hook for KDS audio alerts.
 * Handles browser autoplay policies gracefully.
 */
export function useKDSSound() {
    const [isEnabled, setIsEnabled] = useState(false);
    const newOrderAudioRef = useRef<HTMLAudioElement | null>(null);
    const alertAudioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize audio elements
    const initAudio = useCallback(() => {
        if (typeof window === "undefined") return;

        // Using simple system-like beeps via Web Audio API as fallback
        // For production: use actual MP3 files from /public/sounds/
        newOrderAudioRef.current = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2NzGYkEHqN/a4qBvEjGR2bnktqB9PU5trtmwprSYk5Sq");
        alertAudioRef.current = new Audio("data:audio/wav;base64,UklGRl9vT25AAEFVRElPAABBVURJTwBGTVQgEgAAAAEAAQA8BAAAeAkAAEFJABAAAABkYXRh");

        setIsEnabled(true);
    }, []);

    const playNewOrder = useCallback(() => {
        if (!isEnabled || !newOrderAudioRef.current) return;
        newOrderAudioRef.current.currentTime = 0;
        newOrderAudioRef.current.play().catch(() => { /* Autoplay blocked */ });
    }, [isEnabled]);

    const playAlert = useCallback(() => {
        if (!isEnabled || !alertAudioRef.current) return;
        alertAudioRef.current.currentTime = 0;
        alertAudioRef.current.play().catch(() => { /* Autoplay blocked */ });
    }, [isEnabled]);

    return {
        isEnabled,
        initAudio,
        playNewOrder,
        playAlert,
    };
}
