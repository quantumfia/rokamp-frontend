import { X, ArrowLeft, Cloud, Thermometer, Wind, Droplet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUnitById, getUnitFullName, LEVEL_LABELS, UNIT_TYPE_LABELS } from '@/data/armyUnits';

interface Training {
  id: string;
  name: string;
  date: string;
}

interface RiskFactor {
  id: string;
  description: string;
  level: 'high' | 'medium' | 'low';
}

interface UnitDetailPanelHorizontalProps {
  unitId: string;
  onClose: () => void;
  showBackButton?: boolean;
}

const MOCK_TRAININGS: Training[] = [
  { id: '1', name: '사격 훈련', date: '01/08 (수)' },
  { id: '2', name: '야간 행군', date: '01/10 (금)' },
  { id: '3', name: '차량 기동훈련', date: '01/12 (일)' },
  { id: '4', name: '전술 훈련', date: '01/14 (화)' },
];

const MOCK_RISK_FACTORS: RiskFactor[] = [
  { id: '1', description: '폭우 예보로 인한 차량 전복 위험 증가', level: 'high' },
  { id: '2', description: '야간 행군 중 저체온증 주의 필요', level: 'medium' },
  { id: '3', description: '사격장 결빙으로 인한 미끄러짐 주의', level: 'medium' },
];

export function UnitDetailPanelHorizontal({ unitId, onClose, showBackButton = false }: UnitDetailPanelHorizontalProps) {
  const unit = getUnitById(unitId);
  const unitName = unit?.name || '알 수 없는 부대';
  const riskValue = unit?.risk || 0;
  const unitType = unit?.unitType ? UNIT_TYPE_LABELS[unit.unitType] : '일반';
  const region = unit?.region || '정보 없음';
  const levelLabel = unit ? LEVEL_LABELS[unit.level] : '';
  const fullPath = getUnitFullName(unitId);

  const getRiskColor = (risk: number) => {
    if (risk >= 60) return 'text-status-error';
    if (risk >= 30) return 'text-status-warning';
    return 'text-status-success';
  };

  const getRiskBg = (risk: number) => {
    if (risk >= 60) return 'bg-status-error';
    if (risk >= 30) return 'bg-status-warning';
    return 'bg-status-success';
  };

  const getRiskLabel = (risk: number) => {
    if (risk >= 75) return '경고';
    if (risk >= 50) return '주의';
    if (risk >= 25) return '관심';
    return '안전';
  };

  const getFactorColor = (level: 'high' | 'medium' | 'low') => {
    if (level === 'high') return 'bg-status-error/10 border-status-error/30 text-status-error';
    if (level === 'medium') return 'bg-status-warning/10 border-status-warning/30 text-status-warning';
    return 'bg-status-success/10 border-status-success/30 text-status-success';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          {showBackButton && (
            <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <div>
            <h3 className="text-sm font-semibold text-foreground">{unitName}</h3>
            <p className="text-[10px] text-muted-foreground">{levelLabel}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content - 2 Column Layout */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 h-full">
          {/* Left Column - 소속, 위험도, 부대정보, 기상정보 */}
          <div className="border-r border-border p-4 space-y-4">
            {/* 소속 */}
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">소속</p>
              <p className="text-xs text-foreground leading-relaxed">{fullPath}</p>
            </div>

            {/* 현재 위험도 */}
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">현재 위험도</p>
              <div className="flex items-end gap-3">
                <span className={`text-4xl font-bold tabular-nums ${getRiskColor(riskValue)}`}>
                  {riskValue}%
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${getRiskBg(riskValue)}`}>
                  {getRiskLabel(riskValue)}
                </span>
              </div>
            </div>

            {/* 부대 정보 */}
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">부대 정보</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/20 rounded p-2">
                  <p className="text-[10px] text-muted-foreground">부대 유형</p>
                  <p className="text-sm font-medium text-foreground">{unitType}</p>
                </div>
                <div className="bg-muted/20 rounded p-2">
                  <p className="text-[10px] text-muted-foreground">지역</p>
                  <p className="text-sm font-medium text-foreground">{region}</p>
                </div>
              </div>
            </div>

            {/* 기상 정보 */}
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">기상 정보</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 bg-muted/20 rounded p-2">
                  <Thermometer className="w-4 h-4 text-status-error" />
                  <div>
                    <p className="text-[10px] text-muted-foreground">기온</p>
                    <p className="text-sm font-medium text-foreground">-5°C</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-muted/20 rounded p-2">
                  <Cloud className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-[10px] text-muted-foreground">날씨</p>
                    <p className="text-sm font-medium text-foreground">눈 예보</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-muted/20 rounded p-2">
                  <Wind className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-[10px] text-muted-foreground">풍속</p>
                    <p className="text-sm font-medium text-foreground">12 m/s</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-muted/20 rounded p-2">
                  <Droplet className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-[10px] text-muted-foreground">습도</p>
                    <p className="text-sm font-medium text-foreground">65%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - 주간 훈련일정, 예측위험요인 */}
          <div className="p-4 space-y-4">
            {/* 주간 훈련 일정 */}
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">주간 훈련 일정</p>
              <div className="space-y-1.5">
                {MOCK_TRAININGS.map((training) => (
                  <div
                    key={training.id}
                    className="flex items-center justify-between px-3 py-2 bg-muted/20 rounded"
                  >
                    <span className="text-xs text-foreground">{training.name}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{training.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 예측 위험 요인 */}
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">예측 위험 요인</p>
              <div className="space-y-2">
                {MOCK_RISK_FACTORS.map((factor) => (
                  <div 
                    key={factor.id} 
                    className={`px-3 py-2 rounded border ${getFactorColor(factor.level)}`}
                  >
                    <span className="text-xs">{factor.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
