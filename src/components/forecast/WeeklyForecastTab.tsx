import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Calendar, ChevronRight, Shield, TrendingUp, Clock, MapPin, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

// 이번 주 TOP 위험요소 데이터
const TOP_RISKS = [
  {
    id: 1,
    rank: 1,
    category: '군기사고',
    type: '구타/폭행',
    riskLevel: 'high',
    probability: 78,
    targetDay: '수요일',
    targetTime: '야간 (22:00-06:00)',
    targetRank: '이병, 일병',
    targetLocation: '생활관',
    reason: '주중 훈련 피로 누적 및 스트레스 증가',
    prevention: ['야간 순찰 강화', '병사 면담 실시', '분대장 교육']
  },
  {
    id: 2,
    rank: 2,
    category: '안전사고',
    type: '차량사고',
    riskLevel: 'high',
    probability: 72,
    targetDay: '금요일',
    targetTime: '오후 (14:00-18:00)',
    targetRank: '병장, 하사',
    targetLocation: '외부 이동간',
    reason: '주말 전 외출/외박 이동량 증가',
    prevention: ['차량 점검 강화', '운전병 피로도 확인', '이동 계획 사전 검토']
  },
  {
    id: 3,
    rank: 3,
    category: '군기사고',
    type: '성폭력',
    riskLevel: 'medium',
    probability: 45,
    targetDay: '토요일',
    targetTime: '야간 (22:00-06:00)',
    targetRank: '전 계급',
    targetLocation: '생활관, 근무지',
    reason: '주말 근무 인원 감소로 감독 취약',
    prevention: ['주말 간부 순찰 강화', '신고 채널 안내', 'CCTV 모니터링']
  },
  {
    id: 4,
    rank: 4,
    category: '안전사고',
    type: '자살',
    riskLevel: 'medium',
    probability: 38,
    targetDay: '월요일',
    targetTime: '새벽 (04:00-06:00)',
    targetRank: '이병',
    targetLocation: '생활관',
    reason: '주말 복귀 후 우울감 증가',
    prevention: ['월요일 아침 면담', '고위험 병사 관찰', '비상연락망 점검']
  },
  {
    id: 5,
    rank: 5,
    category: '군무이탈',
    type: '군무이탈',
    riskLevel: 'low',
    probability: 25,
    targetDay: '일요일',
    targetTime: '야간 (18:00-22:00)',
    targetRank: '일병, 상병',
    targetLocation: '영내',
    reason: '외박 복귀 지연 및 복귀 거부',
    prevention: ['복귀 시간 사전 확인', '미복귀자 즉시 연락', '가족 연락처 확보']
  }
];

// 요일별 핵심 주의사항
const DAILY_ALERTS = [
  { day: '월', label: '월요일', alerts: ['주말 복귀 후 심리 상태 점검', '아침 면담 실시'], riskLevel: 'medium' },
  { day: '화', label: '화요일', alerts: ['정상 근무'], riskLevel: 'low' },
  { day: '수', label: '수요일', alerts: ['야간 순찰 강화', '병사 스트레스 관리'], riskLevel: 'high' },
  { day: '목', label: '목요일', alerts: ['훈련 안전 점검'], riskLevel: 'low' },
  { day: '금', label: '금요일', alerts: ['차량 점검 강화', '외출/외박 이동 관리'], riskLevel: 'high' },
  { day: '토', label: '토요일', alerts: ['주말 근무자 순찰', '감독 강화'], riskLevel: 'medium' },
  { day: '일', label: '일요일', alerts: ['외박 복귀 관리', '미복귀자 연락'], riskLevel: 'medium' },
];

// 주간 요약 통계
const WEEKLY_SUMMARY = {
  totalRisks: 5,
  highRiskDays: 2,
  mainCategory: '군기사고',
  comparedToLastWeek: '+12%'
};

