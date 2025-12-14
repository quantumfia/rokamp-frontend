import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
}

export function ReportGeneratorForm({ onGenerate, isGenerating }: ReportGeneratorFormProps) {
  const [formData, setFormData] = useState<ReportFormData>({
    date: '',
    time: '',
    location: '',
    accidentType: '',
    overview: '',
    keywords: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  const handleChange = (field: keyof ReportFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.date && formData.location && formData.accidentType && formData.overview;

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-base">보고서 입력 정보</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">발생 일자 *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">발생 시간</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleChange('time', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">발생 장소 *</Label>
            <Input
              id="location"
              placeholder="예: 00사단 훈련장, 00대대 주둔지"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accidentType">사고 유형 *</Label>
            <Select value={formData.accidentType} onValueChange={(v) => handleChange('accidentType', v)}>
              <SelectTrigger>
                <SelectValue placeholder="사고 유형 선택" />
              </SelectTrigger>
              <SelectContent>
                {ACCIDENT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="overview">사고 개요 *</Label>
            <Textarea
              id="overview"
              placeholder="사고 상황을 간략히 기술해주세요"
              rows={4}
              value={formData.overview}
              onChange={(e) => handleChange('overview', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">추가 키워드</Label>
            <Input
              id="keywords"
              placeholder="예: 폭우, 야간, 신병"
              value={formData.keywords}
              onChange={(e) => handleChange('keywords', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">쉼표로 구분하여 입력</p>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={!isFormValid || isGenerating}
          >
            {isGenerating ? '생성 중...' : 'AI 보고서 초안 생성'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
