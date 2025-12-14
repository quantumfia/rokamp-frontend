import { useState } from 'react';
import { Calendar, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RiskGauge } from '@/components/dashboard/RiskGauge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

// 월별 사고 추세 데이터
const TREND_DATA = [
  { month: '7월', current: 12, previous: 15 },
  { month: '8월', current: 18, previous: 14 },
  { month: '9월', current: 15, previous: 16 },
  { month: '10월', current: 22, previous: 19 },
  { month: '11월', current: 19, previous: 21 },
  { month: '12월', current: 14, previous: 17 },
];

// 사고 유형별 분포 데이터
const TYPE_DISTRIBUTION = [
  { name: '차량 사고', value: 35, color: 'hsl(var(--destructive))' },
  { name: '훈련 부상', value: 28, color: 'hsl(var(--warning))' },
  { name: '시설 안전', value: 22, color: 'hsl(var(--primary))' },
  { name: '기타', value: 15, color: 'hsl(var(--muted-foreground))' },
];

// 계급별 위험 지수 데이터
const RANK_RISK_DATA = [
  { rank: '병사', risk: 42 },
  { rank: '부사관', risk: 28 },
  { rank: '위관', risk: 18 },
  { rank: '영관', risk: 8 },
  { rank: '장관', risk: 4 },
];

const chartTooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '6px',
  fontSize: '12px'
};

