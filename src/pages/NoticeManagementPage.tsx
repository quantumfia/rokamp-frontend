import { useState } from 'react';
import { Trash2, Eye, Edit2, Video, Paperclip, Upload, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { PageHeader, ActionButton, AddModal } from '@/components/common';
import { usePageLoading } from '@/hooks/usePageLoading';
import { cn } from '@/lib/utils';

// 공지사항 Mock 데이터
const NOTICES = [
  { 
    id: 1, 
    title: '동절기 안전수칙 강화 안내', 
    target: 'all', 
    targetLabel: '전체',
    hasVideo: true,
    hasAttachment: true,
    createdAt: '2024-12-13', 
    author: '김철수 대령',
    status: 'active'
  },
  { 
    id: 2, 
    title: '시스템 정기점검 안내 (12/20)', 
    target: 'all', 
    targetLabel: '전체',
    hasVideo: false,
    hasAttachment: false,
    createdAt: '2024-12-10', 
    author: '김철수 대령',
    status: 'active'
  },
  { 
    id: 3, 
    title: '야외훈련 간 사고예방 1분 안전학습', 
    target: 'division', 
    targetLabel: '제32보병사단',
    hasVideo: true,
    hasAttachment: true,
    createdAt: '2024-12-08', 
    author: '이영희 준장',
    status: 'active'
  },
  { 
    id: 4, 
    title: '12월 안전사고 예방 캠페인', 
    target: 'all', 
    targetLabel: '전체',
    hasVideo: false,
    hasAttachment: true,
    createdAt: '2024-12-05', 
    author: '김철수 대령',
    status: 'expired'
  },
];

export default function NoticeManagementPage() {
  const isLoading = usePageLoading(800);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // 폼 상태
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeTarget, setNoticeTarget] = useState('all');
  const [videoUrl, setVideoUrl] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  const handlePublishNotice = () => {
    if (!noticeTitle.trim() || !noticeContent.trim()) {
      toast({
        title: '입력 오류',
        description: '제목과 내용을 모두 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: '공지 등록 완료',
      description: '공지사항이 등록되었습니다. 대상자 로그인 시 팝업으로 표시됩니다.',
    });
    resetForm();
    setShowAddModal(false);
  };

  const resetForm = () => {
    setNoticeTitle('');
    setNoticeContent('');
    setNoticeTarget('all');
    setVideoUrl('');
    setAttachedFile(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
    }
  };

  const handleDeleteNotice = (id: number) => {
    toast({
      title: '공지 삭제',
      description: '공지사항이 삭제되었습니다.',
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 animate-page-enter">
        <div className="h-20 bg-muted/30 rounded-lg animate-pulse" />
        <div className="h-96 bg-muted/30 rounded-lg animate-pulse" />
      </div>
    );
  }

  // 직접 입력 폼
  const NoticeForm = (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="notice-title" className="text-xs text-muted-foreground">제목 *</Label>
        <Input
          id="notice-title"
          placeholder="공지 제목을 입력하세요"
          value={noticeTitle}
          onChange={(e) => setNoticeTitle(e.target.value)}
          className="bg-background"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notice-content" className="text-xs text-muted-foreground">내용 *</Label>
        <Textarea
          id="notice-content"
          placeholder="공지 내용을 입력하세요"
          rows={4}
          value={noticeContent}
          onChange={(e) => setNoticeContent(e.target.value)}
          className="bg-background"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">발송 대상</Label>
        <select 
          value={noticeTarget} 
          onChange={(e) => setNoticeTarget(e.target.value)}
          className="w-full h-9 px-3 text-sm bg-background border border-input rounded focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="all">전체 (전군)</option>
          <option value="division">예하 부대</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="video-url" className="text-xs text-muted-foreground">YouTube URL (선택)</Label>
        <Input
          id="video-url"
          placeholder="https://youtu.be/..."
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="bg-background"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">첨부파일 (선택)</Label>
        {!attachedFile ? (
          <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-border rounded cursor-pointer hover:border-muted-foreground transition-colors">
            <Upload className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">파일 선택</span>
            <input
              type="file"
              accept=".hwp,.pdf,.docx,.xlsx,.pptx"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        ) : (
          <div className="flex items-center justify-between px-3 py-2 border border-border rounded">
            <div className="flex items-center gap-2 min-w-0">
              <Paperclip className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm truncate">{attachedFile.name}</span>
              <span className="text-xs text-muted-foreground flex-shrink-0">
                ({formatFileSize(attachedFile.size)})
              </span>
            </div>
            <button 
              onClick={() => setAttachedFile(null)}
              className="p-1 hover:bg-muted rounded transition-colors"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const inputTypes = [
    { id: 'direct', label: '직접 입력', content: NoticeForm },
  ];

  return (
    <div className="p-6 space-y-6 animate-page-enter">
      <PageHeader 
        title="공지사항 관리" 
        description="부대별 공지사항 작성 및 발송 관리"
        actions={
          <ActionButton label="공지 추가" onClick={() => setShowAddModal(true)} />
        }
      />

      {/* 공지 목록 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">공지사항 목록</h2>
            <p className="text-xs text-muted-foreground">
              총 {NOTICES.length}건 · 활성 {NOTICES.filter(n => n.status === 'active').length}건
            </p>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-t border-border">
              <TableHead className="text-xs min-w-[200px]">제목</TableHead>
              <TableHead className="text-xs w-24">발송 대상</TableHead>
              <TableHead className="text-xs w-14 text-center">첨부</TableHead>
              <TableHead className="text-xs w-24">등록일</TableHead>
              <TableHead className="text-xs w-20">작성자</TableHead>
              <TableHead className="text-xs w-14 text-center">상태</TableHead>
              <TableHead className="text-xs w-20 text-center">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {NOTICES.map((notice) => (
              <TableRow key={notice.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{notice.title}</span>
                    {notice.hasVideo && (
                      <Video className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {notice.targetLabel}
                </TableCell>
                <TableCell className="text-center">
                  {notice.hasAttachment && (
                    <Paperclip className="w-3.5 h-3.5 mx-auto text-muted-foreground" />
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground tabular-nums">
                  {notice.createdAt}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {notice.author}
                </TableCell>
                <TableCell className="text-center">
                  <span className={cn(
                    "text-xs",
                    notice.status === 'active' ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {notice.status === 'active' ? '활성' : '만료'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1">
                    <button className="p-1 hover:bg-muted rounded transition-colors">
                      <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <button className="p-1 hover:bg-muted rounded transition-colors">
                      <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <button 
                      className="p-1 hover:bg-muted rounded transition-colors"
                      onClick={() => handleDeleteNotice(notice.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* 안내 */}
        <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t border-border mt-4">
          <p>• 공지사항은 대상자 로그인 시 팝업으로 표시됩니다 ("오늘 하루 보지 않기" 선택 가능)</p>
          <p>• <strong>전체 발송</strong>: Super Admin 권한 필요 / <strong>예하 부대 발송</strong>: Admin 권한 이상</p>
        </div>
      </section>

      {/* 공지 추가 모달 */}
      <AddModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title="공지사항 추가"
        description="공지 내용 입력 및 첨부파일 추가"
        inputTypes={inputTypes}
        onSubmit={handlePublishNotice}
        submitLabel="등록"
        isSubmitDisabled={!noticeTitle.trim() || !noticeContent.trim()}
      />
    </div>
  );
}
