import { X, ArrowLeft, Cloud, Thermometer, Wind, Droplet, Calendar, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUnitById, getUnitFullName, LEVEL_LABELS, UNIT_TYPE_LABELS } from '@/data/armyUnits';
import { cn } from '@/lib/utils';

interface ScheduleItem {
  id: string;
  type: 'training' | 'risk';
  title: string;
  subtitle?: string;
  level?: 'high' | 'medium' | 'low';
  date: string;
}

interface UnitDetailPanelHorizontalProps {
  unitId: string;
  onClose: () => void;
  showBackButton?: boolean;
}

// 훈련 일정 + 예측 위험 통합 리스트
const MOCK_SCHEDULE_ITEMS: ScheduleItem[] = [
  { id: '1', type: 'training', title: 'K-2 소총 영점사격', subtitle: '09:00 - 12:00 · 종합사격장', date: '1/6 (월)' },
  { id: '2', type: 'risk', title: '폭설 예보로 인한 차량 전복 위험', level: 'high', date: '1/6 (월)' },
  { id: '3', type: 'training', title: '기초체력단련', subtitle: '06:00 - 08:00 · 연병장', date: '1/7 (화)' },
  { id: '4', type: 'training', title: '동절기 차량정비 점검', subtitle: '14:00 - 17:00 · 정비창', date: '1/8 (수)' },
  { id: '5', type: 'risk', title: '야간 행군 중 저체온증 주의', level: 'medium', date: '1/8 (수)' },
  { id: '6', type: 'training', title: '야간 기동훈련', subtitle: '20:00 - 24:00 · 훈련장 A구역', date: '1/8 (수)' },
  { id: '7', type: 'risk', title: '사격장 결빙으로 인한 미끄러짐', level: 'medium', date: '1/9 (목)' },
  { id: '8', type: 'training', title: '안전교육 (동절기 안전수칙)', subtitle: '10:00 - 12:00 · 대강당', date: '1/9 (목)' },
  { id: '9', type: 'training', title: '전술훈련 (소대공격)', subtitle: '08:00 - 18:00 · 전술훈련장', date: '1/10 (금)' },
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
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <Button variant="ghost" size="icon" onClick={onClose} className="h-9 w-9">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div>
            <h3 className="text-lg font-bold text-foreground">{unitName}</h3>
            <p className="text-sm text-muted-foreground">{levelLabel} · {fullPath}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-9 w-9">
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* 현재 위험도 + 부대/기상 정보 */}
        <div className="flex gap-4">
          {/* 현재 위험도 */}
          <div className="bg-muted/40 rounded-xl p-4 shrink-0">
            <p className="text-xs text-muted-foreground mb-1">현재 위험도</p>
            <div className="flex items-end gap-2">
              <span className={`text-2xl font-bold tabular-nums ${getRiskColor(riskValue)}`}>
                {riskValue}%
              </span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold text-white mb-0.5 ${getRiskBg(riskValue)}`}>
                {getRiskLabel(riskValue)}
              </span>
            </div>
          </div>

          {/* 부대 정보 + 기상 정보 */}
          <div className="flex-1 flex flex-col gap-2">
            <div className="bg-muted/30 rounded-lg px-3 py-2 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">유형</span>
                <span className="text-xs font-medium text-foreground">{unitType}</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">지역</span>
                <span className="text-xs font-medium text-foreground">{region}</span>
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg px-3 py-2 flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-status-error" />
                <span className="text-xs font-medium text-foreground">-5°C</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Cloud className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-foreground">눈</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-foreground">12m/s</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Droplet className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-foreground">65%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 훈련 일정 + 예측 위험 통합 리스트 */}
        <div>
          <p className="text-sm font-semibold text-foreground mb-3">훈련/위험 일정</p>
          <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
            {MOCK_SCHEDULE_ITEMS.map((item) => (
              <div 
                key={item.id}
                className={cn(
                  "flex items-start gap-3 px-3 py-2.5 rounded-lg border transition-colors",
                  item.type === 'risk' 
                    ? item.level === 'high' 
                      ? 'bg-status-error/5 border-status-error/20' 
                      : 'bg-status-warning/5 border-status-warning/20'
                    : 'bg-muted/40 border-border'
                )}
              >
                {/* 아이콘 */}
                <div className={cn(
                  "shrink-0 w-7 h-7 rounded-full flex items-center justify-center",
                  item.type === 'risk'
                    ? item.level === 'high' 
                      ? 'bg-status-error/10 text-status-error' 
                      : 'bg-status-warning/10 text-status-warning'
                    : 'bg-primary/10 text-primary'
                )}>
                  {item.type === 'training' ? (
                    <Calendar className="w-3.5 h-3.5" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* 내용 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground truncate">{item.title}</span>
                    {item.type === 'risk' && item.level && (
                      <span className={cn(
                        "shrink-0 px-1.5 py-0.5 rounded text-[10px] font-semibold",
                        item.level === 'high' 
                          ? 'bg-status-error/10 text-status-error' 
                          : 'bg-status-warning/10 text-status-warning'
                      )}>
                        {item.level === 'high' ? '위험' : '주의'}
                      </span>
                    )}
                  </div>
                  {item.subtitle && (
                    <p className="text-xs text-muted-foreground mt-0.5">{item.subtitle}</p>
                  )}
                </div>

                {/* 날짜 */}
                <span className="shrink-0 text-xs text-muted-foreground">{item.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 예보/대비 섹션 */}
        <div>
          <p className="text-sm font-semibold text-foreground mb-3">예보/대비</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 px-3 py-2.5 bg-muted/40 rounded-lg">
              <span className="shrink-0 text-[11px] font-medium text-muted-foreground w-14">기상</span>
              <span className="text-sm text-foreground">1/7~1/9 한파특보 예상, 야외훈련 축소 및 동상 예방조치 시행</span>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2.5 bg-muted/40 rounded-lg">
              <span className="shrink-0 text-[11px] font-medium text-muted-foreground w-14">유사사례</span>
              <span className="text-sm text-foreground">GOP 철책 순찰 중 빙판 낙상사고 발생 (1군단, 1/5)</span>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2.5 bg-muted/40 rounded-lg">
              <span className="shrink-0 text-[11px] font-medium text-muted-foreground w-14">훈련안전</span>
              <span className="text-sm text-foreground">K-9 자주포 실사격 예정 (1/8), 포반원 안전거리 준수 재교육 필요</span>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2.5 bg-muted/40 rounded-lg">
              <span className="shrink-0 text-[11px] font-medium text-muted-foreground w-14">정비안전</span>
              <span className="text-sm text-foreground">정비창 차량 정비 중 중상해 사고 분석결과 공유 (정비사령부)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
