import { Skeleton } from '@/components/ui/skeleton';

export function CardSkeleton() {
  return (
    <div className="p-4 rounded-lg border border-border bg-card space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-5 rounded" />
      </div>
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="p-4 rounded-lg border border-border bg-card space-y-2">
      <Skeleton className="h-4 w-20" />
      <div className="flex items-end justify-between">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
}

export function ChartCardSkeleton() {
  return (
    <div className="p-4 rounded-lg border border-border bg-card space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-8 w-24 rounded" />
      </div>
      <Skeleton className="h-48 w-full rounded" />
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full rounded" />
        </div>
      ))}
      <Skeleton className="h-10 w-full rounded mt-6" />
    </div>
  );
}

export function ChatMessageSkeleton({ isUser = false }: { isUser?: boolean }) {
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <Skeleton className="h-8 w-8 rounded-full shrink-0" />
      <div className={`space-y-2 ${isUser ? 'items-end' : ''}`}>
        <Skeleton className="h-4 w-16" />
        <Skeleton className={`h-20 rounded-lg ${isUser ? 'w-48' : 'w-64'}`} />
      </div>
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <ChatMessageSkeleton />
      <ChatMessageSkeleton isUser />
      <ChatMessageSkeleton />
    </div>
  );
}
