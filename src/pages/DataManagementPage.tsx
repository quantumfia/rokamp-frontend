import { useState } from 'react';
import { Upload, FileText, Newspaper, Calendar, CheckCircle, Clock, AlertCircle, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// 상태 배지 컴포넌트
function StatusBadge({ status }: { status: 'completed' | 'processing' | 'failed' }) {
  const config = {
    completed: { icon: CheckCircle, label: '완료', className: 'text-risk-safe' },
    processing: { icon: Clock, label: '처리중', className: 'text-risk-caution' },
    failed: { icon: AlertCircle, label: '실패', className: 'text-risk-danger' },
  };
  const { icon: Icon, label, className } = config[status];
  return (
    <span className={`flex items-center gap-1.5 text-xs font-medium ${className}`}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
}

// 문서 데이터
const documentData = [
  { id: 1, name: '육군 안전관리 규정 v2.3', type: 'PDF', size: '2.4MB', uploadedAt: '2024-12-10 14:30', status: 'completed' as const, chunks: 128 },
  { id: 2, name: '동절기 안전수칙 매뉴얼', type: 'HWP', size: '1.8MB', uploadedAt: '2024-12-08 09:15', status: 'completed' as const, chunks: 85 },
  { id: 3, name: '차량 운행 및 정비 매뉴얼', type: 'PDF', size: '5.2MB', uploadedAt: '2024-12-14 11:00', status: 'processing' as const, chunks: 0 },
  { id: 4, name: '사격훈련 안전수칙', type: 'PDF', size: '3.1MB', uploadedAt: '2024-12-07 16:45', status: 'completed' as const, chunks: 156 },
  { id: 5, name: '야간훈련 지침서', type: 'HWP', size: '1.2MB', uploadedAt: '2024-12-05 10:20', status: 'completed' as const, chunks: 62 },
];

// 뉴스 데이터
const newsData = [
  { id: 1, title: '군 안전사고 예방 종합대책 발표', source: '국방일보', date: '2024-12-13', status: 'completed' as const, embeddings: 45 },
  { id: 2, title: '동절기 한파 대비 안전수칙 강화', source: '연합뉴스', date: '2024-12-12', status: 'completed' as const, embeddings: 32 },
  { id: 3, title: '육군 훈련장 안전점검 결과 보고', source: '국방일보', date: '2024-12-11', status: 'completed' as const, embeddings: 28 },
  { id: 4, title: '국방부 안전관리 혁신방안 추진', source: 'YTN', date: '2024-12-10', status: 'processing' as const, embeddings: 0 },
];

// 훈련 데이터
const trainingData = [
  { id: 1, unit: '제1보병사단', period: '2024년 12월 2주차', type: '주간계획', uploadedAt: '2024-12-09', status: 'completed' as const, records: 48 },
  { id: 2, unit: '제7보병사단', period: '2024년 12월 2주차', type: '주간계획', uploadedAt: '2024-12-09', status: 'completed' as const, records: 52 },
  { id: 3, unit: '수도기계화보병사단', period: '2024년 12월', type: '월간계획', uploadedAt: '2024-12-01', status: 'completed' as const, records: 186 },
  { id: 4, unit: '제3보병사단', period: '2024년 12월 2주차', type: '주간계획', uploadedAt: '2024-12-14', status: 'processing' as const, records: 0 },
];

// 간소화된 업로드 컴포넌트
function CompactUploader({ 
  icon: Icon, 
  label, 
  accept, 
  hint 
}: { 
  icon: React.ElementType; 
  label: string; 
  accept: string; 
  hint: string;
}) {
  return (
    <div className="flex items-center gap-4 p-4 border border-dashed border-border rounded-lg hover:border-primary/50 transition-colors bg-muted/20">
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <Button size="sm" variant="outline">
        <Upload className="w-4 h-4 mr-1.5" />
        업로드
      </Button>
    </div>
  );
}

export default function DataManagementPage() {
  const [activeTab, setActiveTab] = useState('documents');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">데이터 관리</h1>
          <p className="text-muted-foreground">학습 데이터 및 훈련 정보 관리</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-lg grid-cols-3">
          <TabsTrigger value="documents">
            <FileText className="w-4 h-4 mr-2" />
            원문 관리
          </TabsTrigger>
          <TabsTrigger value="news">
            <Newspaper className="w-4 h-4 mr-2" />
            뉴스 데이터
          </TabsTrigger>
          <TabsTrigger value="training">
            <Calendar className="w-4 h-4 mr-2" />
            훈련 정보
          </TabsTrigger>
        </TabsList>

        {/* 원문 관리 탭 */}
        <TabsContent value="documents" className="mt-6 space-y-4">
          <CompactUploader
            icon={FileText}
            label="규정/매뉴얼 문서 업로드"
            accept="PDF, HWP"
            hint="PDF, HWP 형식 (최대 50MB)"
          />

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">학습 현황</CardTitle>
                <span className="text-xs text-muted-foreground">
                  총 {documentData.length}개 문서 · {documentData.filter(d => d.status === 'completed').reduce((sum, d) => sum + d.chunks, 0)}개 청크
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">문서명</TableHead>
                    <TableHead>형식</TableHead>
                    <TableHead>크기</TableHead>
                    <TableHead>업로드 일시</TableHead>
                    <TableHead className="text-center">청크 수</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documentData.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.name}</TableCell>
                      <TableCell className="text-muted-foreground">{doc.type}</TableCell>
                      <TableCell className="text-muted-foreground">{doc.size}</TableCell>
                      <TableCell className="text-muted-foreground">{doc.uploadedAt}</TableCell>
                      <TableCell className="text-center">
                        {doc.status === 'completed' ? doc.chunks : '-'}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={doc.status} />
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 뉴스 데이터 탭 */}
        <TabsContent value="news" className="mt-6 space-y-4">
          <CompactUploader
            icon={Newspaper}
            label="뉴스 데이터 업로드"
            accept="JSON, PDF"
            hint="JSON 또는 PDF 형식"
          />

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">학습된 뉴스 목록</CardTitle>
                <span className="text-xs text-muted-foreground">
                  총 {newsData.length}개 기사 · {newsData.filter(n => n.status === 'completed').reduce((sum, n) => sum + n.embeddings, 0)}개 임베딩
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[45%]">제목</TableHead>
                    <TableHead>출처</TableHead>
                    <TableHead>날짜</TableHead>
                    <TableHead className="text-center">임베딩 수</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {newsData.map((news) => (
                    <TableRow key={news.id}>
                      <TableCell className="font-medium">{news.title}</TableCell>
                      <TableCell className="text-muted-foreground">{news.source}</TableCell>
                      <TableCell className="text-muted-foreground">{news.date}</TableCell>
                      <TableCell className="text-center">
                        {news.status === 'completed' ? news.embeddings : '-'}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={news.status} />
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 훈련 정보 탭 */}
        <TabsContent value="training" className="mt-6 space-y-4">
          <CompactUploader
            icon={Calendar}
            label="훈련 계획 업로드"
            accept="XLSX, XLS"
            hint="Excel 형식 (최대 10MB)"
          />

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">업로드된 훈련 계획</CardTitle>
                <span className="text-xs text-muted-foreground">
                  총 {trainingData.length}개 파일 · {trainingData.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.records, 0)}개 레코드
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>부대</TableHead>
                    <TableHead>기간</TableHead>
                    <TableHead>유형</TableHead>
                    <TableHead>업로드 일자</TableHead>
                    <TableHead className="text-center">레코드 수</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainingData.map((training) => (
                    <TableRow key={training.id}>
                      <TableCell className="font-medium">{training.unit}</TableCell>
                      <TableCell className="text-muted-foreground">{training.period}</TableCell>
                      <TableCell className="text-muted-foreground">{training.type}</TableCell>
                      <TableCell className="text-muted-foreground">{training.uploadedAt}</TableCell>
                      <TableCell className="text-center">
                        {training.status === 'completed' ? training.records : '-'}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={training.status} />
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
