import { useState } from 'react';
import { 
  Cloud, 
  CloudRain, 
  Wind, 
  Thermometer, 
  AlertTriangle, 
  MapPin,
  Mountain,
  Calendar,
  TrendingUp,
  Shield,
  AlertCircle,
  CheckCircle,
  Plus,
  Edit2,
  Trash2,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PageHeader } from '@/components/common/PageHeader';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data - 기상 정보
const WEATHER_DATA = {
  current: {
    temperature: 8,
    humidity: 78,
    windSpeed: 15,
    precipitation: 12,
    condition: 'rain',
  },
  forecast: [
    { day: '오늘', temp: 8, condition: 'rain', precip: 85 },
    { day: '내일', temp: 12, condition: 'cloudy', precip: 30 },
    { day: '모레', temp: 15, condition: 'sunny', precip: 5 },
  ],
};

// Mock data - 작전 구역별 위험도
const OPERATION_ZONES = [
  { 
    id: 'zone-1',
    name: '1소대 작전구역', 
    location: '강원도 철원군 북면 산악지대',
    terrain: '산악',
    riskLevel: 85,
    riskFactors: ['폭우로 인한 지반 약화', '급경사 지형', '과거 낙상사고 3건'],
    recommendation: '우회로 이용 권고, 작전 연기 검토',
    lastIncident: '2025-08-15',
  },
  { 
    id: 'zone-2',
    name: '2소대 작전구역', 
    location: '강원도 철원군 동면 평야지대',
    terrain: '평야',
    riskLevel: 35,
    riskFactors: ['시야 확보 양호', '지반 안정'],
    recommendation: '정상 작전 수행 가능',
    lastIncident: '2024-03-22',
  },
  { 
    id: 'zone-3',
    name: '3소대 작전구역', 
    location: '강원도 화천군 산악지대',
    terrain: '산악',
    riskLevel: 92,
    riskFactors: ['산사태 위험 구간', '강수량 초과', '도로 침수 우려'],
    recommendation: '작전 중지 권고, 대피로 확보 필요',
    lastIncident: '2025-11-03',
  },
  { 
    id: 'zone-4',
    name: '본부 구역', 
    location: '강원도 철원군 중앙',
    terrain: '시가지',
    riskLevel: 15,
    riskFactors: [],
    recommendation: '안전',
    lastIncident: null,
  },
];

// Mock data - 과거 사고 데이터
const HISTORICAL_INCIDENTS = [
  { id: 1, date: '2025-11-03', zone: '3소대 작전구역', type: '낙상', severity: '경상', weather: '폭우', description: '급경사 지역 순찰 중 미끄러짐' },
  { id: 2, date: '2025-08-15', zone: '1소대 작전구역', type: '낙상', severity: '중상', weather: '폭우', description: '산악 지형 이동 중 추락' },
  { id: 3, date: '2025-06-22', zone: '3소대 작전구역', type: '차량사고', severity: '경상', weather: '안개', description: '시야 불량으로 인한 접촉사고' },
  { id: 4, date: '2024-12-10', zone: '1소대 작전구역', type: '동상', severity: '경상', weather: '한파', description: '야간 경계 근무 중 동상' },
  { id: 5, date: '2024-03-22', zone: '2소대 작전구역', type: '기타', severity: '경상', weather: '맑음', description: '훈련 중 경미한 부상' },
];

// Mock data - 관리자가 등록한 작전 지역
const REGISTERED_AREAS = [
  { id: 1, name: 'A구역 (북방한계선 인접)', coordinates: '38.3124, 127.0892', terrain: '산악', riskNotes: '지뢰지대 인접, 급경사' },
  { id: 2, name: 'B구역 (철원평야)', coordinates: '38.2567, 127.1234', terrain: '평야', riskNotes: '하천 범람 주의' },
  { id: 3, name: 'C구역 (화천 저수지)', coordinates: '38.1089, 127.7012', terrain: '수변', riskNotes: '수위 변동 주의, 급류 위험' },
];

function getRiskColor(level: number) {
  if (level >= 80) return 'text-red-500';
  if (level >= 60) return 'text-orange-500';
  if (level >= 40) return 'text-yellow-500';
  return 'text-green-500';
}

function getRiskBadge(level: number) {
  if (level >= 80) return <Badge variant="destructive">위험</Badge>;
  if (level >= 60) return <Badge className="bg-orange-500 hover:bg-orange-600">경고</Badge>;
  if (level >= 40) return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-black">주의</Badge>;
  return <Badge className="bg-green-500 hover:bg-green-600">안전</Badge>;
}

