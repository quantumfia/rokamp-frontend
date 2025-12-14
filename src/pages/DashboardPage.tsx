import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapView } from '@/components/dashboard/MapView';
import { RiskSummaryPanel } from '@/components/dashboard/RiskSummaryPanel';
import { UnitDetailPanel } from '@/components/dashboard/UnitDetailPanel';
import { TickerBar } from '@/components/dashboard/TickerBar';
import { StatusHeader } from '@/components/dashboard/StatusHeader';
import { TrendCharts } from '@/components/dashboard/TrendCharts';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  const showTicker = user?.role === 'ROLE_HQ' || user?.role === 'ROLE_DIV';

  const handleMarkerClick = (unitId: string) => {
    setSelectedUnitId(unitId);
  };

  const handleChatbotClick = () => {
    navigate('/chatbot');
  };

  return (
    <div className="p-6 space-y-4">
      {/* Status Header - 실시간 현황 + 시스템 상태 */}
      <StatusHeader />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">대시보드</h1>
          <p className="text-muted-foreground">실시간 부대 현황 및 사고 위험도 모니터링</p>
        </div>
      </div>

      {/* Ticker Bar */}
      {showTicker && (
        <div className="w-full">
          <TickerBar />
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
        {/* Left Panel - Risk Summary */}
        <div className="lg:col-span-1 h-full">
          <RiskSummaryPanel onUnitClick={handleMarkerClick} />
        </div>

        {/* Center - Map */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">GIS 시각화</CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100%-3rem)]">
              <div className="h-full relative rounded-b-lg overflow-hidden">
                <MapView
                  className="absolute inset-0"
                  onMarkerClick={handleMarkerClick}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Unit Detail */}
        <div className="lg:col-span-1">
          {selectedUnitId ? (
            <UnitDetailPanel
              unitId={selectedUnitId}
              onClose={() => setSelectedUnitId(null)}
              onChatbotClick={handleChatbotClick}
            />
          ) : (
            <Card className="h-full min-h-[300px]">
              <CardHeader>
                <CardTitle className="text-lg">부대 상세 정보</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-[calc(100%-4rem)]">
                <p className="text-muted-foreground text-center">
                  지도에서 부대 마커를 클릭하면<br />상세 정보가 표시됩니다.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Trend Charts Section */}
      <TrendCharts />
    </div>
  );
}