export default function ForecastPage() {
  const [activeTab, setActiveTab] = useState('weekly');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">예보 분석</h1>
          <p className="text-muted-foreground">부대별 위험도 예보 및 사고 경향 분석</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="weekly">
            <Calendar className="w-4 h-4 mr-2" />
            주간 예보
          </TabsTrigger>
          <TabsTrigger value="trends">
            <TrendingUp className="w-4 h-4 mr-2" />
            경향 분석
          </TabsTrigger>
          <TabsTrigger value="prevention">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            예방 활동
          </TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="mt-6 space-y-6">
          {/* 주간 종합 위험도 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
            {['월', '화', '수', '목', '금', '토', '일'].map((day, index) => {
              const risk = [45, 52, 68, 55, 42, 25, 18][index];
              const level = risk >= 75 ? '경고' : risk >= 50 ? '주의' : risk >= 25 ? '관심' : '안전';
              const levelColor = risk >= 75 ? 'text-risk-danger' : risk >= 50 ? 'text-risk-warning' : risk >= 25 ? 'text-risk-caution' : 'text-risk-safe';
              return (
                <Card key={day} className={index === 2 ? 'ring-2 ring-risk-warning' : ''}>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-2">{day}요일</p>
                    <p className={`text-2xl font-bold tabular-nums ${levelColor}`}>{risk}%</p>
                    <p className={`text-xs font-medium mt-1 ${levelColor}`}>{level}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* 사고 유형별 주간 예측 위험도 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">사고 유형별 주간 위험 지수</CardTitle>
              <p className="text-sm text-muted-foreground">각 유형별 예측 위험 확률 (%)</p>
            </CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={[
                      { type: '차량 사고', risk: 72, color: 'hsl(var(--destructive))' },
                      { type: '훈련 부상', risk: 45, color: 'hsl(var(--warning))' },
                      { type: '시설 안전', risk: 28, color: 'hsl(var(--primary))' },
                      { type: '장비 사고', risk: 35, color: 'hsl(var(--muted-foreground))' },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis 
                      dataKey="type" 
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      domain={[0, 100]}
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <Tooltip 
                      contentStyle={chartTooltipStyle}
                      formatter={(value: number) => [`${value}%`, '위험도']}
                    />
                    <Bar dataKey="risk" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 계급별 주간 위험 지수 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">계급별 주간 위험 지수</CardTitle>
              <p className="text-sm text-muted-foreground">계급별 예측 위험 확률 (%)</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4">
                {[
                  { rank: '병사', risk: 58 },
                  { rank: '부사관', risk: 35 },
                  { rank: '위관', risk: 22 },
                  { rank: '영관', risk: 12 },
                  { rank: '장관', risk: 5 },
                ].map((item) => {
                  const levelColor = item.risk >= 50 ? 'text-risk-warning' : item.risk >= 25 ? 'text-risk-caution' : 'text-risk-safe';
                  return (
                    <div key={item.rank} className="text-center p-4 rounded-lg bg-muted/30 border border-border">
                      <p className="text-sm text-muted-foreground mb-2">{item.rank}</p>
                      <p className={`text-xl font-bold tabular-nums ${levelColor}`}>{item.risk}%</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* 부대별 주간 예보 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">부대별 주간 위험도 예보</CardTitle>
              <p className="text-sm text-muted-foreground">개별 사고 건수가 아닌 위험 확률(%)과 등급만 표시됩니다</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['제1사단', '제3사단', '제6사단', '제7사단'].map((unit, index) => (
                  <div
                    key={unit}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border"
                  >
                    <span className="font-medium text-sm w-20">{unit}</span>
                    <div className="flex items-center gap-2">
                      {['월', '화', '수', '목', '금', '토', '일'].map((day, dayIndex) => {
                        const risk = (index * 12 + dayIndex * 8 + 15) % 100;
                        return (
                          <div
                            key={day}
                            className="flex flex-col items-center gap-0.5"
                          >
                            <span className="text-[10px] text-muted-foreground">{day}</span>
                            <div
                              className={`w-7 h-7 rounded flex items-center justify-center text-[10px] font-medium ${
                                risk < 25
                                  ? 'bg-risk-safe/20 text-risk-safe'
                                  : risk < 50
                                  ? 'bg-risk-caution/20 text-risk-caution'
                                  : risk < 75
                                  ? 'bg-risk-warning/20 text-risk-warning'
                                  : 'bg-risk-danger/20 text-risk-danger'
                              }`}
                            >
                              {risk}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="mt-6 space-y-6">
          {/* 통계 요약 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">작년 동기 대비</p>
                <p className="text-2xl font-bold text-risk-safe mt-1">-12%</p>
                <p className="text-xs text-muted-foreground">전체 사고 감소</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">차량 사고</p>
                <p className="text-2xl font-bold text-risk-danger mt-1">+20%</p>
                <p className="text-xs text-muted-foreground">동절기 증가 추세</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">훈련 부상</p>
                <p className="text-2xl font-bold text-risk-safe mt-1">-8%</p>
                <p className="text-xs text-muted-foreground">안전교육 효과</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 월별 사고 추세 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">월별 사고 추세 (전년 대비)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={TREND_DATA}>
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
                        dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="previous" 
                        name="전년"
                        stroke="hsl(var(--muted-foreground))" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: 'hsl(var(--muted-foreground))', r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* 사고 유형별 분포 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">사고 유형별 분포</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] flex items-center">
                  <div className="w-1/2 h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={TYPE_DISTRIBUTION}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {TYPE_DISTRIBUTION.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={chartTooltipStyle} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-1/2 space-y-3">
                    {TYPE_DISTRIBUTION.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <span className="font-semibold">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 계급별 위험 지수 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">계급별 사고 비율</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={RANK_RISK_DATA} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                    <XAxis 
                      type="number" 
                      domain={[0, 50]}
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="rank" 
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                      width={50}
                    />
                    <Tooltip 
                      contentStyle={chartTooltipStyle}
                      formatter={(value: number) => [`${value}%`, '비율']}
                    />
                    <Bar 
                      dataKey="risk" 
                      fill="hsl(var(--primary))"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                ※ 자대 및 예하 부대 데이터만 통계 처리에 포함됩니다. 원본 데이터(RAW)는 접근이 제한됩니다.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prevention" className="mt-6 space-y-6">
          {/* AI 생성 체크리스트 */}
          <Card>
            <CardHeader>
              <CardTitle>AI 맞춤형 예방 체크리스트</CardTitle>
              <p className="text-sm text-muted-foreground">
                현재 위험 징후를 분석하여 자동 생성된 체크리스트입니다
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { task: '차량 일일 점검 실시 (동절기 배터리/부동액)', completed: true, priority: 'high' },
                  { task: '동절기 안전교육 시행 (저체온증 예방)', completed: true, priority: 'high' },
                  { task: '훈련장 안전시설 점검 (결빙 구간 표시)', completed: false, priority: 'high' },
                  { task: '비상연락망 확인 및 업데이트', completed: false, priority: 'medium' },
                  { task: '응급처치 장비 점검 (AED, 구급함)', completed: true, priority: 'medium' },
                  { task: '야간 훈련 조명 장비 점검', completed: false, priority: 'low' },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      item.completed
                        ? 'bg-risk-safe/5 border-risk-safe/20'
                        : item.priority === 'high'
                        ? 'bg-risk-danger/5 border-risk-danger/20'
                        : 'bg-muted/30 border-border'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-5 h-5 flex-shrink-0 ${
                        item.completed ? 'text-risk-safe' : 'text-muted-foreground'
                      }`}
                    />
                    <span
                      className={`flex-1 ${
                        item.completed ? 'line-through text-muted-foreground' : ''
                      }`}
                    >
                      {item.task}
                    </span>
                    {!item.completed && item.priority === 'high' && (
                      <span className="text-xs text-risk-danger font-medium">긴급</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 교육 자료 링크 */}
          <Card>
            <CardHeader>
              <CardTitle>관련 교육 자료</CardTitle>
              <p className="text-sm text-muted-foreground">
                현재 위험 유형에 맞는 교육 자료를 추천합니다
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { title: '동절기 차량 안전운행 매뉴얼', pages: 24 },
                  { title: '저체온증 예방 및 응급처치', pages: 12 },
                  { title: '동계 훈련장 안전관리 지침', pages: 18 },
                  { title: '결빙 도로 사고 예방 가이드', pages: 8 },
                ].map((doc, index) => (
                  <button
                    key={index}
                    className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{doc.title}</p>
                      <p className="text-xs text-muted-foreground">{doc.pages}페이지</p>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                ※ 보안 위배 소지가 있는 실제 사고 사례는 노출되지 않습니다
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
