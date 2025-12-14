import { TrendingUp, TrendingDown, AlertTriangle, Shield } from 'lucide-react';
import { RiskGauge } from './RiskGauge';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface RiskUnit {
  id: string;
  name: string;
  risk: number;
  trend: 'up' | 'down' | 'stable';
}

const MOCK_RISK_DATA: RiskUnit[] = [
  { id: '1', name: '제7사단 3연대', risk: 78, trend: 'up' },
  { id: '2', name: '제3사단 9연대', risk: 68, trend: 'up' },
  { id: '3', name: '제6사단 2연대', risk: 55, trend: 'stable' },
  { id: '4', name: '제1사단 11연대', risk: 45, trend: 'down' },
  { id: '5', name: '제2사단 17연대', risk: 32, trend: 'down' },
];

interface RiskSummaryPanelProps {
  onUnitClick?: (unitId: string) => void;
}

export function RiskSummaryPanel({ onUnitClick }: RiskSummaryPanelProps) {
  const { user } = useAuth();
  const overallRisk = 52;

  const getRiskColor = (val: number) => {
    if (val < 25) return 'text-status-success';
    if (val < 50) return 'text-status-warning';
    if (val < 75) return 'text-status-warning';
    return 'text-status-error';
  };

  const getRiskBarColor = (val: number) => {
    if (val < 25) return 'bg-status-success';
    if (val < 50) return 'bg-status-warning';
    if (val < 75) return 'bg-status-warning';
    return 'bg-status-error';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">위험도 요약</h3>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            {user?.role === 'ROLE_HQ' ? '전군' : user?.unit}
          </span>
        </div>
      </div>

      {/* Overall Risk Gauge */}
      <div className="px-4 py-4 border-b border-border bg-muted/30">
        <div className="flex justify-center">
          <RiskGauge value={overallRisk} label="종합 위험도" size="lg" />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-2 p-3 border-b border-border">
        <div className="p-2.5 rounded bg-status-error/10 border border-status-error/20">
          <div className="flex items-center gap-1.5 mb-1">
            <AlertTriangle className="w-3 h-3 text-status-error" />
            <span className="text-[10px] text-muted-foreground uppercase">경고</span>
          </div>
          <p className="text-xl font-bold text-status-error tabular-nums">2</p>
        </div>
        <div className="p-2.5 rounded bg-status-success/10 border border-status-success/20">
          <div className="flex items-center gap-1.5 mb-1">
            <Shield className="w-3 h-3 text-status-success" />
            <span className="text-[10px] text-muted-foreground uppercase">안전</span>
          </div>
          <p className="text-xl font-bold text-status-success tabular-nums">8</p>
        </div>
      </div>

      {/* High Risk Units List */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-3 py-2 bg-muted/50 border-b border-border sticky top-0">
          <h4 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            주의 필요 부대 TOP 5
          </h4>
        </div>
        <div className="divide-y divide-border/50">
          {MOCK_RISK_DATA.map((unit) => (
            <button
              key={unit.id}
              onClick={() => onUnitClick?.(unit.id)}
              className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors text-left group"
            >
              <div className="flex items-center gap-2.5">
                <div className={cn('w-0.5 h-6 rounded-full', getRiskBarColor(unit.risk))} />
                <span className="text-xs text-foreground group-hover:text-primary transition-colors">{unit.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={cn('text-xs font-semibold tabular-nums', getRiskColor(unit.risk))}>
                  {unit.risk}%
                </span>
                {unit.trend === 'up' && <TrendingUp className="w-3 h-3 text-status-error" />}
                {unit.trend === 'down' && <TrendingDown className="w-3 h-3 text-status-success" />}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}