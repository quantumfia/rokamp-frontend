import { X, Cloud, Calendar, AlertTriangle, MessageSquare, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RiskGauge } from './RiskGauge';
import { cn } from '@/lib/utils';

interface Training {
  id: string;
  name: string;
  date: string;
  type: 'shooting' | 'march' | 'drill' | 'vehicle';
}

interface RiskFactor {
  id: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

interface UnitDetailPanelProps {
  unitId: string;
  onClose: () => void;
  onChatbotClick: () => void;
}

// Mock data
const MOCK_TRAININGS: Training[] = [
  { id: '1', name: '사격 훈련', date: '12/15', type: 'shooting' },
  { id: '2', name: '야간 행군', date: '12/17', type: 'march' },
  { id: '3', name: '차량 기동훈련', date: '12/19', type: 'vehicle' },
];

const MOCK_RISK_FACTORS: RiskFactor[] = [
  { id: '1', description: '폭우 예보로 인한 차량 전복 위험 증가', severity: 'high' },
  { id: '2', description: '야간 행군 중 저체온증 주의 필요', severity: 'medium' },
  { id: '3', description: '사격장 결빙으로 인한 미끄러짐 주의', severity: 'low' },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high': return 'border-l-status-error';
    case 'medium': return 'border-l-status-warning';
    default: return 'border-l-status-info';
  }
};

export function UnitDetailPanel({ unitId, onClose, onChatbotClick }: UnitDetailPanelProps) {
  const unitName = '제7사단 3연대';
  const riskValue = 78;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{unitName}</h3>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">상세 정보</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Risk Gauge */}
          <div className="flex justify-center py-2 bg-muted/30 rounded border border-border">
            <RiskGauge value={riskValue} label="현재 위험도" size="md" />
          </div>

          {/* Weather Info */}
          <div className="p-3 rounded bg-muted/30 border border-border">
            <div className="flex items-center gap-1.5 mb-2">
              <Cloud className="w-3.5 h-3.5 text-muted-foreground" />
              <h4 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">기상 정보</h4>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-[10px] text-muted-foreground">기온</p>
                <p className="text-sm font-medium">-5°C</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">날씨</p>
                <p className="text-sm font-medium">눈 예보</p>
              </div>
            </div>
          </div>

          {/* Training Schedule */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              <h4 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">주간 훈련 일정</h4>
            </div>
            <div className="space-y-1">
              {MOCK_TRAININGS.map((training) => (
                <div
                  key={training.id}
                  className="flex items-center justify-between p-2 rounded bg-muted/30 border border-border"
                >
                  <span className="text-xs text-foreground">{training.name}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">{training.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Factors */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-muted-foreground" />
              <h4 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">예측 위험 요인</h4>
            </div>
            <div className="space-y-1">
              {MOCK_RISK_FACTORS.map((factor) => (
                <div
                  key={factor.id}
                  className={cn(
                    "p-2 rounded bg-card border border-border border-l-2",
                    getSeverityColor(factor.severity)
                  )}
                >
                  <span className="text-xs text-foreground">{factor.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot CTA */}
      <div className="p-3 border-t border-border">
        <Button
          onClick={onChatbotClick}
          className="w-full justify-between"
          variant="secondary"
          size="sm"
        >
          <span className="flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5" />
            예방 대책 확인하기
          </span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}