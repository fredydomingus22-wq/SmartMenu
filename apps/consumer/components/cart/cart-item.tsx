"use client";

import { Button } from "@smart-menu/ui/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem as CartItemType, useCart } from "./cart-context";
import Image from "next/image";
import { formatCurrency } from "@smart-menu/ui";

interface CartItemProps {
    item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
    const { updateQuantity, removeItem } = useCart();

    const optionsHash = item.options
        ?.map(o => o.valueId)
        .sort()
        .join(',') || '';

    return (
        <div className="flex gap-4 py-4 border-b last:border-0">
            {/* Image Placeholder or Actual Image */}
            <div className="h-16 w-16 bg-muted rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                ) : (
                    <div className="text-xs text-muted-foreground">No img</div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-sm truncate pr-2" title={item.name}>
                        {item.name}
                    </h4>
                    <span className="text-sm font-medium whitespace-nowrap">
                        {formatCurrency(item.price * item.quantity)}
                    </span>
                </div>

                {item.options && item.options.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                        {item.options.map((opt, idx) => (
                            <span key={idx} className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-medium">
                                + {opt.name}
                            </span>
                        ))}
                    </div>
                )}

                {item.notes && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1 italic">
                        Obs: {item.notes}
                    </p>
                )}

                <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1, optionsHash)}
                        >
                            <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm w-4 text-center">{item.quantity}</span>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1, optionsHash)}
                        >
                            <Plus className="h-3 w-3" />
                        </Button>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeItem(item.productId, optionsHash)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
