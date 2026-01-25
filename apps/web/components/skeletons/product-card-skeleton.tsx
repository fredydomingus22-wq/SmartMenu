import { Skeleton } from "@smart-menu/ui";
import { Card, CardContent, CardFooter } from "@smart-menu/ui";

export function ProductCardSkeleton() {
    return (
        <Card className="overflow-hidden border-border/50 bg-card/40 backdrop-blur-sm h-full flex flex-col">
            <div className="relative aspect-square w-full">
                <Skeleton className="h-full w-full" />
            </div>
            <CardContent className="p-4 flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="pt-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6 mt-1" />
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between items-center bg-muted/5">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-8 w-24 rounded-full" />
            </CardFooter>
        </Card>
    );
}
