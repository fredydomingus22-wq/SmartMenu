'use client';

import { QRCodeCanvas } from 'qrcode.react';
import { Button } from '@/components/ui/button';
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
        ? `${window.location.origin}/menu/${tenantId}`
        : '';

    const downloadQRCode = () => {
        const canvas = canvasRef.current?.querySelector('canvas');
        if (canvas) {
            const url = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `menu-qr-${tenantId}.png`;
            link.href = url;
            link.click();
            toast.success('QR Code descarregado com sucesso!');
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
        <div className="flex flex-col items-center gap-6 p-6 border rounded-2xl bg-white dark:bg-zinc-950 dark:border-zinc-800 shadow-sm">
            <div ref={canvasRef} className="p-4 bg-white rounded-xl shadow-inner border border-zinc-100">
                <QRCodeCanvas
                    value={menuUrl}
                    size={256}
                    level="H"
                    marginSize={2}
                />
            </div>

            <div className="w-full space-y-3">
                <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                    Seu menu está disponível em:
                    <br />
                    <span className="text-zinc-900 dark:text-zinc-200 break-all select-all">{menuUrl}</span>
                </p>

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