function getWeatherIcon(condition: string) {
  switch (condition) {
    case 'rain':
      return <CloudRain className="w-6 h-6 text-blue-400" />;
    case 'cloudy':
      return <Cloud className="w-6 h-6 text-gray-400" />;
    default:
      return <Thermometer className="w-6 h-6 text-yellow-400" />;
  }
}

export default function OperationRiskPage() {
  const [selectedZone, setSelectedZone] = useState<typeof OPERATION_ZONES[0] | null>(null);
  const [isAddAreaDialogOpen, setIsAddAreaDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'areas' | 'history'>('overview');

  const overallRisk = Math.max(...OPERATION_ZONES.map(z => z.riskLevel));
  const criticalZones = OPERATION_ZONES.filter(z => z.riskLevel >= 80);

  return (
    <div className="space-y-6 animate-page-enter">
      <PageHeader
        title="작전 위험도 예측"
        description="기상/지형/과거 데이터 기반 AutoML 위험도 분석"
      />

      {/* 상단 경고 배너 */}
      {criticalZones.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-red-500">위험 경보 발령</p>
            <p className="text-sm text-muted-foreground mt-1">
              {criticalZones.map(z => z.name).join(', ')} 지역의 위험도가 80%를 초과했습니다.
              작전 수행 전 반드시 위험 요소를 확인하세요.
            </p>
          </div>
        </div>
      )}

      {/* 탭 네비게이션 */}
      <div className="flex gap-2 border-b border-border pb-2">
        <Button 
          variant={activeTab === 'overview' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('overview')}
        >
          종합 현황
        </Button>
        <Button 
          variant={activeTab === 'areas' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('areas')}
        >
          작전 지역 관리
        </Button>
        <Button 
          variant={activeTab === 'history' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('history')}
        >
          과거 사고 데이터
        </Button>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* 기상 및 종합 위험도 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* 현재 기상 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Cloud className="w-4 h-4" />
                  현재 기상
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold">{WEATHER_DATA.current.temperature}°C</p>
                    <p className="text-sm text-muted-foreground">체감온도 {WEATHER_DATA.current.temperature - 3}°C</p>
                  </div>
                  <CloudRain className="w-12 h-12 text-blue-400" />
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  <div className="bg-muted/50 rounded p-2">
                    <Wind className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">풍속</p>
                    <p className="text-sm font-medium">{WEATHER_DATA.current.windSpeed}m/s</p>
                  </div>
                  <div className="bg-muted/50 rounded p-2">
                    <Cloud className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">습도</p>
                    <p className="text-sm font-medium">{WEATHER_DATA.current.humidity}%</p>
                  </div>
                  <div className="bg-muted/50 rounded p-2">
                    <CloudRain className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">강수량</p>
                    <p className="text-sm font-medium">{WEATHER_DATA.current.precipitation}mm</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3일 예보 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  3일 예보
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {WEATHER_DATA.forecast.map((day, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="text-sm font-medium w-12">{day.day}</span>
                      {getWeatherIcon(day.condition)}
                      <span className="text-sm">{day.temp}°C</span>
                      <div className="flex items-center gap-1">
                        <CloudRain className="w-3 h-3 text-blue-400" />
                        <span className="text-xs text-muted-foreground">{day.precip}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 종합 위험도 */}
            <Card className={overallRisk >= 80 ? 'border-red-500/50 bg-red-500/5' : ''}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  종합 위험도
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className={`text-5xl font-bold ${getRiskColor(overallRisk)}`}>
                    {overallRisk}%
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    AutoML 예측 신뢰도: 94.2%
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    {getRiskBadge(overallRisk)}
                    <span className="text-xs text-muted-foreground">
                      {criticalZones.length}개 구역 위험
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 작전 구역별 위험도 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                작전 구역별 위험도 분석
              </CardTitle>
              <CardDescription>
                기상, 지형, 과거 사고 데이터를 종합 분석한 실시간 위험도
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {OPERATION_ZONES.map((zone) => (
                  <div 
                    key={zone.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                      zone.riskLevel >= 80 ? 'border-red-500/50 bg-red-500/5' :
                      zone.riskLevel >= 60 ? 'border-orange-500/30 bg-orange-500/5' :
                      zone.riskLevel >= 40 ? 'border-yellow-500/30 bg-yellow-500/5' :
                      'border-green-500/30 bg-green-500/5'
                    }`}
                    onClick={() => setSelectedZone(zone)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{zone.name}</h4>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Mountain className="w-3 h-3" />
                          {zone.terrain} | {zone.location}
                        </p>
                      </div>
                      {getRiskBadge(zone.riskLevel)}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">위험 확률</span>
                        <span className={`font-bold ${getRiskColor(zone.riskLevel)}`}>
                          {zone.riskLevel}%
                        </span>
                      </div>
                      <Progress 
                        value={zone.riskLevel} 
                        className="h-2"
                      />
                    </div>

                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        <strong>권고:</strong> {zone.recommendation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 선택된 구역 상세 정보 */}
          {selectedZone && (
            <Card className="border-primary/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    {selectedZone.name} 상세 분석
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedZone(null)}>
                    닫기
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* XAI 설명 - 위험 요인 */}
                  <div>
                    <h5 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      AI 위험 판단 근거
                    </h5>
                    <ul className="space-y-2">
                      {selectedZone.riskFactors.length > 0 ? (
                        selectedZone.riskFactors.map((factor, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                            <span>{factor}</span>
                          </li>
                        ))
                      ) : (
                        <li className="flex items-start gap-2 text-sm text-green-600">
                          <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>특이 위험 요소 없음</span>
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* 권고 사항 */}
                  <div>
                    <h5 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      지휘관 조치 권고
                    </h5>
                    <div className={`p-4 rounded-lg ${
                      selectedZone.riskLevel >= 80 ? 'bg-red-500/10 border border-red-500/30' :
                      selectedZone.riskLevel >= 60 ? 'bg-orange-500/10 border border-orange-500/30' :
                      'bg-green-500/10 border border-green-500/30'
                    }`}>
                      <p className="text-sm font-medium">{selectedZone.recommendation}</p>
                      {selectedZone.riskLevel >= 80 && (
                        <p className="text-xs text-muted-foreground mt-2">
                          ⚠️ 작전 수행 시 상급 부대 승인 필요
                        </p>
                      )}
                    </div>
                    {selectedZone.lastIncident && (
                      <p className="text-xs text-muted-foreground mt-3">
                        최근 사고 발생일: {selectedZone.lastIncident}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {activeTab === 'areas' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium">등록된 작전 지역</CardTitle>
                <CardDescription>
                  관리자가 수기로 등록한 부대별 작전 지역 목록
                </CardDescription>
              </div>
              <Dialog open={isAddAreaDialogOpen} onOpenChange={setIsAddAreaDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    작전 지역 추가
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>새 작전 지역 등록</DialogTitle>
                    <DialogDescription>
                      작전 지역의 정보를 입력하세요. 위험도 분석에 활용됩니다.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="area-name">지역명</Label>
                      <Input id="area-name" placeholder="예: D구역 (백마고지)" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="coordinates">좌표 또는 주소</Label>
                      <Input id="coordinates" placeholder="예: 38.1234, 127.5678" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="terrain">지형 유형</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="지형 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mountain">산악</SelectItem>
                          <SelectItem value="plain">평야</SelectItem>
                          <SelectItem value="water">수변</SelectItem>
                          <SelectItem value="urban">시가지</SelectItem>
                          <SelectItem value="forest">삼림</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="risk-notes">위험 요소 메모</Label>
                      <Input id="risk-notes" placeholder="예: 지뢰지대 인접, 급경사 구간" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddAreaDialogOpen(false)}>
                      취소
                    </Button>
                    <Button onClick={() => setIsAddAreaDialogOpen(false)}>
                      등록
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>지역명</TableHead>
                  <TableHead>좌표</TableHead>
                  <TableHead>지형</TableHead>
                  <TableHead>위험 요소 메모</TableHead>
                  <TableHead className="text-right">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {REGISTERED_AREAS.map((area) => (
                  <TableRow key={area.id}>
                    <TableCell className="font-medium">{area.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground font-mono">
                      {area.coordinates}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{area.terrain}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{area.riskNotes}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === 'history' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">과거 사고 데이터 (최근 10년)</CardTitle>
            <CardDescription>
              작전 구역별 사고 이력. AutoML 모델 학습에 활용됩니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>발생일</TableHead>
                  <TableHead>구역</TableHead>
                  <TableHead>유형</TableHead>
                  <TableHead>중증도</TableHead>
                  <TableHead>당시 기상</TableHead>
                  <TableHead>내용</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {HISTORICAL_INCIDENTS.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell className="font-mono text-sm">{incident.date}</TableCell>
                    <TableCell className="font-medium">{incident.zone}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{incident.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={incident.severity === '중상' ? 'destructive' : 'secondary'}
                      >
                        {incident.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{incident.weather}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {incident.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* 면책 조항 */}
      <p className="text-xs text-muted-foreground text-center">
        ※ 본 위험도 예측은 기상청 API, GIS, 과거 사고 데이터를 기반으로 한 AutoML 분석 결과입니다. 
        실제 작전 수행 시에는 현장 상황을 반드시 확인하세요.
      </p>
    </div>
  );
}
