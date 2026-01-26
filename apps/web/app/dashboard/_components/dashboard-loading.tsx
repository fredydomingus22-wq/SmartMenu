import { Skeleton } from "@smart-menu/ui";

export function DashboardLoading() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-5 w-80" />
                </div>
                <Skeleton className="h-12 w-32 rounded-xl" />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-6 rounded-3xl border bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-8 rounded-lg" />
                        </div>
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                ))}
            </div>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                <div className="lg:col-span-2 p-6 rounded-3xl border bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm space-y-6">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-[300px] w-full rounded-2xl" />
                </div>
                <div className="p-6 rounded-3xl border bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm space-y-6">
                    <Skeleton className="h-6 w-32" />
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center gap-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-3 w-2/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
