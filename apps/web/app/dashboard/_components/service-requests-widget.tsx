'use client';

import { useState, useEffect } from 'react';
import { Bell, Check } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    Button,
    Badge,
    ScrollArea,
    toast
} from '@smart-menu/ui';
import { apiClient } from '@/utils/api-client';
import { useTranslation } from '@/hooks/use-translation';

interface ServiceRequest {
    id: string;
    type: 'CALL_WAITER' | 'REQUEST_BILL';
    status: 'PENDING' | 'COMPLETED';
    created_at: string;
    table?: { number: string; id: string };
    table_id?: string;
    tenant_id: string;
}

export function ServiceRequestsWidget({ tenantId }: { tenantId: string }) {
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const supabase = createClient();
    const { t } = useTranslation();

    useEffect(() => {
        // ... (keep fetch logic)
        const fetchRequests = async () => {
            try {
                const data = await apiClient.get<ServiceRequest[]>('/service-requests');
                setRequests(data || []);
            } catch (error) {
                console.error('Failed to fetch service requests', error);
            }
        };
        fetchRequests();

        // Subscribe to Realtime
        const channel = supabase
            .channel('service-requests')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'service_requests',
                    filter: `tenant_id=eq.${tenantId}`,
                },
                (payload) => {
                    const newRequest = payload.new as ServiceRequest;
                    fetchRequests();
                    toast.info(newRequest.type === 'CALL_WAITER'
                        ? t('dashboard.service_requests.waiter_called')
                        : t('dashboard.service_requests.bill_requested')
                    );
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [tenantId, supabase, t]);

    const handleComplete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await apiClient.patch(`/service-requests/${id}/complete`, {});
            setRequests((prev) => prev.filter((r) => r.id !== id));
            toast.success(t('dashboard.service_requests.completed'));
        } catch {
            toast.error(t('dashboard.service_requests.error'));
        }
    };

    const pendingCount = requests.filter(r => r.status === 'PENDING').length;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {pendingCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 rounded-full text-[10px]"
                        >
                            {pendingCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>{t('dashboard.service_requests.title')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ScrollArea className="h-[300px]">
                    {requests.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            {t('dashboard.service_requests.empty')}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1 p-1">
                            {requests.map((request) => (
                                <div
                                    key={request.id}
                                    className="flex items-center justify-between p-3 rounded-md bg-muted/50 text-sm"
                                >
                                    <div className="flex flex-col">
                                        <span className="font-semibold">
                                            {request.type === 'CALL_WAITER'
                                                ? t('dashboard.service_requests.waiter_label')
                                                : t('dashboard.service_requests.bill_label')}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {t('dashboard.service_requests.table_prefix')} {request.table?.number || request.table_id?.slice(0, 4) || '?'} • {new Date(request.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                        onClick={(e) => handleComplete(request.id, e)}
                                    >
                                        <Check className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
