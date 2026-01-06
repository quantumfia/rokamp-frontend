import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// 주간 추이 데이터
const WEEKLY_TREND_DATA = [
  { week: '1주차', 군기사고: 3, 안전사고: 2, 군무이탈: 0 },
  { week: '2주차', 군기사고: 5, 안전사고: 3, 군무이탈: 1 },
  { week: '3주차', 군기사고: 2, 안전사고: 4, 군무이탈: 0 },
  { week: '4주차', 군기사고: 4, 안전사고: 2, 군무이탈: 1 },
  { week: '5주차', 군기사고: 6, 안전사고: 5, 군무이탈: 0 },
  { week: '6주차', 군기사고: 3, 안전사고: 3, 군무이탈: 2 },
];

// 월간 추이 데이터
const MONTHLY_TREND_DATA = [
  { month: '7월', current: 12, previous: 15 },
  { month: '8월', current: 18, previous: 14 },
  { month: '9월', current: 15, previous: 16 },
  { month: '10월', current: 22, previous: 19 },
  { month: '11월', current: 19, previous: 21 },
  { month: '12월', current: 14, previous: 17 },
];

// 사고 유형별 증감 현황
const ACCIDENT_TYPE_CHANGES = [
  { 
    category: '군기사고',
    types: [
      { name: '구타/폭행', current: 8, previous: 12, trend: 'down' },
      { name: '가혹행위', current: 5, previous: 7, trend: 'down' },
      { name: '성폭력', current: 3, previous: 2, trend: 'up' },
      { name: '언어폭력', current: 12, previous: 10, trend: 'up' },
      { name: '집단따돌림', current: 2, previous: 4, trend: 'down' },
    ]
  },
  {
    category: '안전사고',
    types: [
      { name: '자살', current: 1, previous: 2, trend: 'down' },
      { name: '자해', current: 3, previous: 5, trend: 'down' },
      { name: '총기사고', current: 0, previous: 1, trend: 'down' },
      { name: '차량사고', current: 8, previous: 5, trend: 'up' },
      { name: '화재사고', current: 2, previous: 2, trend: 'stable' },
    ]
  }
];

// 계절별 패턴 데이터
const SEASONAL_PATTERN = [
  { month: '1월', risk: 65 },
  { month: '2월', risk: 58 },
  { month: '3월', risk: 72 },
  { month: '4월', risk: 68 },
  { month: '5월', risk: 55 },
  { month: '6월', risk: 78 },
  { month: '7월', risk: 85 },
  { month: '8월', risk: 82 },
  { month: '9월', risk: 70 },
  { month: '10월', risk: 62 },
  { month: '11월', risk: 75 },
  { month: '12월', risk: 80 },
];

// 요일별 패턴 데이터
const DAILY_PATTERN = [
  { day: '월', 군기사고: 15, 안전사고: 12 },
  { day: '화', 군기사고: 10, 안전사고: 8 },
  { day: '수', 군기사고: 22, 안전사고: 15 },
  { day: '목', 군기사고: 12, 안전사고: 10 },
  { day: '금', 군기사고: 18, 안전사고: 20 },
  { day: '토', 군기사고: 14, 안전사고: 8 },
  { day: '일', 군기사고: 16, 안전사고: 10 },
];

const chartTooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '4px',
  fontSize: '12px'
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="w-4 h-4 text-status-error" />;
    case 'down':
      return <TrendingDown className="w-4 h-4 text-status-success" />;
    default:
      return <Minus className="w-4 h-4 text-muted-foreground" />;
  }
};

const getChangePercent = (current: number, previous: number) => {
  if (previous === 0) return current > 0 ? '+100%' : '0%';
  const change = ((current - previous) / previous) * 100;
  return change > 0 ? `+${change.toFixed(0)}%` : `${change.toFixed(0)}%`;
};

const getChangeColor = (current: number, previous: number) => {
  if (current > previous) return 'text-status-error';
  if (current < previous) return 'text-status-success';
  return 'text-muted-foreground';
};

