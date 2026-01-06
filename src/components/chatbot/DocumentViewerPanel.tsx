import { X, ExternalLink, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface DocumentReference {
  title: string;
  source: string;
  url?: string;
  pdfUrl?: string;
}

interface DocumentViewerPanelProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentReference | null;
}

// 목데이터: 실제 구현 시 실제 PDF URL로 대체
const MOCK_PDF_CONTENT = {
  "육군 차량 운행 안전관리 규정": {
    totalPages: 15,
    currentHighlight: "제3장 동절기 차량 운행",
    content: `
제3장 동절기 차량 운행 안전관리

제15조 (동절기 차량 점검)
① 동절기(11월~3월) 차량 운행 전 다음 사항을 필수 점검한다.
  1. 배터리 전압: 12.4V 이상 유지
  2. 부동액 농도: 50% 이상 확인
  3. 타이어 공기압: 정상치 대비 10% 증가
  4. 워셔액: 동결 방지제 혼합 여부

② 연료는 항상 1/2 이상 유지하여 결빙을 방지한다.

제16조 (운행 중 안전수칙)
① 급가속, 급제동, 급핸들 조작을 금지한다.
② 커브길 진입 전 충분히 감속하고 기어 변속을 최소화한다.
③ 다음 구간은 결빙 위험구간으로 특별히 주의한다:
  - 교량 위
  - 터널 출입구
  - 산 음지
  - 고갯길

④ 안전거리는 건조노면 대비 2배 이상 확보한다.

제17조 (비상대비 장구류)
① 필수 장구류: 삼각대, 손전등, 견인로프, 구급함
② 동절기 추가 장구류: 스노우체인, 염화칼슘, 삽, 모래주머니
    `,
  },
  "동절기 교통사고 예방 대책": {
    totalPages: 8,
    currentHighlight: "Ⅱ. 예방 대책",
    content: `
국방부 동절기 교통사고 예방 대책

Ⅰ. 개요
동절기 도로 결빙 및 기상악화로 인한 교통사고를 예방하기 위한 
세부 시행계획을 다음과 같이 수립한다.

Ⅱ. 예방 대책

1. 차량 사전 점검 강화
  - 월 1회 이상 차량 안전점검 실시
  - 동절기 특별점검 항목 추가 (배터리, 부동액, 타이어 등)

2. 운전병 안전교육 강화
  - 동절기 운전 요령 집중 교육 (12월 중)
  - 빙판길 제동거리, 미끄럼 대처법 실습

3. 운행 통제 기준
  - 적설량 5cm 이상: 필수 운행만 허용
  - 적설량 10cm 이상: 운행 전면 통제
  - 안개 가시거리 100m 이하: 운행 자제

4. 비상 대응체계
  - 24시간 비상연락망 유지
  - 응급 견인/구난 차량 대기
    `,
  },
};

export function DocumentViewerPanel({ isOpen, onClose, document }: DocumentViewerPanelProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);

  if (!document) return null;

  const mockData = MOCK_PDF_CONTENT[document.title as keyof typeof MOCK_PDF_CONTENT] || {
    totalPages: 1,
    currentHighlight: "",
    content: "문서를 불러올 수 없습니다.",
  };

  const handlePrevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(mockData.totalPages, p + 1));
  const handleZoomIn = () => setZoom((z) => Math.min(200, z + 25));
  const handleZoomOut = () => setZoom((z) => Math.max(50, z - 25));

  return (
    <div
      className={cn(
        "fixed top-0 right-0 h-full bg-background border-l border-border shadow-xl z-50 transition-all duration-300 flex flex-col",
        isOpen ? "w-[480px] translate-x-0" : "w-0 translate-x-full"
      )}
    >
      {isOpen && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold truncate">{document.title}</h3>
                <p className="text-xs text-muted-foreground truncate">{document.source}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/20">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handlePrevPage} disabled={currentPage === 1}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-xs text-muted-foreground px-2">
                {currentPage} / {mockData.totalPages}
              </span>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleNextPage} disabled={currentPage === mockData.totalPages}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleZoomOut} disabled={zoom <= 50}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-xs text-muted-foreground w-12 text-center">{zoom}%</span>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleZoomIn} disabled={zoom >= 200}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <div className="w-px h-4 bg-border mx-1" />
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Highlight indicator */}
          {mockData.currentHighlight && (
            <div className="px-4 py-2 bg-primary/5 border-b border-primary/20">
              <p className="text-xs text-primary">
                <span className="font-medium">관련 섹션:</span> {mockData.currentHighlight}
              </p>
            </div>
          )}

          {/* Document Content */}
          <div className="flex-1 overflow-auto p-6">
            <div
              className="bg-white dark:bg-zinc-900 rounded-lg border border-border shadow-sm p-6 min-h-full"
              style={{ fontSize: `${zoom}%` }}
            >
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
                {mockData.content}
              </pre>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-border bg-muted/20">
            <p className="text-[10px] text-muted-foreground text-center">
              이 문서는 미리보기입니다. 전체 원문은 다운로드하여 확인하세요.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
