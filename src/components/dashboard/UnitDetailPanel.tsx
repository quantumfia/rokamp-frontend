import { X } from 'lucide-react';
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

export function UnitDetailPanel({ unitId, onClose, onChatbotClick }: UnitDetailPanelProps) {
  const unitName = '제7사단 3연대';
  const riskValue = 78;



  return (
    <div className="floating-panel w-full max-h-[calc(100vh-8rem)] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card/95 backdrop-blur-sm">
        <div>
          <h3 className="font-semibold text-foreground">{unitName}</h3>
          <p className="text-xs text-muted-foreground">상세 정보</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="p-4 space-y-6">
        {/* Risk Gauge */}
        <div className="flex justify-center">
          <RiskGauge value={riskValue} label="현재 위험도" size="md" />
        </div>

        {/* Weather Info */}
        <div className="p-3 rounded-xl bg-muted/50 border border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">기상 정보</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">기온</p>
              <p className="text-sm font-medium">-5°C</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">날씨</p>
              <p className="text-sm font-medium">눈 예보</p>
            </div>
          </div>
        </div>

        {/* Training Schedule */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">주간 훈련 일정</h4>
          <div className="space-y-2">
            {MOCK_TRAININGS.map((training) => (
              <div
                key={training.id}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border"
              >
                <span className="text-sm text-foreground">{training.name}</span>
                <span className="text-xs text-muted-foreground">{training.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Factors */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">예측 위험 요인</h4>
          <div className="space-y-2">
            {MOCK_RISK_FACTORS.map((factor) => (
              <div
                key={factor.id}
                className="p-3 rounded-lg bg-card border border-border"
              >
                <span className="text-sm text-foreground">{factor.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chatbot CTA */}
        <Button
          onClick={onChatbotClick}
          className="w-full"
          variant="secondary"
        >
          예방 대책 확인하기
        </Button>
      </div>
    </div>
  );
}