export default function TrendAnalysisTab() {
  const [periodType, setPeriodType] = useState<'weekly' | 'monthly'>('weekly');

  return (
    <div className="space-y-6">
      {/* 전년 대비 요약 */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">전체 사고 (전년 대비)</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-semibold text-status-success">-12%</p>
              <ArrowDown className="w-5 h-5 text-status-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">군기사고 (전년 대비)</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-semibold text-status-success">-18%</p>
              <ArrowDown className="w-5 h-5 text-status-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">안전사고 (전년 대비)</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-semibold text-status-error">+8%</p>
              <ArrowUp className="w-5 h-5 text-status-error" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">군무이탈 (전년 대비)</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-semibold text-status-success">-25%</p>
              <ArrowDown className="w-5 h-5 text-status-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 추이 차트 */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">사고 발생 추이</CardTitle>
            <Select value={periodType} onValueChange={(v) => setPeriodType(v as 'weekly' | 'monthly')}>
              <SelectTrigger className="w-[120px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">주간 추이</SelectItem>
                <SelectItem value="monthly">월간 추이</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[240px]">
            {periodType === 'weekly' ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={WEEKLY_TREND_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="week" 
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="군기사고" 
                    stackId="1"
                    stroke="hsl(var(--status-error))" 
                    fill="hsl(var(--status-error))"
                    fillOpacity={0.3}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="안전사고" 
                    stackId="1"
                    stroke="hsl(var(--status-warning))" 
                    fill="hsl(var(--status-warning))"
                    fillOpacity={0.3}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="군무이탈" 
                    stackId="1"
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MONTHLY_TREND_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="current" 
                    name="금년"
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="previous" 
                    name="전년"
                    stroke="hsl(var(--muted-foreground))" 
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    dot={{ fill: 'hsl(var(--muted-foreground))', r: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        {/* 사고 유형별 증감 현황 */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-medium">사고 유형별 증감 현황</CardTitle>
              <Badge variant="outline" className="text-[10px]">전년 대비</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ACCIDENT_TYPE_CHANGES.map((category) => (
                <div key={category.category}>
                  <p className="text-xs font-medium text-muted-foreground mb-2">{category.category}</p>
                  <div className="space-y-1.5">
                    {category.types.map((type) => (
                      <div key={type.name} className="flex items-center justify-between py-1.5 px-2 rounded bg-muted/30">
                        <div className="flex items-center gap-2">
                          {getTrendIcon(type.trend)}
                          <span className="text-sm">{type.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground">
                            {type.previous} → {type.current}건
                          </span>
                          <span className={cn("text-sm font-medium w-12 text-right", getChangeColor(type.current, type.previous))}>
                            {getChangePercent(type.current, type.previous)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 패턴 분석 */}
        <div className="space-y-6">
          {/* 요일별 발생 패턴 */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">요일별 발생 패턴</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={DAILY_PATTERN}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis 
                      dataKey="day" 
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Bar dataKey="군기사고" fill="hsl(var(--status-error))" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="안전사고" fill="hsl(var(--status-warning))" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                ※ 수요일, 금요일에 사고 발생 빈도가 높음
              </p>
            </CardContent>
          </Card>

          {/* 계절별 위험도 패턴 */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">월별 위험도 패턴</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={SEASONAL_PATTERN}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                      domain={[40, 100]}
                    />
                    <Tooltip 
                      contentStyle={chartTooltipStyle}
                      formatter={(value: number) => [`${value}%`, '위험도']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="risk" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                ※ 하절기(6-8월) 및 연말(11-12월) 위험도 상승
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 주요 인사이트 */}
      <Card className="border-status-warning/30 bg-status-warning/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-status-warning mt-0.5" />
            <div>
              <h4 className="text-sm font-medium mb-2">주요 경향 분석 결과</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• <span className="text-status-error font-medium">차량사고</span>가 전년 대비 60% 증가 추세로 주의 필요</li>
                <li>• 구타/폭행, 집단따돌림 등 <span className="text-status-success font-medium">군기사고</span>는 전반적 감소 추세</li>
                <li>• <span className="font-medium">수요일, 금요일</span> 야간 시간대에 사고 집중 발생</li>
                <li>• <span className="font-medium">7-8월 하절기</span> 위험도가 연중 최고 수준</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
