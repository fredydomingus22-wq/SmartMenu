"use client";

import { Button } from "@smart-menu/ui/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@smart-menu/ui/components/ui/sheet";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@smart-menu/ui/components/ui/dialog";
import { Label } from "@smart-menu/ui/components/ui/label";
import { Input } from "@smart-menu/ui/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@smart-menu/ui/components/ui/radio-group";
import { Loader2, QrCode as QrIcon, ShoppingBag, Gift } from "lucide-react";
import { useCart, OrderType, LoyaltyReward } from "./cart-context";
import { useCartAnimation } from "./cart-animation-context";
import { AnimatedCartIcon } from "./animated-cart-icon";
import { CartItem } from "./cart-item";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatCurrency, LoyaltyConfig } from "@smart-menu/ui";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { UpsellSection } from "../automation/upsell-section";

export function CartSheet() {
    const {
        items, totalAmount, totalItems, tenantId, organizationId,
        clearCart, isCartOpen, openCart, closeCart,
        tableId, orderType
    } = useCart();
    const { registerCartIcon, animatingItem } = useCartAnimation();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const supabase = createClient();

    // Order Type Selection State
    const [isOrderTypeOpen, setIsOrderTypeOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<OrderType>('DINE_IN_GENERAL');
    const [manualTableId, setManualTableId] = useState("");
    // Takeaway Form State
    const [takeawayForm, setTakeawayForm] = useState({
        municipality: "", neighborhood: "", street: "", phone: "", notes: ""
    });

    // ... rest of existing code between these sections stays the same

    const handleCheckoutWithSelection = async () => {
        if (selectedType === 'DINE_IN_GENERAL' && !manualTableId) {
            toast.error("Por favor, selecione a sua mesa.");
            return;
        }
        if (selectedType === 'TAKEAWAY') {
            if (!takeawayForm.municipality) {
                toast.error("Por favor, indique o município.");
                return;
            }
            if (!takeawayForm.neighborhood) {
                toast.error("Por favor, indique o bairro.");
                return;
            }
            if (!takeawayForm.street) {
                toast.error("Por favor, indique a rua ou zona de referência.");
                return;
            }
            if (!takeawayForm.phone) {
                toast.error("Por favor, indique o contacto telefónico.");
                return;
            }
        }

        const finalTableId = selectedType === 'DINE_IN_GENERAL' ? manualTableId : null;
        const finalAddress = selectedType === 'TAKEAWAY'
            ? `${takeawayForm.municipality}, ${takeawayForm.neighborhood}, ${takeawayForm.street}${takeawayForm.notes ? ` (${takeawayForm.notes})` : ''}`
            : null;
        const finalPhone = selectedType === 'TAKEAWAY' ? takeawayForm.phone : null;

        await processCheckout(finalTableId, selectedType, finalAddress, finalPhone);
        setIsOrderTypeOpen(false);
    };

    const { appliedReward, applyReward, removeReward } = useCart();
    const [userPoints, setUserPoints] = useState(0);
    const [availableRewards, setAvailableRewards] = useState<LoyaltyReward[]>([]);
    const [loyaltyConfig, setLoyaltyConfig] = useState<LoyaltyConfig | null>(null);

    // Table Selection Data
    const [availableTables, setAvailableTables] = useState<{ id: string, number: number }[]>([]);
    const [isLoadingTables, setIsLoadingTables] = useState(false);
    const [tableSearchTerm, setTableSearchTerm] = useState("");

    const filteredTables = availableTables.filter(t =>
        t.number.toString().includes(tableSearchTerm)
    );

    useEffect(() => {
        const fetchTables = async () => {
            if (!tenantId || !isOrderTypeOpen) return;
            setIsLoadingTables(true);
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const response = await fetch(`${API_URL}/public/menu/${tenantId}/tables`);
                if (response.ok) {
                    const data = await response.json();
                    setAvailableTables(data);
                }
            } catch (e) {
                console.warn("Failed to fetch tables", e);
            } finally {
                setIsLoadingTables(false);
            }
        };
        fetchTables();
    }, [tenantId, isOrderTypeOpen]);

    useEffect(() => {
        const fetchLoyaltyData = async () => {
            if (!user || !tenantId) return;
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const headers = { Authorization: `Bearer ${session?.access_token}` };

                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const [pointsData, rewardsData, configData] = await Promise.all([
                    fetch(`${API_URL}/loyalty/my-points?tenantId=${tenantId}`, { headers }).then(r => r.json()),
                    fetch(`${API_URL}/loyalty/rewards/public?tenantId=${tenantId}`).then(r => r.json()),
                    fetch(`${API_URL}/loyalty/config/public?tenantId=${tenantId}`).then(r => r.json())
                ]);

                setUserPoints(pointsData?.points || 0);
                setAvailableRewards(rewardsData || []);
                setLoyaltyConfig(configData);
            } catch (e) {
                console.warn("Failed to fetch loyalty data for cart", e);
            }
        };
        fetchLoyaltyData();
    }, [user, tenantId, supabase]);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
        };
        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    // Determine icon state
    let iconState: "idle" | "active" | "success" = "idle";
    if (animatingItem) iconState = "active";
    if (isCartOpen && !animatingItem) iconState = "success"; // Simple heuristic, or maybe "success" just after animation

    // Better logic: Context could tell us "impact" moment, but for now:
    // If animatingItem is present -> active (open lid)
    // If we just finished an addition (isCartOpen is true due to peek) -> success (bounce)
    // Otherwise -> idle

    // Let's refine based on isCartOpen usage as "Peek"
    if (isCartOpen) {
        iconState = "success";
    } else if (animatingItem) {
        iconState = "active";
    }

    const handleCheckoutInit = () => {
        if (items.length === 0) return;

        // If we already have a tableId (from QR), proceed directly
        if (tableId) {
            handleCheckoutDirect();
        } else {
            // Otherwise, open selection modal
            setIsOrderTypeOpen(true);
        }
    };

    const handleCheckoutDirect = async () => {
        await processCheckout(tableId, orderType || 'DINE_IN', null);
    };




    const processCheckout = async (finalTableId: string | null, finalOrderType: OrderType, finalAddress: string | null, finalPhone: string | null = null) => {
        if (!tenantId || !organizationId) return;

        setIsSubmitting(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const response = await fetch(`${API_URL}/public/orders`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    tenantId,
                    organizationId,
                    tableId: finalTableId,
                    orderType: finalOrderType,
                    deliveryAddress: finalAddress,
                    deliveryPhone: finalPhone,
                    loyaltyRewardId: appliedReward?.id,
                    items: items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        notes: item.notes,
                        options: item.options?.map(o => ({
                            valueId: o.valueId,
                            price: o.price
                        }))
                    }))
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Falha ao enviar pedido');
            }

            const createdOrder = await response.json();

            // Save order ID to localStorage for history
            const ordersKey = `smartmenu_orders_${tenantId}`;
            const existingOrders = JSON.parse(localStorage.getItem(ordersKey) || '[]');
            existingOrders.unshift({ id: createdOrder.id, createdAt: createdOrder.createdAt });
            localStorage.setItem(ordersKey, JSON.stringify(existingOrders.slice(0, 10))); // Keep last 10

            toast.success("Pedido enviado com sucesso!", {
                description: "Acompanhe o status em tempo real.",
            });

            clearCart();
            closeCart();

            // Redirect to Order Status Page
            router.push(`/menu/${tenantId}/orders/${createdOrder.id}`);
        } catch (error: unknown) {
            console.error("Order error:", error);
            const err = error as Error;
            const errorMessage = err.message === 'Falha ao enviar pedido'
                ? "Não foi possível processar o seu pedido no servidor."
                : "Ocorreu um problema técnico. Por favor, tente novamente.";

            toast.error("Erro ao enviar pedido", {
                description: errorMessage,
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    const hasMounted = useHasMounted();

    if (!hasMounted) return null;

    return (
        <Sheet open={isCartOpen} onOpenChange={(open) => open ? openCart() : closeCart()}>
            <SheetTrigger asChild>
                <Button
                    variant="default"
                    size="lg"
                    className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-6 h-14 w-14 rounded-full shadow-lg z-50 flex items-center justify-center p-0 overflow-visible"
                    ref={registerCartIcon}
                >
                    <AnimatedCartIcon state={iconState} itemCount={totalItems} />
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>Seu Pedido</SheetTitle>
                    <SheetDescription>
                        Revise seus itens antes de confirmar.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto my-4 pr-2">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                            <AnimatedCartIcon state="idle" itemCount={0} className="mb-2 opacity-50 scale-150" />
                            <p>Seu carrinho está vazio</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {items.map((item) => (
                                <CartItem key={`${item.productId}-${item.variantId}`} item={item} />
                            ))}

                            {/* AI Upsell Suggestions */}
                            {tenantId && <UpsellSection tenantId={tenantId} />}
                        </div>
                    )}
                </div>

                <SheetFooter className="mt-auto border-t pt-4">
                    <div className="w-full space-y-4">
                        {!user && items.length > 0 && (
                            <div className="bg-primary/5 rounded-lg p-3 text-center border border-primary/10">
                                <p className="text-xs font-medium text-primary">
                                    <button
                                        onClick={() => router.push(`/login?tenantId=${tenantId}&returnUrl=${encodeURIComponent(window.location.pathname)}`)}
                                        className="underline font-bold"
                                    >
                                        Faça login
                                    </button> neste pedido para ganhar pontos de fidelidade!
                                </p>
                            </div>
                        )}

                        {user && items.length > 0 && availableRewards.length > 0 && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm font-semibold">
                                        <Gift className="h-4 w-4 text-amber-600" />
                                        <span>Recompensas Disponíveis</span>
                                    </div>
                                    <span className="text-xs font-medium text-muted-foreground">{userPoints} pts</span>
                                </div>
                                <div className="space-y-2">
                                    {availableRewards.map((reward) => {
                                        const isApplied = appliedReward?.id === reward.id;
                                        const canAfford = userPoints >= reward.pointsRequired;

                                        return (
                                            <div
                                                key={reward.id}
                                                className={`flex items-center justify-between p-2 rounded-lg border text-xs transition-colors ${isApplied
                                                    ? 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/50'
                                                    : 'border-zinc-100 dark:border-zinc-800'
                                                    }`}
                                            >
                                                <div className="flex-1">
                                                    <p className="font-bold">{reward.name}</p>
                                                    <p className="text-muted-foreground">{reward.pointsRequired} pontos</p>
                                                </div>
                                                {isApplied ? (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 text-red-500 hover:text-red-600 px-2"
                                                        onClick={() => removeReward()}
                                                    >
                                                        Remover
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-7 border-amber-600 text-amber-600 hover:bg-amber-50 px-2"
                                                        disabled={!canAfford}
                                                        onClick={() => applyReward(reward)}
                                                    >
                                                        Usar
                                                    </Button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between items-center text-lg font-bold">
                            <div className="flex flex-col">
                                <span>Total</span>
                                {appliedReward && (
                                    <span className="text-xs font-normal text-emerald-600 line-through opacity-70">
                                        {formatCurrency(items.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
                                    </span>
                                )}
                            </div>
                            <span className="text-primary">
                                {formatCurrency(totalAmount)}
                            </span>
                        </div>

                        {loyaltyConfig?.isActive && (
                            <div className="flex items-center justify-between py-1 px-3 bg-orange-50 dark:bg-orange-950/20 rounded-md border border-orange-100 dark:border-orange-900/50">
                                <div className="flex items-center gap-2">
                                    <Gift className="h-3.5 w-3.5 text-orange-600" />
                                    <span className="text-[10px] font-bold text-orange-700 dark:text-orange-400">
                                        LOIALDADE
                                    </span>
                                </div>
                                <span className="text-xs font-semibold text-orange-700 dark:text-orange-400">
                                    + {Math.floor((totalAmount / Number(loyaltyConfig.currencyUnit)) * Number(loyaltyConfig.pointsPerUnit))} pts
                                </span>
                            </div>
                        )}
                        <Button
                            className="w-full h-12 text-base font-semibold"
                            disabled={items.length === 0 || isSubmitting}
                            onClick={handleCheckoutInit}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Enviando...
                                </>
                            ) : (
                                "Finalizar Pedido"
                            )}
                        </Button>
                    </div>
                </SheetFooter>
            </SheetContent>

            {/* Order Type Selection Dialog */}
            <Dialog open={isOrderTypeOpen} onOpenChange={setIsOrderTypeOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Como deseja receber seu pedido?</DialogTitle>
                        <DialogDescription>
                            Selecione uma opção para continuar.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <RadioGroup
                            value={selectedType}
                            onValueChange={(val) => setSelectedType(val as OrderType)}
                            className="grid grid-cols-2 gap-4"
                        >
                            <div>
                                <RadioGroupItem value="DINE_IN_GENERAL" id="dine-in" className="peer sr-only" />
                                <Label
                                    htmlFor="dine-in"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                    <QrIcon className="mb-3 h-6 w-6" />
                                    Comer aqui
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="TAKEAWAY" id="takeaway" className="peer sr-only" />
                                <Label
                                    htmlFor="takeaway"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                    <ShoppingBag className="mb-3 h-6 w-6" />
                                    Takeaway
                                </Label>
                            </div>
                        </RadioGroup>

                        {selectedType === 'DINE_IN_GENERAL' && (
                            <div className="grid gap-3">
                                <Label htmlFor="table-search">Nº da Mesa</Label>
                                <div className="space-y-3">
                                    <Input
                                        id="table-search"
                                        placeholder="Pesquisar mesa (ex: 5)..."
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        value={tableSearchTerm}
                                        onChange={(e) => setTableSearchTerm(e.target.value)}
                                        className="h-12 text-lg"
                                        autoComplete="off"
                                    />

                                    <div className="relative">
                                        {isLoadingTables ? (
                                            <div className="flex items-center justify-center p-8">
                                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                            </div>
                                        ) : (
                                            <div className="h-[200px] overflow-y-auto border rounded-md p-2 bg-zinc-50 dark:bg-zinc-900/50 overscroll-contain">
                                                <div className="grid grid-cols-3 gap-3">
                                                    {filteredTables.map((table) => {
                                                        const isSelected = manualTableId === table.id;
                                                        return (
                                                            <button
                                                                key={table.id}
                                                                type="button"
                                                                onClick={() => setManualTableId(table.id)}
                                                                className={`h-16 flex items-center justify-center rounded-xl border-2 transition-all font-bold text-xl active:scale-95 active:opacity-80 touch-manipulation ${isSelected
                                                                    ? 'border-primary bg-primary text-white shadow-md'
                                                                    : 'border-transparent bg-white dark:bg-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300 shadow-sm'
                                                                    }`}
                                                            >
                                                                {table.number}
                                                            </button>
                                                        );
                                                    })}
                                                    {filteredTables.length === 0 && (
                                                        <div className="col-span-3 py-8 text-center text-sm text-muted-foreground">
                                                            Nenhuma mesa encontrada
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {!manualTableId && !isLoadingTables && availableTables.length > 0 && (
                                            <div className="mt-2 text-center">
                                                <p className="text-xs text-muted-foreground italic">Selecione uma mesa acima</p>
                                            </div>
                                        )}
                                        {manualTableId && (
                                            <div className="mt-2 flex items-center justify-center gap-2 text-primary font-semibold">
                                                <span className="text-xs">Mesa Selecionada:</span>
                                                <span className="text-sm px-3 py-1 bg-primary/20 rounded-full">
                                                    {availableTables.find(t => t.id === manualTableId)?.number}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedType === 'TAKEAWAY' && (
                            <div className="grid gap-3 pt-2">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="municipality" className="text-xs font-bold text-zinc-500">Município</Label>
                                        <Input
                                            id="municipality"
                                            placeholder="Ex: Luanda"
                                            value={takeawayForm.municipality}
                                            onChange={(e) => setTakeawayForm({ ...takeawayForm, municipality: e.target.value })}
                                            className="h-12"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="neighborhood" className="text-xs font-bold text-zinc-500">Bairro</Label>
                                        <Input
                                            id="neighborhood"
                                            placeholder="Ex: Maianga"
                                            value={takeawayForm.neighborhood}
                                            onChange={(e) => setTakeawayForm({ ...takeawayForm, neighborhood: e.target.value })}
                                            className="h-12"
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-1.5">
                                    <Label htmlFor="street" className="text-xs font-bold text-zinc-500">Rua / Zona de Referência</Label>
                                    <Input
                                        id="street"
                                        placeholder="Ex: Rua Comandante Gika, perto da..."
                                        value={takeawayForm.street}
                                        onChange={(e) => setTakeawayForm({ ...takeawayForm, street: e.target.value })}
                                        className="h-12"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="phone" className="text-xs font-bold text-zinc-500">Contacto Telefónico</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        inputMode="tel"
                                        placeholder="+244 9..."
                                        value={takeawayForm.phone}
                                        onChange={(e) => setTakeawayForm({ ...takeawayForm, phone: e.target.value })}
                                        className="h-12"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="notes" className="text-xs font-bold text-zinc-500">Informações Extras (Opcional)</Label>
                                    <textarea
                                        id="notes"
                                        placeholder="Portão verde, 2º andar..."
                                        value={takeawayForm.notes}
                                        onChange={(e) => setTakeawayForm({ ...takeawayForm, notes: e.target.value })}
                                        className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                                        rows={2}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button onClick={handleCheckoutWithSelection} className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Confirmando...
                                </>
                            ) : (
                                "Confirmar Pedido"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Sheet >
    );
}
