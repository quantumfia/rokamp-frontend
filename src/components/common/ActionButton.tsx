import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActionButtonProps {
  label?: string;
  onClick: () => void;
  className?: string;
}

export function ActionButton({ label = '새로 추가', onClick, className }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium',
        'bg-primary text-primary-foreground rounded',
        'hover:bg-primary/90 transition-colors',
        className
      )}
    >
      <Plus className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}
