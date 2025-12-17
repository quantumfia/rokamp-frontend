import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { DataManagementSkeleton } from '@/components/skeletons';
import { PageHeader, TabNavigation, ActionButton, AddModal, FileDropZone } from '@/components/common';
import { usePageLoading } from '@/hooks/usePageLoading';

// 상태 라벨
function StatusLabel({ status }: { status: 'completed' | 'processing' | 'failed' }) {
  const labels = {
    completed: '완료',
    processing: '처리중',
    failed: '실패',
  };
  return <span className="text-sm text-muted-foreground">{labels[status]}</span>;
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

// 문서 업로드 폼
function DocumentUploadForm() {
  return (
    <div className="space-y-4">
      <FileDropZone
        accept=".pdf,.hwp,.docx"
        hint="문서 파일을 드래그하거나 클릭하여 업로드"
        maxSize="50MB"
      />
      <div className="text-[11px] text-muted-foreground space-y-0.5">
        <p>• PDF, HWP, DOCX 형식 지원</p>
        <p>• 업로드 후 자동으로 청크 분할 및 임베딩 처리</p>
      </div>
    </div>
  );
}

// 기사 파일 업로드 폼
function NewsFileUploadForm() {
  return (
    <div className="space-y-4">
      <FileDropZone
        accept=".pdf,.txt"
        hint="기사 파일을 드래그하거나 클릭하여 업로드"
        maxSize="20MB"
      />
      <div className="text-[11px] text-muted-foreground">
        • PDF, TXT 형식 지원
      </div>
    </div>
  );
}

// 기사 텍스트 입력 폼
function NewsTextInputForm({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-muted-foreground mb-1.5">JSON 데이터</label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={'[\n  {\n    "Title": "기사 제목",\n    "Content": "기사 본문 내용...",\n    "Date": "2024-12-14",\n    "Source": "국방일보"\n  }\n]'}
          className="w-full h-48 px-3 py-2 text-sm font-mono bg-background border border-border rounded-md focus:outline-none focus:border-primary resize-none"
        />
      </div>
      <div className="text-[11px] text-muted-foreground">
        • 형식: Title, Content, Date, Source 필드를 포함한 JSON 배열
      </div>
    </div>
  );
}

const DATA_TABS = [
  { id: 'documents', label: '문서 관리' },
  { id: 'news', label: '언론 기사 관리' },
];

export default function DataManagementPage() {
  const [activeTab, setActiveTab] = useState('documents');
  const [showAddModal, setShowAddModal] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const isLoading = usePageLoading(1000);

  const handleDocumentUpload = () => {
    toast({
      title: '업로드 완료',
      description: '문서가 업로드되었습니다. 임베딩 처리가 시작됩니다.',
    });
    setShowAddModal(false);
  };

  const handleNewsUpload = () => {
    if (jsonInput) {
      try {
        const parsed = JSON.parse(jsonInput);
        if (!Array.isArray(parsed)) {
          throw new Error('배열 형식이어야 합니다');
        }
        toast({
          title: '데이터 적재 완료',
          description: `${parsed.length}개 기사가 Vector DB로 변환됩니다.`,
        });
        setJsonInput('');
      } catch (e) {
        toast({
          title: 'JSON 파싱 오류',
          description: '올바른 JSON 형식인지 확인해주세요.',
          variant: 'destructive',
        });
        return;
      }
    } else {
      toast({
        title: '업로드 완료',
        description: '기사가 업로드되었습니다.',
      });
    }
    setShowAddModal(false);
  };

  if (isLoading) {
    return <DataManagementSkeleton />;
  }

  // 탭별 모달 설정
  const modalConfig = activeTab === 'documents' 
    ? {
        title: '문서 추가',
        description: '학습용 문서를 업로드합니다',
        inputTypes: [
          { id: 'file', label: '파일 업로드', content: <DocumentUploadForm /> },
        ],
        onSubmit: handleDocumentUpload,
      }
    : {
        title: '기사 추가',
        description: '언론 기사를 업로드하거나 직접 입력합니다',
        inputTypes: [
          { id: 'file', label: '파일 업로드', content: <NewsFileUploadForm /> },
          { id: 'text', label: '텍스트 입력', content: <NewsTextInputForm value={jsonInput} onChange={setJsonInput} /> },
        ],
        onSubmit: handleNewsUpload,
      };

  return (
    <div className="p-6 space-y-6 animate-page-enter">
      <PageHeader 
        title="데이터 관리" 
        description="문서 및 언론 기사 학습 데이터 관리"
        actions={
          <ActionButton 
            label={activeTab === 'documents' ? '문서 추가' : '기사 추가'} 
            onClick={() => setShowAddModal(true)} 
          />
        }
      />

      <TabNavigation tabs={DATA_TABS} activeTab={activeTab} onChange={setActiveTab} />

      {/* 문서 관리 탭 */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-foreground">학습 현황</h2>
            <span className="text-xs text-muted-foreground">
              총 {documentData.length}개 문서 · {documentData.filter(d => d.status === 'completed').reduce((sum, d) => sum + d.chunks, 0)}개 청크
            </span>
          </div>

          <div className="grid grid-cols-[1fr_60px_60px_140px_80px_60px_40px] gap-4 py-3 text-xs text-muted-foreground border-y border-border">
            <div>문서명</div>
            <div>형식</div>
            <div>크기</div>
            <div>업로드 일시</div>
            <div className="text-center">청크 수</div>
            <div>상태</div>
            <div></div>
          </div>

          <div className="divide-y divide-border">
            {documentData.map((doc) => (
              <div key={doc.id} className="grid grid-cols-[1fr_60px_60px_140px_80px_60px_40px] gap-4 py-3 items-center text-sm">
                <div className="font-medium truncate">{doc.name}</div>
                <div className="text-muted-foreground">{doc.type}</div>
                <div className="text-muted-foreground">{doc.size}</div>
                <div className="text-muted-foreground tabular-nums">{doc.uploadedAt}</div>
                <div className="text-center text-muted-foreground">
                  {doc.status === 'completed' ? doc.chunks : '-'}
                </div>
                <div><StatusLabel status={doc.status} /></div>
                <div>
                  <button className="p-1 hover:bg-muted rounded transition-colors">
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 언론 기사 관리 탭 */}
      {activeTab === 'news' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-foreground">학습된 뉴스 목록</h2>
            <span className="text-xs text-muted-foreground">
              총 {newsData.length}개 기사 · {newsData.filter(n => n.status === 'completed').reduce((sum, n) => sum + n.embeddings, 0)}개 임베딩
            </span>
          </div>

          <div className="grid grid-cols-[1fr_100px_100px_80px_60px_40px] gap-4 py-3 text-xs text-muted-foreground border-y border-border">
            <div>제목</div>
            <div>출처</div>
            <div>날짜</div>
            <div className="text-center">임베딩 수</div>
            <div>상태</div>
            <div></div>
          </div>

          <div className="divide-y divide-border">
            {newsData.map((news) => (
              <div key={news.id} className="grid grid-cols-[1fr_100px_100px_80px_60px_40px] gap-4 py-3 items-center text-sm">
                <div className="font-medium truncate">{news.title}</div>
                <div className="text-muted-foreground">{news.source}</div>
                <div className="text-muted-foreground tabular-nums">{news.date}</div>
                <div className="text-center text-muted-foreground">
                  {news.status === 'completed' ? news.embeddings : '-'}
                </div>
                <div><StatusLabel status={news.status} /></div>
                <div>
                  <button className="p-1 hover:bg-muted rounded transition-colors">
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 추가 모달 */}
      <AddModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setJsonInput('');
        }}
        {...modalConfig}
      />
    </div>
  );
}
