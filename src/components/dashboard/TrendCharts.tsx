import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

// 최근 7일 위험도 추이 데이터
const riskTrendData = [
  { date: '12/08', risk: 42 },
  { date: '12/09', risk: 45 },
  { date: '12/10', risk: 38 },
  { date: '12/11', risk: 52 },
  { date: '12/12', risk: 48 },
  { date: '12/13', risk: 55 },
  { date: '12/14', risk: 51 },
];

// 시간대별 위험도 데이터
const hourlyRiskData = [
  { hour: '00', risk: 15 },
  { hour: '04', risk: 12 },
  { hour: '08', risk: 45 },
  { hour: '10', risk: 68 },
  { hour: '12', risk: 42 },
  { hour: '14', risk: 72 },
  { hour: '16', risk: 58 },
  { hour: '18', risk: 35 },
  { hour: '20', risk: 22 },
  { hour: '22', risk: 18 },
];

// 요일별 위험도 패턴
const weeklyPatternData = [
  { day: '월', risk: 52 },
  { day: '화', risk: 68 },
  { day: '수', risk: 75 },
  { day: '목', risk: 62 },
  { day: '금', risk: 48 },
  { day: '토', risk: 25 },
  { day: '일', risk: 18 },
];

// 훈련 유형별 위험도
const trainingTypeData = [
  { type: '사격', risk: 78 },
  { type: '행군', risk: 65 },
  { type: '전술', risk: 58 },
  { type: '체력', risk: 32 },
  { type: '교육', risk: 15 },
];

// 기상 조건별 위험도
const weatherRiskData = [
  { condition: '맑음', risk: 35 },
  { condition: '흐림', risk: 42 },
  { condition: '비', risk: 68 },
  { condition: '눈', risk: 82 },
  { condition: '안개', risk: 75 },
];

// 사고 유형별 분포 데이터
const accidentTypeData = [
  { name: '훈련사고', value: 35, color: 'hsl(var(--destructive))' },
  { name: '안전사고', value: 28, color: 'hsl(var(--warning))' },
  { name: '장비사고', value: 20, color: 'hsl(var(--primary))' },
  { name: '기타', value: 17, color: 'hsl(var(--muted-foreground))' },
];

const chartTooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '6px',
  fontSize: '12px'
};

export function TrendCharts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* 위험도 추이 그래프 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">위험도 추이 (7일)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={riskTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <Tooltip 
                  contentStyle={chartTooltipStyle}
                  formatter={(value: number) => [`${value}%`, '위험도']}
                />
                <Line 
                  type="monotone" 
                  dataKey="risk" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 시간대별 위험도 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">시간대별 위험도</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyRiskData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="hour" 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <Tooltip 
                  contentStyle={chartTooltipStyle}
                  formatter={(value: number) => [`${value}%`, '위험도']}
                  labelFormatter={(label) => `${label}시`}
                />
                <Area 
                  type="monotone" 
                  dataKey="risk" 
                  stroke="hsl(var(--destructive))" 
                  fill="hsl(var(--destructive) / 0.2)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 요일별 패턴 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">요일별 위험도 패턴</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyPatternData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <Tooltip 
                  contentStyle={chartTooltipStyle}
                  formatter={(value: number) => [`${value}%`, '위험도']}
                />
                <Bar 
                  dataKey="risk" 
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 훈련 유형별 위험도 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">훈련 유형별 위험도</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trainingTypeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis 
                  type="number" 
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  type="category" 
                  dataKey="type" 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  width={40}
                />
                <Tooltip 
                  contentStyle={chartTooltipStyle}
                  formatter={(value: number) => [`${value}%`, '위험도']}
                />
                <Bar 
                  dataKey="risk" 
                  fill="hsl(var(--warning))"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 기상 조건별 위험도 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">기상 조건별 위험도</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weatherRiskData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis 
                  type="number" 
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  type="category" 
                  dataKey="condition" 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  width={40}
                />
                <Tooltip 
                  contentStyle={chartTooltipStyle}
                  formatter={(value: number) => [`${value}%`, '위험도']}
                />
                <Bar 
                  dataKey="risk" 
                  fill="hsl(var(--primary))"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 사고 유형별 분포 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">사고 유형별 분포</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[160px] flex items-center">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={accidentTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={55}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {accidentTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={chartTooltipStyle}
                    formatter={(value: number) => [`${value}%`, '비율']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-1.5">
              {accidentTypeData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
