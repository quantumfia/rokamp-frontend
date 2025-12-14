import { cn } from '@/lib/utils';

interface RiskGaugeProps {
  value: number; // 0-100
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

export function RiskGauge({ value, label, size = 'md' }: RiskGaugeProps) {
  const getRiskLevel = (val: number) => {
    if (val < 25) return { level: '안전', color: 'text-risk-safe', bg: 'stroke-risk-safe' };
    if (val < 50) return { level: '관심', color: 'text-risk-caution', bg: 'stroke-risk-caution' };
    if (val < 75) return { level: '주의', color: 'text-risk-warning', bg: 'stroke-risk-warning' };
    return { level: '경고', color: 'text-risk-danger', bg: 'stroke-risk-danger' };
  };

  const risk = getRiskLevel(value);
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  const sizeConfig = {
    sm: { wrapper: 'w-20 h-20', text: 'text-lg', label: 'text-xs' },
    md: { wrapper: 'w-28 h-28', text: 'text-2xl', label: 'text-sm' },
    lg: { wrapper: 'w-36 h-36', text: 'text-3xl', label: 'text-base' },
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
            r="45"
            fill="none"
            strokeWidth="8"
            className="stroke-muted"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            className={cn('transition-all duration-1000', risk.bg)}
            style={{
              strokeDasharray,
              strokeDashoffset,
            }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('font-bold', config.text, risk.color)}>
            {value}%
          </span>
          <span className={cn('font-medium', risk.color, config.label)}>
            {risk.level}
          </span>
        </div>
      </div>
      <p className="mt-2 text-sm text-muted-foreground font-medium">{label}</p>
    </div>
  );
}
