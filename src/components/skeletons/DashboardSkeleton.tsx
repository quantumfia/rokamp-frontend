import { Skeleton } from '@/components/ui/skeleton';

export function RiskSummarySkeleton() {
  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
      
      {/* Overall Risk */}
      <div className="p-4 rounded-lg bg-muted/30 space-y-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-16" />
        <Skeleton className="h-2 w-full" />
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-muted/30 space-y-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-6 w-8" />
        </div>
        <div className="p-3 rounded-lg bg-muted/30 space-y-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-6 w-8" />
        </div>
      </div>
      
      {/* Unit List */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-28 mb-3" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-2 rounded bg-muted/20">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function MapSkeleton() {
  return (
    <div className="absolute inset-0 bg-muted/20 flex items-center justify-center">
      <div className="text-center space-y-3">
        <Skeleton className="h-16 w-16 rounded-lg mx-auto" />
        <Skeleton className="h-4 w-32 mx-auto" />
        <Skeleton className="h-3 w-24 mx-auto" />
      </div>
    </div>
  );
}

export function UnitDetailSkeleton() {
  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-6 rounded" />
      </div>
      
      {/* Risk Badge */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>
      
      {/* Weather */}
      <div className="p-3 rounded-lg bg-muted/30 space-y-2">
        <Skeleton className="h-4 w-16" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
      
      {/* Training */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-2 p-2 rounded bg-muted/20">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
      
      {/* Button */}
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  );
}

export function TrendChartsSkeleton() {
  return (
    <div className="p-4">
      <div className="flex gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex-1 p-4 rounded-lg bg-muted/30 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-32 w-full rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatusHeaderSkeleton() {
  return (
    <div className="px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
  );
}

export function TickerBarSkeleton() {
  return (
    <div className="px-4 py-2 flex items-center gap-2">
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-4 w-full max-w-md" />
    </div>
  );
}
