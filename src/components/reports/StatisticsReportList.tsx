import { useState } from 'react';
import { Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

interface StatReport {
  id: string;
  title: string;
  type: 'weekly' | 'monthly';
  period: string;
  generatedAt: string;
  unit: string;
}

const MOCK_STAT_REPORTS: StatReport[] = [
  { id: '1', title: '2024년 12월 2주차 사고 위험도 분석', type: 'weekly', period: '2024.12.08 ~ 2024.12.14', generatedAt: '2024-12-14', unit: '제1사단' },
  { id: '2', title: '2024년 12월 1주차 사고 위험도 분석', type: 'weekly', period: '2024.12.01 ~ 2024.12.07', generatedAt: '2024-12-07', unit: '제1사단' },
  { id: '3', title: '2024년 11월 월간 안전 통계', type: 'monthly', period: '2024.11.01 ~ 2024.11.30', generatedAt: '2024-12-01', unit: '제1사단' },
  { id: '4', title: '2024년 11월 4주차 사고 위험도 분석', type: 'weekly', period: '2024.11.24 ~ 2024.11.30', generatedAt: '2024-11-30', unit: '제1사단' },
  { id: '5', title: '2024년 11월 3주차 사고 위험도 분석', type: 'weekly', period: '2024.11.17 ~ 2024.11.23', generatedAt: '2024-11-23', unit: '제1사단' },
  { id: '6', title: '2024년 10월 월간 안전 통계', type: 'monthly', period: '2024.10.01 ~ 2024.10.31', generatedAt: '2024-11-01', unit: '제1사단' },
];

export function StatisticsReportList() {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReports = MOCK_STAT_REPORTS.filter((report) => {
    const matchesType = filterType === 'all' || report.type === filterType;
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleDownload = (report: StatReport) => {
    toast({
      title: '다운로드 시작',
      description: `${report.title} 파일을 다운로드합니다.`,
    });
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'weekly':
        return '주간';
      case 'monthly':
        return '월간';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 max-w-sm">
          <Input 
            placeholder="보고서 검색..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-40">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="유형 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="weekly">주간 보고서</SelectItem>
            <SelectItem value="monthly">월간 보고서</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reports Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[80px]">유형</TableHead>
              <TableHead>제목</TableHead>
              <TableHead className="w-[180px]">기간</TableHead>
              <TableHead className="w-[100px]">부대</TableHead>
              <TableHead className="w-[100px]">생성일</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.map((report) => (
              <TableRow key={report.id} className="cursor-pointer hover:bg-muted/30">
                <TableCell className="text-muted-foreground">
                  {getTypeLabel(report.type)}
                </TableCell>
                <TableCell className="font-medium">{report.title}</TableCell>
                <TableCell className="text-muted-foreground tabular-nums text-sm">
                  {report.period}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {report.unit}
                </TableCell>
                <TableCell className="text-muted-foreground tabular-nums">
                  {report.generatedAt}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => handleDownload(report)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">조건에 맞는 보고서가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
