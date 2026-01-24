'use client';

import { useState } from 'react';
import { Bell, Receipt, Loader2 } from 'lucide-react';
import { Button } from '@smart-menu/ui';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@smart-menu/ui';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/use-translation';

interface SessionActionsProps {
    tenantId: string;
    tableId?: string;
}

export function SessionActions({ tenantId, tableId }: SessionActionsProps) {
    const [loading, setLoading] = useState<string | null>(null);
    const supabase = createClient();
    const { t } = useTranslation();

    const handleAction = async (action: 'WAITER_CALL' | 'BILL_REQUEST') => {
        if (!tableId) {
            toast.error(t('common.error_no_table', { defaultValue: 'Please scan a table QR code first.' }));
            return;
        }

        setLoading(action);
        try {
            const channel = supabase.channel(`orders:${tenantId}`);

            await channel.subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.send({
                        type: 'broadcast',
                        event: action,
                        payload: {
                            tableId,
                            timestamp: new Date().toISOString(),
                            details: action === 'WAITER_CALL' ? 'Customer calling waiter' : 'Customer requested bill'
                        },
                    });

                    toast.success(
                        action === 'WAITER_CALL'
                            ? t('menu.waiter_called', { defaultValue: 'Waiter notified!' })
                            : t('menu.bill_requested', { defaultValue: 'Bill requested!' })
                    );
                    setLoading(null);
                    supabase.removeChannel(channel);
                }
            });

        } catch (error) {
            console.error(error);
            toast.error(t('common.error_generic', { defaultValue: 'Failed to send request.' }));
            setLoading(null);
        }
    };

    if (!tableId) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-primary/20 text-primary hover:bg-primary/10">
                    <Bell className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
                <DropdownMenuItem
                    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer focus:bg-primary/10"
                    onClick={() => handleAction('WAITER_CALL')}
                    disabled={!!loading}
                >
                    <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                        {loading === 'WAITER_CALL' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm">Chamar Garçom</span>
                        <span className="text-[10px] text-muted-foreground">Solicitar ajuda na mesa</span>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer focus:bg-primary/10"
                    onClick={() => handleAction('BILL_REQUEST')}
                    disabled={!!loading}
                >
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        {loading === 'BILL_REQUEST' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Receipt className="h-4 w-4" />}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm">Pedir a Conta</span>
                        <span className="text-[10px] text-muted-foreground">Encerrar e pagar</span>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
