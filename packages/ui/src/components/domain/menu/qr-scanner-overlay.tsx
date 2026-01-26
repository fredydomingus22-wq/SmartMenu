"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { X, Camera, Zap, ZapOff } from "lucide-react";
import { Button } from "../../ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface QRScannerOverlayProps {
    onScanSuccess: (decodedText: string) => void;
    onClose: () => void;
}

export function QRScannerOverlay({ onScanSuccess, onClose }: QRScannerOverlayProps) {
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const [isFlashOn, setIsFlashOn] = useState(false);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "qr-reader",
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0,
                formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
            },
            /* verbose= */ false
        );

        scanner.render(
            (decodedText) => {
                scanner.clear();
                onScanSuccess(decodedText);
            },
            (error) => {
                // Ignore silent errors
            }
        );

        scannerRef.current = scanner;

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(console.error);
            }
        };
    }, [onScanSuccess]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[var(--z-modal)] bg-black flex flex-col items-center justify-center p-6"
        >
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-xl">
                        <Camera className="w-5 h-5 text-white" />
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-xl transition-all hover:bg-white/20 active:scale-95"
                >
                    <X className="w-5 h-5 text-white" />
                </button>
            </div>

            <div className="relative w-full max-w-[320px] aspect-square rounded-[2rem] overflow-hidden border-2 border-white/20">
                <div id="qr-reader" className="w-full h-full" />

                {/* Scanner UI Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 border-[40px] border-black/60" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border-2 border-orange-500 rounded-2xl shadow-[0_0_20px_rgba(249,115,22,0.5)]">
                        {/* Scanning Line Animation */}
                        <motion.div
                            animate={{ top: ["10%", "90%"] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute left-4 right-4 h-0.5 bg-orange-500/80 shadow-[0_0_10px_rgba(249,115,22,1)]"
                        />

                        {/* Corner Accents */}
                        <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-orange-500 rounded-tl-xl" />
                        <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-orange-500 rounded-tr-xl" />
                        <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-orange-500 rounded-bl-xl" />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-orange-500 rounded-br-xl" />
                    </div>
                </div>
            </div>

            <div className="mt-12 text-center space-y-4">
                <h3 className="text-xl font-bold text-white tracking-tight uppercase italic">Posicione o QR Code</h3>
                <p className="text-white/60 text-sm max-w-[200px] mx-auto leading-relaxed">
                    Aponte para o código na mesa para abrir o cardápio automaticamente.
                </p>
            </div>

            <div className="absolute bottom-12 flex flex-col items-center gap-6">
                <div className="flex items-center gap-4">
                    <button className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/10 transition-all hover:bg-white/20 active:scale-95">
                        <Zap className="w-6 h-6 text-white" />
                    </button>
                </div>

                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            </div>
        </motion.div>
    );
}