const getRiskBadgeStyle = (level: string) => {
  switch (level) {
    case 'high':
      return 'bg-status-error/10 text-status-error border-status-error/20';
    case 'medium':
      return 'bg-status-warning/10 text-status-warning border-status-warning/20';
    case 'low':
      return 'bg-status-success/10 text-status-success border-status-success/20';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getRiskLabel = (level: string) => {
  switch (level) {
    case 'high': return '높음';
    case 'medium': return '보통';
    case 'low': return '낮음';
    default: return '-';
  }
};

const getDayRiskStyle = (level: string) => {
  switch (level) {
    case 'high':
      return 'border-status-error/30 bg-status-error/5';
    case 'medium':
      return 'border-status-warning/30 bg-status-warning/5';
    case 'low':
      return 'border-border bg-card';
    default:
      return 'border-border bg-card';
  }
};

export default function WeeklyForecastTab() {
  const [expandedRisk, setExpandedRisk] = useState<number | null>(1);

  return (
    <div className="space-y-6">
      {/* 주간 요약 헤더 */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <AlertTriangle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">주간 위험요소</p>
                <p className="text-xl font-semibold">{WEEKLY_SUMMARY.totalRisks}건</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-status-error/10">
                <Calendar className="w-5 h-5 text-status-error" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">고위험 요일</p>
                <p className="text-xl font-semibold">{WEEKLY_SUMMARY.highRiskDays}일</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-status-warning/10">
                <Shield className="w-5 h-5 text-status-warning" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">주요 위험 분류</p>
                <p className="text-xl font-semibold">{WEEKLY_SUMMARY.mainCategory}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <TrendingUp className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">전주 대비</p>
                <p className="text-xl font-semibold text-status-error">{WEEKLY_SUMMARY.comparedToLastWeek}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 요일별 주의사항 */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">요일별 핵심 주의사항</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {DAILY_ALERTS.map((day) => (
              <div
                key={day.day}
                className={cn(
                  "p-3 rounded-lg border text-center",
                  getDayRiskStyle(day.riskLevel)
                )}
              >
                <p className="text-sm font-medium mb-1">{day.label}</p>
                <Badge 
                  variant="outline" 
                  className={cn("text-[10px] mb-2", getRiskBadgeStyle(day.riskLevel))}
                >
                  {getRiskLabel(day.riskLevel)}
                </Badge>
                <div className="space-y-1">
                  {day.alerts.map((alert, idx) => (
                    <p key={idx} className="text-[10px] text-muted-foreground leading-tight">
                      {alert}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* TOP 위험요소 리스트 */}
      <div>
        <h2 className="text-sm font-medium mb-3">이번 주 TOP 위험요소</h2>
        <div className="space-y-2">
          {TOP_RISKS.map((risk) => (
            <Card 
              key={risk.id}
              className={cn(
                "border-border cursor-pointer transition-all",
                expandedRisk === risk.id && "ring-1 ring-primary/20"
              )}
              onClick={() => setExpandedRisk(expandedRisk === risk.id ? null : risk.id)}
            >
              <CardContent className="p-4">
                {/* 요약 행 */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-semibold">
                    {risk.rank}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-[10px]">
                        {risk.category}
                      </Badge>
                      <span className="font-medium">{risk.type}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {risk.targetDay} · {risk.targetTime} · {risk.targetRank}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">위험도</p>
                      <p className="text-lg font-semibold">{risk.probability}%</p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={cn("min-w-[48px] justify-center", getRiskBadgeStyle(risk.riskLevel))}
                    >
                      {getRiskLabel(risk.riskLevel)}
                    </Badge>
                    <ChevronRight className={cn(
                      "w-4 h-4 text-muted-foreground transition-transform",
                      expandedRisk === risk.id && "rotate-90"
                    )} />
                  </div>
                </div>
                
                {/* 상세 정보 */}
                {expandedRisk === risk.id && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="grid grid-cols-2 gap-6">
                      {/* 위험 상세 */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-medium text-muted-foreground">위험 상세</h4>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-xs text-muted-foreground">주요 발생 요일/시간</p>
                              <p className="text-sm">{risk.targetDay} {risk.targetTime}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Users className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-xs text-muted-foreground">취약 계급</p>
                              <p className="text-sm">{risk.targetRank}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-xs text-muted-foreground">주요 발생 장소</p>
                              <p className="text-sm">{risk.targetLocation}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-xs text-muted-foreground">위험 요인</p>
                              <p className="text-sm">{risk.reason}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* 예방 대책 */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-medium text-muted-foreground">예방 대책</h4>
                        <ul className="space-y-2">
                          {risk.prevention.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
