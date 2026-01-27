"use client";
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { X, Camera, Zap, AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface QRScannerOverlayProps {
    onScanSuccess: (decodedText: string) => void;
    onClose: () => void;
}

export function QRScannerOverlay({ onScanSuccess, onClose }: QRScannerOverlayProps) {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [isFlashOn, setIsFlashOn] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasCamera, setHasCamera] = useState<boolean | null>(null);

    useEffect(() => {
        const elementId = "qr-reader-custom";
        const scanner = new Html5Qrcode(elementId, {
            formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
            verbose: false
        });
        scannerRef.current = scanner;

        const startScanner = async () => {
            try {
                // Check if cameras exist first
                const devices = await Html5Qrcode.getCameras();
                if (!devices || devices.length === 0) {
                    setError("Nenhuma câmera encontrada.");
                    setHasCamera(false);
                    return;
                }
                setHasCamera(true);

                await scanner.start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1.0,
                    },
                    (decodedText) => {
                        scanner.stop().then(() => {
                            scannerRef.current = null;
                            onScanSuccess(decodedText);
                        }).catch(console.error);
                    },
                    () => {
                        // ignore frame scan errors
                    }
                );
            } catch (err: any) {
                console.error("Camera start error:", err);
                if (err?.name === "NotAllowedError" || err?.message?.includes("Permission")) {
                    setError("Permissão da câmera negada. Por favor, permita o acesso nas configurações do navegador.");
                } else if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
                    setError("A câmera requer conexão segura (HTTPS).");
                } else {
                    setError("Erro ao iniciar a câmera: " + (err.message || "Erro desconhecido"));
                }
            }
        };

        startScanner();

        return () => {
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().catch(console.error);
            }
        };
    }, [onScanSuccess]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-portal bg-black flex flex-col items-center justify-center p-6"
        >
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-xl">
                        <Camera className="w-5 h-5 text-white" />
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-xl transition-all hover:bg-white/20 active:scale-95 z-50 pointer-events-auto"
                >
                    <X className="w-5 h-5 text-white" />
                </button>
            </div>

            <div className="relative w-full max-w-[320px] aspect-square rounded-[2rem] overflow-hidden border-2 border-white/20 bg-black">
                <div id="qr-reader-custom" className="w-full h-full object-cover rounded-[2rem]" />

                {/* Error State */}
                {error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-zinc-900/90 z-20">
                        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                        <p className="text-white font-medium mb-4">{error}</p>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-white text-black rounded-full font-bold text-sm"
                        >
                            Fechar
                        </button>
                    </div>
                )}

                {/* Scanner UI Overlay (Only show if no error) */}
                {!error && hasCamera !== false && (
                    <div className="absolute inset-0 pointer-events-none z-10">
                        {/* We imitate the dark overlay with borders instead of full divs to keep video visible clearly */}
                        {/* This approach uses a mask-like effect or just simple corner borders to keep it clean */}

                        <div className="absolute inset-0 flex flex-col">
                            <div className="flex-1 bg-black/40"></div>
                            <div className="flex w-full h-[250px]">
                                <div className="flex-1 bg-black/40"></div>
                                <div className="w-[250px] relative border-2 border-transparent">
                                    {/* Corners */}
                                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-orange-500 rounded-tl-xl" />
                                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-orange-500 rounded-tr-xl" />
                                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-orange-500 rounded-bl-xl" />
                                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-orange-500 rounded-br-xl" />

                                    {/* Scanning Line */}
                                    <motion.div
                                        animate={{ top: ["5%", "95%"] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        className="absolute left-2 right-2 h-0.5 bg-orange-500/80 shadow-[0_0_10px_rgba(249,115,22,1)]"
                                    />
                                </div>
                                <div className="flex-1 bg-black/40"></div>
                            </div>
                            <div className="flex-1 bg-black/40"></div>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-12 text-center space-y-4">
                <h3 className="text-xl font-bold text-white tracking-tight uppercase italic">Posicione o QR Code</h3>
                <p className="text-white/60 text-sm max-w-[200px] mx-auto leading-relaxed">
                    Aponte para o código na mesa para abrir o cardápio automaticamente.
                </p>
            </div>
        </motion.div>
    );
}
