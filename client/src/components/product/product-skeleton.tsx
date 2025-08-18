import { Card, CardContent } from "@/components/ui/card";

export default function ProductSkeleton() {
  return (
    <Card className="w-full overflow-hidden">
      <div className="relative">
        <div className="skeleton h-48 w-full rounded-t-lg"></div>
        <div className="absolute top-2 right-2">
          <div className="skeleton h-8 w-16 rounded-full"></div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="skeleton h-4 w-3/4 mb-2 rounded"></div>
        <div className="skeleton h-3 w-full mb-1 rounded"></div>
        <div className="skeleton h-3 w-2/3 mb-4 rounded"></div>
        
        <div className="flex items-center justify-between">
          <div className="skeleton h-6 w-20 rounded"></div>
          <div className="skeleton h-8 w-8 rounded-full"></div>
        </div>
      </CardContent>
    </Card>
  );
}