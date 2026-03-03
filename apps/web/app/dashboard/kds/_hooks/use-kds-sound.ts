"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Custom hook for KDS audio alerts using the Web Audio API.
 * Avoids external audio files and corrupt base64 data.
 * Requires user interaction to init (browser autoplay policy).
 */
export function useKDSSound() {
    const [isEnabled, setIsEnabled] = useState(true); // Enabled by default as requested
    const audioCtxRef = useRef<AudioContext | null>(null);

    // Initialize AudioContext (requires user gesture)
    const initAudio = useCallback(() => {
        if (typeof window === "undefined") return;
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        // Resume if suspended (Chrome autoplay policy)
        if (audioCtxRef.current.state === "suspended") {
            audioCtxRef.current.resume();
        }
        setIsEnabled(true);
    }, []);

    // Effect to auto-initialize/resume on first click anywhere in the UI
    useEffect(() => {
        if (typeof window === "undefined") return;
        const handleInteraction = () => {
            initAudio();
            // Remove listeners after first success
            window.removeEventListener("click", handleInteraction);
            window.removeEventListener("keydown", handleInteraction);
        };
        window.addEventListener("click", handleInteraction);
        window.addEventListener("keydown", handleInteraction);
        return () => {
            window.removeEventListener("click", handleInteraction);
            window.removeEventListener("keydown", handleInteraction);
        };
    }, [initAudio]);

    /**
     * Plays a beep using the Web Audio API oscillator.
     * @param frequency Hz
     * @param duration seconds
     * @param when AudioContext time offset
     */
    const playBeep = useCallback((frequency: number, duration: number, when: number) => {
        const ctx = audioCtxRef.current;
        if (!ctx) return;

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, when);

        // Fade in + out for a pleasant sound
        gainNode.gain.setValueAtTime(0, when);
        gainNode.gain.linearRampToValueAtTime(0.4, when + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, when + duration);

        oscillator.start(when);
        oscillator.stop(when + duration);
    }, []);

    // Double-beep for new order (pleasant and noticeable)
    const playNewOrder = useCallback(() => {
        if (!isEnabled || !audioCtxRef.current) return;
        const now = audioCtxRef.current.currentTime;
        playBeep(880, 0.15, now);        // First beep: A5
        playBeep(1100, 0.2, now + 0.2);  // Second beep: C#6 (slightly higher)
    }, [isEnabled, playBeep]);

    // Single alert beep
    const playAlert = useCallback(() => {
        if (!isEnabled || !audioCtxRef.current) return;
        const now = audioCtxRef.current.currentTime;
        playBeep(660, 0.3, now); // E5
    }, [isEnabled, playBeep]);

    return {
        isEnabled,
        initAudio,
        playNewOrder,
        playAlert,
    };
}
