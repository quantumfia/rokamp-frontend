import { useState } from 'react';
import { ForecastSkeleton } from '@/components/skeletons';
import { PageHeader, TabNavigation } from '@/components/common';
import { usePageLoading } from '@/hooks/usePageLoading';
import WeeklyForecastTab from '@/components/forecast/WeeklyForecastTab';
import TrendAnalysisTab from '@/components/forecast/TrendAnalysisTab';

const FORECAST_TABS = [
  { id: 'weekly', label: '주간 예보' },
  { id: 'trends', label: '경향 분석' },
];

export default function ForecastPage() {
  const [activeTab, setActiveTab] = useState('weekly');
  const isLoading = usePageLoading(1000);

  if (isLoading) {
    return <ForecastSkeleton />;
  }

  return (
    <div className="p-6 space-y-6 animate-page-enter">
      <PageHeader 
        title="예보 분석" 
        description="부대별 위험도 예보 및 사고 경향 분석" 
      />

      <TabNavigation tabs={FORECAST_TABS} activeTab={activeTab} onChange={setActiveTab} />

      {/* 주간 예보 탭 */}
      {activeTab === 'weekly' && <WeeklyForecastTab />}

      {/* 경향 분석 탭 */}
      {activeTab === 'trends' && <TrendAnalysisTab />}
    </div>
  );
}
