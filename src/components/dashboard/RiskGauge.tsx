import { cn } from '@/lib/utils';

interface RiskGaugeProps {
  value: number; // 0-100
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

export function RiskGauge({ value, label, size = 'md' }: RiskGaugeProps) {
  const getRiskLevel = (val: number) => {
    if (val < 25) return { level: '안전', color: 'text-status-success', stroke: '#22c55e' };
    if (val < 50) return { level: '관심', color: 'text-status-warning', stroke: '#f59e0b' };
    if (val < 75) return { level: '주의', color: 'text-status-warning', stroke: '#f59e0b' };
    return { level: '경고', color: 'text-status-error', stroke: '#ef4444' };
  };

  const risk = getRiskLevel(value);
  const circumference = 2 * Math.PI * 42;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  const sizeConfig = {
    sm: { wrapper: 'w-16 h-16', text: 'text-sm', label: 'text-[10px]', strokeWidth: 4 },
    md: { wrapper: 'w-24 h-24', text: 'text-xl', label: 'text-xs', strokeWidth: 5 },
    lg: { wrapper: 'w-28 h-28', text: 'text-2xl', label: 'text-xs', strokeWidth: 6 },
  };

  const config = sizeConfig[size];

  return (
    <div className="flex flex-col items-center">
      <div className={cn('relative', config.wrapper)}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            strokeWidth={config.strokeWidth}
            stroke="hsl(220, 10%, 20%)"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            stroke={risk.stroke}
            className="transition-all duration-1000"
            style={{
              strokeDasharray,
              strokeDashoffset,
            }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('font-bold tabular-nums', config.text, risk.color)}>
            {value}%
          </span>
          <span className={cn('font-medium', risk.color, config.label)}>
            {risk.level}
          </span>
        </div>
      </div>
      <p className="mt-2 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
    </div>
  );
}