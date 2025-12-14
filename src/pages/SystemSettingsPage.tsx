import { useState } from 'react';
import { Bell, Shield, Sliders, Save, Search, Download, Users, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';

// 감사 로그 Mock 데이터
const AUDIT_LOGS = [
  { id: 1, userId: 'admin01', userName: '김철수 대령', ip: '10.10.1.100', action: '로그인', target: '-', timestamp: '2024-12-14 09:15:23', status: 'success' },
  { id: 2, userId: 'user02', userName: '이영희 소령', ip: '10.10.2.55', action: '보고서 조회', target: '12월 2주차 통계보고서', timestamp: '2024-12-14 09:12:45', status: 'success' },
  { id: 3, userId: 'admin01', userName: '김철수 대령', ip: '10.10.1.100', action: '사용자 생성', target: 'user15', timestamp: '2024-12-14 08:55:12', status: 'success' },
  { id: 4, userId: 'unknown', userName: '-', ip: '192.168.1.50', action: '로그인 시도', target: '-', timestamp: '2024-12-14 08:30:05', status: 'failed' },
  { id: 5, userId: 'user03', userName: '박민수 중령', ip: '10.10.3.22', action: '데이터 조회', target: '제1사단 위험도', timestamp: '2024-12-14 08:22:18', status: 'success' },
  { id: 6, userId: 'admin01', userName: '김철수 대령', ip: '10.10.1.100', action: '공지사항 등록', target: '동절기 안전수칙', timestamp: '2024-12-13 17:45:30', status: 'success' },
  { id: 7, userId: 'user02', userName: '이영희 소령', ip: '10.10.2.55', action: '로그아웃', target: '-', timestamp: '2024-12-13 17:30:00', status: 'success' },
];

// 공지사항 Mock 데이터
const NOTICES = [
  { id: 1, title: '동절기 안전수칙 강화 안내', target: 'all', isPopup: true, createdAt: '2024-12-13', author: '김철수 대령' },
  { id: 2, title: '시스템 정기점검 안내 (12/20)', target: 'all', isPopup: false, createdAt: '2024-12-10', author: '김철수 대령' },
  { id: 3, title: '군사경찰 업무 매뉴얼 개정', target: 'mp', isPopup: true, createdAt: '2024-12-08', author: '이영희 준장' },
];

export default function SystemSettingsPage() {
  const [activeTab, setActiveTab] = useState('model');
  const [riskThreshold, setRiskThreshold] = useState([50]);
  const [frequencyWeight, setFrequencyWeight] = useState([60]);
  
  // 공지사항 상태
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeTarget, setNoticeTarget] = useState('all');
  const [isPopup, setIsPopup] = useState(false);
  
  // 감사 로그 필터
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [logDateFrom, setLogDateFrom] = useState('');
  const [logDateTo, setLogDateTo] = useState('');

  const handleSaveSettings = () => {
    toast({
      title: '저장 완료',
      description: '설정이 저장되었습니다.',
    });
  };

  const handlePublishNotice = () => {
    if (!noticeTitle.trim() || !noticeContent.trim()) {
      toast({
        title: '입력 오류',
        description: '제목과 내용을 모두 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: '공지 등록 완료',
      description: isPopup ? '로그인 시 팝업으로 표시됩니다.' : '공지사항이 등록되었습니다.',
    });
    setNoticeTitle('');
    setNoticeContent('');
    setIsPopup(false);
  };

  const handleExportLogs = () => {
    toast({
      title: '다운로드 시작',
      description: '감사 로그 파일을 다운로드합니다.',
    });
  };

  const getTargetLabel = (target: string) => {
    switch (target) {
      case 'all': return '전체';
      case 'mp': return '군사경찰';
      case 'infantry': return '일반부대';
      default: return target;
    }
  };

  const filteredLogs = AUDIT_LOGS.filter((log) =>
    log.userName.includes(logSearchQuery) || 
    log.userId.includes(logSearchQuery) ||
    log.action.includes(logSearchQuery)
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">시스템 설정</h1>
          <p className="text-muted-foreground">예보 모델, 공지사항, 보안 설정 관리</p>
        </div>
        <Button className="gap-2" onClick={handleSaveSettings}>
          <Save className="w-4 h-4" />
          변경사항 저장
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="model">
            <Sliders className="w-4 h-4 mr-2" />
            예보 설정
          </TabsTrigger>
          <TabsTrigger value="notice">
            <FileText className="w-4 h-4 mr-2" />
            공지사항
          </TabsTrigger>
          <TabsTrigger value="notification">
            <Bell className="w-4 h-4 mr-2" />
            알림 설정
          </TabsTrigger>
          <TabsTrigger value="audit">
            <Users className="w-4 h-4 mr-2" />
            감사 로그
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="w-4 h-4 mr-2" />
            보안 설정
          </TabsTrigger>
        </TabsList>

        {/* 예보 설정 탭 */}
        <TabsContent value="model" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>위험도 임계치 설정</CardTitle>
              <CardDescription>
                예보 모델의 위험 등급 구간을 설정합니다
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>경고 등급 임계치</span>
                  <span className="font-medium">{riskThreshold[0]}%</span>
                </div>
                <Slider
                  value={riskThreshold}
                  onValueChange={setRiskThreshold}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>안전</span>
                  <span>관심</span>
                  <span>주의</span>
                  <span>경고</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-4">
                {[
                  { label: '안전', range: '0-24%', color: 'bg-risk-safe' },
                  { label: '관심', range: '25-49%', color: 'bg-risk-caution' },
                  { label: '주의', range: '50-74%', color: 'bg-risk-warning' },
                  { label: '경고', range: '75-100%', color: 'bg-risk-danger' },
                ].map((item) => (
                  <div key={item.label} className="text-center p-3 rounded-lg bg-muted/30 border border-border">
                    <div className={`w-4 h-4 rounded-full ${item.color} mx-auto mb-2`} />
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.range}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>가중치 설정</CardTitle>
              <CardDescription>
                위험도 점수 산정 시 적용되는 가중치를 조정합니다
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>빈도 가중치</span>
                  <span className="font-medium">{frequencyWeight[0]}%</span>
                </div>
                <Slider
                  value={frequencyWeight}
                  onValueChange={setFrequencyWeight}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>심각도 가중치</span>
                  <span className="font-medium">{100 - frequencyWeight[0]}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${100 - frequencyWeight[0]}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 공지사항 관리 탭 */}
        <TabsContent value="notice" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 공지 등록 폼 */}
            <Card>
              <CardHeader>
                <CardTitle>공지사항 등록</CardTitle>
                <CardDescription>
                  새 공지사항을 작성하고 발송합니다
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notice-title">제목</Label>
                  <Input
                    id="notice-title"
                    placeholder="공지 제목을 입력하세요"
                    value={noticeTitle}
                    onChange={(e) => setNoticeTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notice-content">내용</Label>
                  <Textarea
                    id="notice-content"
                    placeholder="공지 내용을 입력하세요"
                    rows={6}
                    value={noticeContent}
                    onChange={(e) => setNoticeContent(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>수신 대상</Label>
                  <Select value={noticeTarget} onValueChange={setNoticeTarget}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="mp">군사경찰</SelectItem>
                      <SelectItem value="infantry">일반부대</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border">
                  <Checkbox 
                    id="popup" 
                    checked={isPopup}
                    onCheckedChange={(checked) => setIsPopup(checked === true)}
                  />
                  <div>
                    <Label htmlFor="popup" className="font-medium">로그인 시 팝업 노출</Label>
                    <p className="text-xs text-muted-foreground">체크 시 모든 대상자에게 강제 팝업 표시</p>
                  </div>
                </div>

                <Button className="w-full" onClick={handlePublishNotice}>
                  공지사항 등록
                </Button>
              </CardContent>
            </Card>

            {/* 등록된 공지 목록 */}
            <Card>
              <CardHeader>
                <CardTitle>등록된 공지사항</CardTitle>
                <CardDescription>
                  최근 등록된 공지사항 목록
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>제목</TableHead>
                      <TableHead className="w-20">대상</TableHead>
                      <TableHead className="w-16 text-center">팝업</TableHead>
                      <TableHead className="w-24">등록일</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {NOTICES.map((notice) => (
                      <TableRow key={notice.id}>
                        <TableCell className="font-medium">{notice.title}</TableCell>
                        <TableCell className="text-muted-foreground">{getTargetLabel(notice.target)}</TableCell>
                        <TableCell className="text-center">
                          <div className={`w-2 h-2 rounded-full mx-auto ${notice.isPopup ? 'bg-risk-safe' : 'bg-muted-foreground/30'}`} />
                        </TableCell>
                        <TableCell className="text-muted-foreground tabular-nums">{notice.createdAt}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 알림 설정 탭 */}
        <TabsContent value="notification" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>알림 설정</CardTitle>
              <CardDescription>
                시스템 알림 수신 방법을 설정합니다
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { id: 'high-risk', label: '고위험 부대 알림', desc: '위험도가 경고 수준에 도달한 부대 알림' },
                { id: 'weather', label: '기상 특보 알림', desc: '기상청 특보 발령 시 알림' },
                { id: 'training', label: '훈련 일정 알림', desc: '위험 훈련 시작 전 알림' },
                { id: 'report', label: '보고서 알림', desc: '정기 보고서 생성 완료 알림' },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
                  <div>
                    <Label htmlFor={item.id} className="text-base font-medium">{item.label}</Label>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch id={item.id} defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 감사 로그 탭 */}
        <TabsContent value="audit" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>접속 이력 조회</CardTitle>
                  <CardDescription>
                    사용자 접속 및 활동 이력을 조회합니다 (1년 이상 보관)
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={handleExportLogs}>
                  <Download className="w-4 h-4 mr-2" />
                  엑셀 다운로드
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 필터 */}
              <div className="flex gap-4">
                <div className="flex-1 max-w-sm relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="사용자 ID 또는 이름 검색..."
                    className="pl-9"
                    value={logSearchQuery}
                    onChange={(e) => setLogSearchQuery(e.target.value)}
                  />
                </div>
                <Input
                  type="date"
                  className="w-40"
                  value={logDateFrom}
                  onChange={(e) => setLogDateFrom(e.target.value)}
                />
                <span className="flex items-center text-muted-foreground">~</span>
                <Input
                  type="date"
                  className="w-40"
                  value={logDateTo}
                  onChange={(e) => setLogDateTo(e.target.value)}
                />
              </div>

              {/* 로그 테이블 */}
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-32">일시</TableHead>
                      <TableHead className="w-24">사용자 ID</TableHead>
                      <TableHead>이름</TableHead>
                      <TableHead className="w-28">IP 주소</TableHead>
                      <TableHead>수행 작업</TableHead>
                      <TableHead>대상</TableHead>
                      <TableHead className="w-16 text-center">상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-muted-foreground tabular-nums text-xs">{log.timestamp}</TableCell>
                        <TableCell className="font-mono text-sm">{log.userId}</TableCell>
                        <TableCell>{log.userName}</TableCell>
                        <TableCell className="font-mono text-sm text-muted-foreground">{log.ip}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell className="text-muted-foreground">{log.target}</TableCell>
                        <TableCell className="text-center">
                          <div className={`w-2 h-2 rounded-full mx-auto ${log.status === 'success' ? 'bg-risk-safe' : 'bg-risk-danger'}`} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <p className="text-xs text-muted-foreground text-right">
                비인가 IP 접속 시도 시 관리자에게 경고가 표시됩니다
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 보안 설정 탭 */}
        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>보안 설정</CardTitle>
              <CardDescription>
                시스템 보안 정책을 설정합니다
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { id: 'ip-check', label: 'IP 접근 제어', desc: '허용된 IP에서만 접속 가능', default: true },
                { id: 'session', label: '세션 타임아웃', desc: '30분 미사용 시 자동 로그아웃', default: true },
                { id: 'audit', label: '감사 로그 기록', desc: '모든 사용자 활동 기록', default: true },
                { id: 'encrypt', label: '데이터 암호화', desc: '전송 및 저장 데이터 암호화', default: true },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
                  <div>
                    <Label htmlFor={item.id} className="text-base font-medium">{item.label}</Label>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch id={item.id} defaultChecked={item.default} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
