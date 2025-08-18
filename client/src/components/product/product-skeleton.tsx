import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function ProductSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="relative">
        <Skeleton className="w-full h-48" />
        
        {/* Badge skeletons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
        
        {/* Wishlist button skeleton */}
        <div className="absolute top-3 left-3">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
      
      <CardContent className="p-5 space-y-4">
        {/* Title skeleton */}
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        
        {/* Rating skeleton */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} className="h-4 w-4 rounded" />
            ))}
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
        
        {/* Price skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        
        {/* Button skeleton */}
        <Skeleton className="h-12 w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}