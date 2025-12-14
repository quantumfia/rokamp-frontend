import { useState } from 'react';
import { X, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox as CheckboxUI } from '@/components/ui/checkbox';

interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'high' | 'normal';
}

interface NoticeModalProps {
  onClose: () => void;
}

const MOCK_NOTICES: Notice[] = [
  {
    id: '1',
    title: '겨울철 안전사고 예방 강화 기간 운영',
    content: '2024년 12월 1일부터 2025년 2월 28일까지 겨울철 안전사고 예방 강화 기간으로 운영됩니다. 모든 부대는 동파 및 화재 예방에 각별히 유의하시기 바랍니다.',
    date: '2024-12-01',
    priority: 'high',
  },
  {
    id: '2',
    title: '시스템 정기 점검 안내',
    content: '매주 일요일 02:00-04:00 시스템 정기 점검이 진행됩니다. 해당 시간에는 서비스 이용이 제한될 수 있습니다.',
    date: '2024-11-28',
    priority: 'normal',
  },
];

export function NoticeModal({ onClose }: NoticeModalProps) {
  const [hideToday, setHideToday] = useState(false);

  const handleClose = () => {
    if (hideToday) {
      const expiry = new Date();
      expiry.setHours(23, 59, 59, 999);
      localStorage.setItem('hideNoticeUntil', expiry.toISOString());
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-card rounded-2xl shadow-2xl border border-border animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-primary text-primary-foreground">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            <h2 className="font-semibold">필수 공지사항</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-primary-foreground/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4">
          {MOCK_NOTICES.map((notice) => (
            <div
              key={notice.id}
              className={`p-4 rounded-xl border ${
                notice.priority === 'high'
                  ? 'border-risk-danger/30 bg-risk-danger/5'
                  : 'border-border bg-muted/50'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-foreground">{notice.title}</h3>
                {notice.priority === 'high' && (
                  <span className="px-2 py-0.5 text-xs font-medium rounded bg-risk-danger text-primary-foreground">
                    긴급
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {notice.content}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                게시일: {notice.date}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border bg-muted/30">
          <label className="flex items-center gap-2 cursor-pointer">
            <CheckboxUI
              checked={hideToday}
              onCheckedChange={(checked) => setHideToday(checked === true)}
            />
            <span className="text-sm text-muted-foreground">
              오늘 하루 보지 않기
            </span>
          </label>
          <Button onClick={handleClose}>
            확인
          </Button>
        </div>
      </div>
    </div>
  );
}
