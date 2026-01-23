import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="h-9 w-32 mb-2" />
                    <Skeleton className="h-5 w-56" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-9 w-32" />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="rounded-xl border bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden">
                        <Skeleton className="aspect-video w-full" />
                        <div className="p-4 space-y-4">
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-5 w-24" />
                            </div>
                            <Skeleton className="h-6 w-3/4" />
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-2/3" />
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <Skeleton className="h-8 w-20" />
                                <Skeleton className="h-8 w-16" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
