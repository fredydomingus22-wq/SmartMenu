'use client';

import { QRCodeSVG } from 'qrcode.react';
import { Button } from '../../ui/button';
import { Download, Share2 } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { toast } from 'sonner';

export function QRGenerator({ tenantId }: { tenantId: string }) {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    const menuUrl = mounted
        ? `${process.env.NEXT_PUBLIC_CONSUMER_APP_URL || 'http://localhost:3002'}/menu/${tenantId}`
        : '';

    const downloadQRCode = () => {
        // For SVG download, we might need a different approach or keep canvas for download only
        const svg = canvasRef.current?.querySelector('svg');
        if (svg) {
            const svgData = new XMLSerializer().serializeToString(svg);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.onload = () => {
                canvas.width = 1024; // High res for download
                canvas.height = 1024;
                ctx?.drawImage(img, 0, 0, 1024, 1024);
                const url = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = `menu-qr-${tenantId}.png`;
                link.href = url;
                link.click();
                toast.success('QR Code descarregado com sucesso!');
            };
            img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
        }
    };

    const shareMenu = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Confira nosso cardápio!',
                url: menuUrl,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(menuUrl);
            toast.success('Link copiado para a área de transferência!');
        }
    };

    return (
        <div className="flex flex-col items-center gap-6 p-4 sm:p-6 border rounded-2xl bg-white dark:bg-zinc-950 dark:border-zinc-800 shadow-sm w-full max-w-sm mx-auto">
            <div ref={canvasRef} className="p-4 bg-white rounded-xl shadow-inner border border-zinc-100 w-full aspect-square flex items-center justify-center overflow-hidden">
                <QRCodeSVG
                    value={menuUrl}
                    size={256}
                    level="H"
                    marginSize={2}
                    className="w-full h-full max-w-[200px] sm:max-w-full"
                />
            </div>

            <div className="w-full space-y-3">
                <div className="text-center space-y-1">
                    <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                        Seu menu está disponível em:
                    </p>
                    <p className="text-[10px] sm:text-xs text-zinc-900 dark:text-zinc-200 break-all select-all bg-muted/50 p-2 rounded-lg font-mono">
                        {menuUrl}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" onClick={downloadQRCode} className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                    </Button>
                    <Button variant="outline" onClick={shareMenu} className="w-full">
                        <Share2 className="mr-2 h-4 w-4" />
                        Partilhar
                    </Button>
                </div>
            </div>
        </div>
    );
}
