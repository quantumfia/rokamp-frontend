import { PageHeader } from '@/components/common';

const SAMPLE_TEXT = {
  korean: '대한민국 육군 AI 사고예보 시스템',
  english: 'Republic of Korea Army AI Incident Forecast System',
  numbers: '0123456789',
  mixed: '2026년 1월 16일 안전사고 예방 훈련',
};

const FONT_WEIGHTS = [300, 400, 500, 600, 700, 800] as const;

interface FontSampleProps {
  fontFamily: string;
  fontName: string;
  description: string;
}

function FontSample({ fontFamily, fontName, description }: FontSampleProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{fontName}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
          font-family: {fontFamily}
        </code>
      </div>

      {/* Weight Samples */}
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">Weight Variations</p>
        <div className="grid gap-2">
          {FONT_WEIGHTS.map((weight) => (
            <div key={weight} className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground w-16 font-mono">{weight}</span>
              <p
                style={{ fontFamily, fontWeight: weight }}
                className="text-base text-foreground"
              >
                {SAMPLE_TEXT.korean}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Size Samples */}
      <div className="space-y-3 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">Size Variations</p>
        <div className="space-y-2">
          <p style={{ fontFamily }} className="text-2xl text-foreground">
            {SAMPLE_TEXT.korean}
          </p>
          <p style={{ fontFamily }} className="text-lg text-foreground">
            {SAMPLE_TEXT.english}
          </p>
          <p style={{ fontFamily }} className="text-base text-foreground">
            {SAMPLE_TEXT.mixed}
          </p>
          <p style={{ fontFamily }} className="text-sm text-muted-foreground">
            {SAMPLE_TEXT.numbers}
          </p>
        </div>
      </div>

      {/* Paragraph Sample */}
      <div className="space-y-2 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">Paragraph</p>
        <p style={{ fontFamily }} className="text-sm text-foreground leading-relaxed">
          AI 기반 사건·사고 예보 기술로 야전부대의 선제적 대응을 지원합니다. 
          실시간 데이터 분석을 통해 위험 요소를 사전에 감지하고, 
          체계적인 안전 관리 시스템을 구축하여 장병들의 안전을 보장합니다.
          The AI-powered incident forecast system supports proactive response for field units.
        </p>
      </div>
    </div>
  );
}

export default function FontPreviewPage() {
  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
      <PageHeader 
        title="폰트 확인" 
        description="시스템에서 사용 가능한 폰트를 비교합니다"
      />

      {/* 3-column side-by-side comparison */}
      <div className="grid grid-cols-3 gap-6">
        <FontSample
          fontFamily="'Noto Sans KR', sans-serif"
          fontName="Noto Sans KR"
          description="Google Fonts 한글 산세리프"
        />

        <FontSample
          fontFamily="'Pretendard', sans-serif"
          fontName="Pretendard"
          description="SF Pro, Inter 기반 한글 폰트"
        />

        <FontSample
          fontFamily="'Asta Sans', sans-serif"
          fontName="Asta Sans"
          description="현재 시스템 기본 폰트"
        />
      </div>
    </div>
  );
}
