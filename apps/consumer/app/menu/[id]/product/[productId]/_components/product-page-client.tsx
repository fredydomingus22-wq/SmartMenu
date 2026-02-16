"use client";

import { useState, useMemo, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, Minus, Plus, Loader2, Check, Share2, Heart, Star } from "lucide-react";
import { Button, getTranslatedValue, formatCurrency, Slider, useCartAnimation } from "@smart-menu/ui";
import { useCart } from "@/components/cart/cart-context";
import { useTranslation } from "@/hooks/use-translation";
import { Product } from "@smart-menu/ui";

interface ProductPageClientProps {
    product: Product;
    tenantId: string;
}

export function ProductPageClient({ product }: ProductPageClientProps) {
    const router = useRouter();
    const { locale } = useTranslation();
    const { addItem } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [success, setSuccess] = useState(false);
    const [spicy, setSpicy] = useState([50]);

    const totalPrice = useMemo(() => {
        const basePrice = typeof product.price === "string" ? parseFloat(product.price) : Number(product.price);
        return basePrice * quantity;
    }, [product, quantity]);

    const { startAnimation } = useCartAnimation();
    const imageRef = useRef<HTMLImageElement>(null);

    const handleAddToCart = () => {
        setIsAdding(true);
        
        // Trigger Animation
        if (imageRef.current) {
            const rect = imageRef.current.getBoundingClientRect();
            startAnimation({
                src: product.imageUrl || "/placeholder-food.jpg",
                startRect: rect,
            });
        }

        try {
            const basePrice = typeof product.price === "string" ? parseFloat(product.price) : Number(product.price);
            addItem({
                productId: product.id,
                name: getTranslatedValue(product.name, locale),
                price: basePrice,
                imageUrl: product.imageUrl || undefined,
                quantity,
                notes: "",
                options: []
            });
            setIsAdding(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 1000);
        } catch (error) {
            console.error("Error adding to cart:", error);
            setIsAdding(false);
        }
    };

    return (
        <div className="min-h-[100dvh] bg-white flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between p-6">
                <button 
                    onClick={() => router.back()}
                    className="p-3 bg-zinc-100 rounded-2xl text-zinc-900 hover:bg-zinc-200 transition-colors"
                >
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <div className="flex gap-2">
                    <button className="p-3 bg-zinc-100 rounded-2xl text-zinc-900 hover:bg-zinc-200 transition-colors">
                        <Share2 className="h-6 w-6" />
                    </button>
                    <button className="p-3 bg-zinc-100 rounded-2xl text-zinc-900 hover:bg-zinc-200 transition-colors">
                        <SearchIcon className="h-6 w-6" />
                    </button>
                </div>
            </header>

            {/* Product Image Section */}
            <div className="relative flex-[0.8] flex items-center justify-center p-8">
                <div className="relative w-full aspect-square max-w-[320px] drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] hover:scale-105 transition-transform duration-500">
                    <Image
                        src={product.imageUrl || "/placeholder-food.jpg"}
                        alt={getTranslatedValue(product.name, locale)}
                        fill
                        className="object-contain"
                        priority
                        ref={imageRef}
                    />
                </div>
            </div>

            {/* Content Bottom Sheet Styling */}
            <div className="bg-zinc-50 rounded-t-[3rem] p-8 space-y-8 shadow-[0_-20px_50px_rgba(0,0,0,0.05)] flex-1 overflow-y-auto pb-32">
                <div className="space-y-4">
                    <div className="flex items-start justify-between">
                        <h2 className="text-3xl font-black text-zinc-900 tracking-tight leading-tight max-w-[75%]">
                            {getTranslatedValue(product.name, locale)}
                        </h2>
                        <button className="p-3 bg-primary rounded-2xl text-white shadow-lg shadow-primary/20 hover:scale-110 active:scale-95 transition-transform">
                            <Heart className="h-6 w-6 fill-current" />
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm border border-zinc-100">
                            <Star className="h-4 w-4 fill-primary text-primary" />
                            <span className="text-sm font-black text-zinc-900">4.9</span>
                        </div>
                        <span className="text-sm font-bold text-zinc-400">26 mins</span>
                    </div>

                    <p className="text-zinc-500 font-medium leading-relaxed italic">
                        {getTranslatedValue(product.description, locale) || "This is a classic fast food burger that packs a punch of flavor in every bite."}
                    </p>
                </div>

                {/* Spicy Selector (Figma Feature) */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                        <span>Spiciness Level</span>
                    </div>
                    <div className="px-2">
                        <Slider 
                            value={spicy} 
                            onValueChange={setSpicy}
                            max={100} 
                            step={1} 
                            className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-4 [&_[role=slider]]:border-white [&_[role=slider]]:shadow-lg"
                        />
                        <div className="flex justify-between mt-2 text-[10px] font-bold uppercase tracking-wider">
                            <span className="text-green-500">Mild</span>
                            <span className="text-primary">Hot</span>
                        </div>
                    </div>
                </div>

                {/* Portion Selector & Price Container */}
                <div className="flex items-center justify-between pt-4 border-t border-zinc-200/50">
                    <div className="space-y-2">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Portion</span>
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm border border-zinc-100 text-zinc-900 hover:bg-zinc-100 active:scale-95 transition-all"
                            >
                                <Minus className="h-5 w-5 stroke-[3]" />
                            </button>
                            <span className="text-xl font-black text-zinc-900 w-4 text-center">{quantity}</span>
                            <button 
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-10 h-10 flex items-center justify-center bg-primary rounded-xl shadow-lg shadow-primary/20 text-white hover:scale-105 active:scale-95 transition-all"
                            >
                                <Plus className="h-5 w-5 stroke-[3]" />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col items-end">
                         <span className="text-3xl font-black text-zinc-900 tracking-tighter">
                            {formatCurrency(totalPrice)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Sticky Order Button */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-zinc-100 z-50">
                <Button 
                    className="w-full h-16 rounded-[2rem] bg-zinc-900 text-white font-black uppercase text-sm tracking-[0.2em] hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-zinc-900/20"
                    onClick={handleAddToCart}
                    disabled={isAdding || success}
                >
                    {success ? (
                        <>
                            <Check className="h-5 w-5 mr-3" />
                            Added to Cart
                        </>
                    ) : isAdding ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        "Order Now"
                    )}
                </Button>
            </div>
        </div>
    );
}

function SearchIcon({ className }: { className?: string }) {
    return (
        <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    )
}


