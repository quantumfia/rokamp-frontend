import { TrendingUp, TrendingDown } from 'lucide-react';
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
    if (val < 25) return 'text-risk-safe';
    if (val < 50) return 'text-risk-caution';
    if (val < 75) return 'text-risk-warning';
    return 'text-risk-danger';
  };

  const getRiskBarColor = (val: number) => {
    if (val < 25) return 'bg-risk-safe';
    if (val < 50) return 'bg-risk-caution';
    if (val < 75) return 'bg-risk-warning';
    return 'bg-risk-danger';
  };

  return (
    <div className="floating-panel p-4 w-full h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">위험도 요약</h3>
        <span className="text-xs text-muted-foreground">
          {user?.role === 'ROLE_HQ' ? '전군' : user?.unit}
        </span>
      </div>

      {/* Overall Risk Gauge */}
      <div className="flex justify-center py-2">
        <RiskGauge value={overallRisk} label="종합 위험도" size="lg" />
      </div>

      {/* Stats Row - 무채색 기반, 숫자만 컬러 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-card border border-border">
          <span className="text-xs text-muted-foreground">경고 부대</span>
          <p className="text-2xl font-bold text-risk-danger mt-1">2</p>
        </div>
        <div className="p-3 rounded-lg bg-card border border-border">
          <span className="text-xs text-muted-foreground">안전 부대</span>
          <p className="text-2xl font-bold text-risk-safe mt-1">8</p>
        </div>
      </div>

      {/* High Risk Units List - 좌측 액센트 바 + 숫자만 컬러 */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-2">
          주의 필요 부대 TOP 5
        </h4>
        <div className="space-y-1">
          {MOCK_RISK_DATA.map((unit) => (
            <button
              key={unit.id}
              onClick={() => onUnitClick?.(unit.id)}
              className="w-full flex items-center justify-between p-2 pl-0 hover:bg-muted/30 transition-colors text-left rounded-r-lg overflow-hidden"
            >
              <div className="flex items-center gap-3">
                <div className={cn('w-1 h-8 rounded-r', getRiskBarColor(unit.risk))} />
                <span className="text-sm text-foreground">{unit.name}</span>
              </div>
              <div className="flex items-center gap-2 pr-2">
                <span className={cn('text-sm font-semibold tabular-nums', getRiskColor(unit.risk))}>
                  {unit.risk}%
                </span>
                {unit.trend === 'up' && <TrendingUp className="w-3 h-3 text-muted-foreground" />}
                {unit.trend === 'down' && <TrendingDown className="w-3 h-3 text-muted-foreground" />}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
