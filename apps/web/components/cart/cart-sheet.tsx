"use client";

import { Button } from "@smart-menu/ui";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@smart-menu/ui";
import { Loader2 } from "lucide-react";
import { useCart } from "./cart-context";
import { useCartAnimation } from "./cart-animation-context";
import { AnimatedCartIcon } from "./animated-cart-icon";
import { CartItem } from "./cart-item";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/use-translation";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { formatCurrency } from "@/lib/utils";

export function CartSheet() {
    const { t } = useTranslation();
    const { items, totalAmount, totalItems, tenantId, organizationId, clearCart, isCartOpen, openCart, closeCart } = useCart();
    const { registerCartIcon, animatingItem } = useCartAnimation();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleCheckout = async () => {
        if (items.length === 0 || !tenantId || !organizationId) return;

        setIsSubmitting(true);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const response = await fetch(`${API_URL}/public/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tenantId,
                    organizationId,
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
                throw new Error(t("cart.error_sending") || 'Falha ao enviar pedido');
            }

            const createdOrder = await response.json();

            // Save order ID to localStorage for history
            const ordersKey = `smartmenu_orders_${tenantId}`;
            const existingOrders = JSON.parse(localStorage.getItem(ordersKey) || '[]');
            existingOrders.unshift({ id: createdOrder.id, createdAt: createdOrder.createdAt });
            localStorage.setItem(ordersKey, JSON.stringify(existingOrders.slice(0, 10))); // Keep last 10

            toast.success(t("cart.success"), {
                description: t("cart.success_desc"),
            });

            clearCart();
            closeCart();

            // Redirect to Order Status Page
            router.push(`/menu/${tenantId}/orders/${createdOrder.id}`);
        } catch (error) {
            console.error("Order error:", error);
            toast.error(t("cart.error") || "Erro ao enviar pedido", {
                description: t("cart.error_desc") || "Ocorreu um problema técnico. Por favor, tente novamente.",
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
                    className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-[var(--z-sticky-cta)] flex items-center justify-center p-0 overflow-visible"
                    ref={registerCartIcon}
                >
                    <AnimatedCartIcon state={iconState} itemCount={totalItems} />
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>{t("cart.title")}</SheetTitle>
                    <SheetDescription>
                        {t("cart.description")}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto my-4 pr-2">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                            <AnimatedCartIcon state="idle" itemCount={0} className="mb-2 opacity-50 scale-150" />
                            <p>{t("cart.empty")}</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {items.map((item) => (
                                <CartItem key={`${item.productId}-${item.variantId}`} item={item} />
                            ))}
                        </div>
                    )}
                </div>

                <SheetFooter className="mt-auto border-t pt-4">
                    <div className="w-full space-y-4">
                        <div className="flex justify-between items-center text-lg font-bold">
                            <span>{t("cart.total")}</span>
                            <span className="text-primary">
                                {formatCurrency(totalAmount)}
                            </span>
                        </div>
                        <Button
                            className="w-full h-12 text-base font-semibold"
                            disabled={items.length === 0 || isSubmitting}
                            onClick={handleCheckout}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t("cart.sending")}
                                </>
                            ) : (
                                t("cart.checkout")
                            )}
                        </Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
