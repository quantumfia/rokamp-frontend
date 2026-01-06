import { useState, useEffect } from 'react';
import { IncidentTicker } from '@/components/dashboard/IncidentTicker';
import { StatusHeader } from '@/components/dashboard/StatusHeader';
import { RiskLevelPanel } from '@/components/dashboard/RiskLevelGauge';
import { RiskSummaryPanel } from '@/components/dashboard/RiskSummaryPanel';
import { UnitDetailPanel } from '@/components/dashboard/UnitDetailPanel';
import { TrendChartsVertical } from '@/components/dashboard/TrendChartsVertical';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchContext } from '@/components/layout/MainLayout';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  RiskSummarySkeleton,
  TrendChartsSkeleton,
  StatusHeaderSkeleton,
  TickerBarSkeleton,
} from '@/components/skeletons';

export default function DashboardPage() {
  const { user } = useAuth();
  const searchContext = useSearchContext();
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 모바일 패널 상태
  const [showLeftPanel, setShowLeftPanel] = useState(false);

  // 초기 로딩 시뮬레이션
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // GNB 검색에서 부대 선택 시 처리
  useEffect(() => {
    if (searchContext?.selectedUnitFromSearch) {
      setSelectedUnitId(searchContext.selectedUnitFromSearch);
      searchContext.setSelectedUnitFromSearch(null);
    }
  }, [searchContext?.selectedUnitFromSearch]);

  const handleUnitClick = (unitId: string) => {
    setSelectedUnitId(unitId);
    setShowLeftPanel(false);
  };

  const handleCloseDetail = () => {
    setSelectedUnitId(null);
  };

  const handleIncidentDetail = () => {
    // TODO: 사고 상세 페이지로 이동
    console.log('사고 상세 보기');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Top Status Bar - 3개 섹션: 날짜/시간/날씨 + 사고사례 + 위험도 */}
      <div className="shrink-0 border-b border-border bg-card/50">
        <div className="flex items-stretch divide-x divide-border">
          {/* 섹션 1: 날짜/시간/날씨 */}
          <div className="shrink-0">
            {isLoading ? <StatusHeaderSkeleton /> : <StatusHeader />}
          </div>
          
          {/* 섹션 2: 사고사례 실시간 카드 */}
          <div className="flex-1 min-w-0">
            {isLoading ? <TickerBarSkeleton /> : <IncidentTicker onClickDetail={handleIncidentDetail} />}
          </div>
          
          {/* 섹션 3: 위험도 게이지 */}
          <div className="shrink-0 hidden md:flex items-center">
            <RiskLevelPanel />
          </div>
        </div>
      </div>

      {/* Main Content - 2단 구조 (부대목록 + 트렌드/상세) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Panel - 위험도 요약 (데스크탑에서 항상 표시) */}
        <div className="shrink-0 w-64 border-r border-border bg-card overflow-hidden hidden lg:block">
          {isLoading ? <RiskSummarySkeleton /> : <RiskSummaryPanel onUnitClick={handleUnitClick} />}
        </div>

        {/* Mobile Left Panel Overlay - 위험도 요약 */}
        {showLeftPanel && (
          <div className="lg:hidden absolute inset-0 z-30 flex">
            <div className="w-64 max-w-[85vw] bg-card border-r border-border overflow-hidden animate-slide-in-left">
              <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                <span className="text-xs font-medium text-foreground">위험도 요약</span>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowLeftPanel(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="h-[calc(100%-41px)] overflow-hidden">
                {isLoading ? <RiskSummarySkeleton /> : <RiskSummaryPanel onUnitClick={handleUnitClick} />}
              </div>
            </div>
            <div className="flex-1 bg-black/50" onClick={() => setShowLeftPanel(false)} />
          </div>
        )}

        {/* Center - 트렌드 차트 또는 부대 상세 */}
        <div className="flex-1 flex flex-col bg-background overflow-hidden">
          {/* 모바일 툴바 */}
          <div className="lg:hidden flex items-center gap-2 p-2 border-b border-border bg-card/50">
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => setShowLeftPanel(true)}
            >
              부대 목록
            </Button>
          </div>

          {/* 콘텐츠 영역 */}
          <div className="flex-1 overflow-hidden">
            {isLoading ? (
              <TrendChartsSkeleton />
            ) : selectedUnitId ? (
              <UnitDetailPanel 
                unitId={selectedUnitId} 
                onClose={handleCloseDetail}
                showBackButton
              />
            ) : (
              <TrendChartsVertical />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
