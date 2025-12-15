import { useState } from 'react';

const ACCIDENT_TYPES = [
  { value: 'vehicle', label: '차량 사고' },
  { value: 'training', label: '훈련 사고' },
  { value: 'equipment', label: '장비 사고' },
  { value: 'safety', label: '안전 사고' },
  { value: 'other', label: '기타' },
];

interface ReportGeneratorFormProps {
  onGenerate: (data: ReportFormData) => void;
  isGenerating: boolean;
}

export interface ReportFormData {
  date: string;
  time: string;
  location: string;
  accidentType: string;
  overview: string;
  keywords: string;
  reporter: string;
  reporterRank: string;
  reporterContact: string;
  casualties: string;
  damage: string;
  actionsTaken: string;
}

// 테스트용 기본값
const getDefaultFormData = (): ReportFormData => {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  const timeStr = `${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`;
  
  return {
    date: dateStr,
    time: timeStr,
    location: '제00사단 훈련장 A구역',
    accidentType: 'training',
    overview: '야간 전술훈련 중 장병 1명이 참호 진입 시 발을 헛디뎌 낙상. 우측 발목 염좌 부상 발생.',
    keywords: '야간훈련, 참호, 낙상',
    reporter: '홍길동',
    reporterRank: '대위',
    reporterContact: '010-1234-5678',
    casualties: '부상 1명 (우측 발목 염좌, 경상)',
    damage: '없음',
    actionsTaken: '현장 응급처치 후 사단 의무대 후송 완료. 훈련 일시 중단 후 안전점검 실시.',
  };
};

export function ReportGeneratorForm({ onGenerate, isGenerating }: ReportGeneratorFormProps) {
  const [formData, setFormData] = useState<ReportFormData>(getDefaultFormData());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  const handleChange = (field: keyof ReportFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.date && formData.location && formData.accidentType && formData.overview && formData.reporter;

  return (
    <div>
      <h2 className="text-sm font-medium text-foreground mb-4">보고서 입력 정보</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="date" className="text-xs text-muted-foreground">발생 일자 *</label>
            <input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className="w-full bg-transparent border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-foreground transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="time" className="text-xs text-muted-foreground">발생 시간</label>
            <input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => handleChange('time', e.target.value)}
              className="w-full bg-transparent border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-foreground transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="location" className="text-xs text-muted-foreground">발생 장소 *</label>
          <input
            id="location"
            placeholder="예: 00사단 훈련장, 00대대 주둔지"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full bg-transparent border border-border rounded px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="accidentType" className="text-xs text-muted-foreground">사고 유형 *</label>
          <select
            id="accidentType"
            value={formData.accidentType}
            onChange={(e) => handleChange('accidentType', e.target.value)}
            className="w-full bg-transparent border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-foreground transition-colors"
          >
            <option value="">사고 유형 선택</option>
            {ACCIDENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="overview" className="text-xs text-muted-foreground">사고 개요 *</label>
          <textarea
            id="overview"
            placeholder="사고 상황을 간략히 기술해주세요"
            rows={4}
            value={formData.overview}
            onChange={(e) => handleChange('overview', e.target.value)}
            className="w-full bg-transparent border border-border rounded px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="keywords" className="text-xs text-muted-foreground">추가 키워드</label>
          <input
            id="keywords"
            placeholder="예: 폭우, 야간, 신병"
            value={formData.keywords}
            onChange={(e) => handleChange('keywords', e.target.value)}
            className="w-full bg-transparent border border-border rounded px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
          />
          <p className="text-xs text-muted-foreground">쉼표로 구분하여 입력</p>
        </div>

        <div className="border-t border-border pt-4 mt-4">
          <h3 className="text-xs font-medium text-foreground mb-3">보고자 정보</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="reporterRank" className="text-xs text-muted-foreground">계급</label>
              <input
                id="reporterRank"
                placeholder="예: 대위"
                value={formData.reporterRank}
                onChange={(e) => handleChange('reporterRank', e.target.value)}
                className="w-full bg-transparent border border-border rounded px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="reporter" className="text-xs text-muted-foreground">성명 *</label>
              <input
                id="reporter"
                placeholder="예: 홍길동"
                value={formData.reporter}
                onChange={(e) => handleChange('reporter', e.target.value)}
                className="w-full bg-transparent border border-border rounded px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="reporterContact" className="text-xs text-muted-foreground">연락처</label>
              <input
                id="reporterContact"
                placeholder="예: 010-0000-0000"
                value={formData.reporterContact}
                onChange={(e) => handleChange('reporterContact', e.target.value)}
                className="w-full bg-transparent border border-border rounded px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-4 mt-4">
          <h3 className="text-xs font-medium text-foreground mb-3">피해 현황</h3>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label htmlFor="casualties" className="text-xs text-muted-foreground">인명 피해</label>
              <input
                id="casualties"
                placeholder="예: 부상 1명 (우측 발목 염좌, 경상)"
                value={formData.casualties}
                onChange={(e) => handleChange('casualties', e.target.value)}
                className="w-full bg-transparent border border-border rounded px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="damage" className="text-xs text-muted-foreground">재산/장비 피해</label>
              <input
                id="damage"
                placeholder="예: 차량 전면부 파손"
                value={formData.damage}
                onChange={(e) => handleChange('damage', e.target.value)}
                className="w-full bg-transparent border border-border rounded px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-4 mt-4">
          <h3 className="text-xs font-medium text-foreground mb-3">조치 사항</h3>
          <div className="space-y-1.5">
            <label htmlFor="actionsTaken" className="text-xs text-muted-foreground">현재까지 조치 내용</label>
            <textarea
              id="actionsTaken"
              placeholder="현장 조치 및 후속 조치 사항을 기술해주세요"
              rows={3}
              value={formData.actionsTaken}
              onChange={(e) => handleChange('actionsTaken', e.target.value)}
              className="w-full bg-transparent border border-border rounded px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors resize-none"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={!isFormValid || isGenerating}
          className="w-full py-2.5 bg-foreground text-background rounded text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-40"
        >
          {isGenerating ? '생성 중...' : 'AI 보고서 초안 생성'}
        </button>
      </form>
    </div>
  );
}
