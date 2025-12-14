import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  references?: Array<{
    title: string;
    source: string;
    url?: string;
  }>;
}

const SUGGESTED_QUESTIONS = [
  '동절기 차량 사고 예방 대책은?',
  '야간 훈련 시 안전 수칙 알려줘',
  '화재 예방 점검 항목이 뭐야?',
  '행군 중 저체온증 대처 방법은?',
];

const INITIAL_MESSAGE: Message = {
  id: '0',
  role: 'assistant',
  content: '안녕하세요! 저는 ROKA-SAPS 안전 AI 어시스턴트입니다. 안전사고 예방에 관한 질문이 있으시면 언제든지 물어보세요.',
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAIResponse(messageText),
        references: [
          {
            title: '육군 안전관리 규정',
            source: '국방부',
            url: '#',
          },
          {
            title: '동절기 안전사고 예방 대책',
            source: '국방일보 2024.12.01',
            url: '#',
          },
        ],
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const getAIResponse = (question: string): string => {
    if (question.includes('차량')) {
      return `동절기 차량 사고 예방을 위해 다음 사항을 확인하세요:

1. **출발 전 점검**
   - 배터리 상태 및 부동액 농도 확인
   - 타이어 공기압 및 마모 상태 점검
   - 워셔액 및 와이퍼 작동 상태 확인

2. **운행 중 주의사항**
   - 급가속, 급제동, 급회전 금지
   - 안전거리 평소 대비 2배 이상 확보
   - 결빙 구간 서행 운전

3. **비상 장비 구비**
   - 삼각대, 손전등, 견인로프 필수 탑재
   - 스노우 체인 적재 및 사용법 숙지`;
    }
    return `질문에 대한 답변을 준비했습니다. 자세한 내용은 관련 규정을 참고하시기 바랍니다.

안전사고 예방을 위해서는 항상 규정된 절차를 준수하고, 위험 요소를 사전에 파악하여 대비하는 것이 중요합니다.

추가 질문이 있으시면 언제든지 물어보세요.`;
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">지능형 안전 챗봇</h1>
            <p className="text-xs text-muted-foreground">
              육군 규정 및 사례 기반 AI 어시스턴트
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex gap-3',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
            )}
            <div
              className={cn(
                'max-w-[70%] rounded-2xl px-4 py-3',
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              )}
            >
              <div className="text-sm whitespace-pre-wrap">{message.content}</div>
              {message.references && message.references.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">참고 자료</p>
                  {message.references.map((ref, index) => (
                    <a
                      key={index}
                      href={ref.url}
                      className="flex items-center gap-2 text-xs text-primary hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      [{ref.source}] {ref.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-muted rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 animate-pulse" />
                응답을 생성하고 있습니다...
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-muted-foreground mb-2">추천 질문</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((q, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleSend(q)}
              >
                {q}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border bg-card">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="안전에 관해 궁금한 점을 물어보세요..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={!input.trim() || isLoading}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
