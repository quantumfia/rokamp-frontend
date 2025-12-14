import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Download, Copy, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ReportPreviewProps {
  content: string;
  onContentChange: (content: string) => void;
}

export function ReportPreview({ content, onContentChange }: ReportPreviewProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    toast({
      title: '복사 완료',
      description: '보고서 내용이 클립보드에 복사되었습니다.',
    });
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `사고보고서_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: '다운로드 완료',
      description: '보고서 파일이 다운로드되었습니다.',
    });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">보고서 미리보기</CardTitle>
          {content && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="w-4 h-4 mr-1" />
                복사
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-1" />
                다운로드
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {content ? (
          <div className="flex-1 flex flex-col">
            {isEditing ? (
              <Textarea
                value={content}
                onChange={(e) => onContentChange(e.target.value)}
                className="flex-1 min-h-[400px] font-mono text-sm resize-none"
              />
            ) : (
              <div 
                className="flex-1 p-4 bg-muted/30 rounded-lg border border-border overflow-auto whitespace-pre-wrap font-mono text-sm cursor-pointer hover:bg-muted/50 transition-colors min-h-[400px]"
                onClick={() => setIsEditing(true)}
              >
                {content}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              {isEditing ? '편집 중 - 외부 클릭 시 저장' : '클릭하여 편집'}
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">
              좌측 폼에서 정보를 입력하고<br />
              'AI 보고서 초안 생성' 버튼을 클릭하세요
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              과거 유사 보고서 패턴을 학습한 AI가<br />
              육군 표준 서식에 맞춰 초안을 작성합니다
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
