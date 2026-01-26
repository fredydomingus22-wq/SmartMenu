"use client";

import { Skeleton } from "@smart-menu/ui";

// Re-export shared ProductCardSkeleton
export { ProductCardSkeleton } from "@smart-menu/ui";


export function PDPSkeleton() {
    return (
        <div className="min-h-screen bg-background flex flex-col lg:flex-row">
            {/* Gallery Skeleton */}
            <div className="w-full lg:w-1/2 h-[45vh] lg:h-screen bg-muted/20 relative">
                <Skeleton className="h-full w-full" />
                <div className="absolute top-4 left-4 h-10 w-10 rounded-full bg-white/20" />
            </div>

            {/* Details Skeleton */}
            <div className="w-full lg:w-1/2 p-6 lg:p-12 space-y-10">
                <div className="space-y-3">
                    <Skeleton className="h-10 w-3/4 sm:h-12" />
                    <Skeleton className="h-8 w-1/4" />
                </div>

                <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>

                <div className="space-y-8">
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-32" />
                        <div className="grid gap-3">
                            <Skeleton className="h-14 w-full rounded-xl" />
                            <Skeleton className="h-14 w-full rounded-xl" />
                            <Skeleton className="h-14 w-full rounded-xl" />
                        </div>
                    </div>
                </div>

                {/* Global Action Bar Skeleton */}
                <div className="hidden lg:block pt-10 border-t">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-12 w-32 rounded-2xl" />
                        <Skeleton className="h-10 w-40" />
                    </div>
                    <Skeleton className="h-14 w-full rounded-2xl mt-4" />
                </div>
            </div>
        </div>
    );
}
