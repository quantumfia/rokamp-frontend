import { AlertCircle, Radio } from 'lucide-react';

interface TickerItem {
  id: string;
  message: string;
  type: 'alert' | 'info' | 'warning';
  time: string;
}

const MOCK_TICKER_ITEMS: TickerItem[] = [
  { id: '1', message: '제7사단 3연대 사격훈련 중 안전사고 징후 감지', type: 'alert', time: '14:32' },
  { id: '2', message: '기상청 한파주의보 발령 - 전 부대 동파 예방 조치 필요', type: 'warning', time: '14:28' },
  { id: '3', message: '제3사단 구역 적설량 증가 - 차량 기동 주의', type: 'info', time: '14:15' },
  { id: '4', message: '제1사단 11연대 야간훈련 정상 종료', type: 'info', time: '14:00' },
];

export function TickerBar() {
  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'alert':
        return 'text-status-error';
      case 'warning':
        return 'text-status-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="h-8 bg-muted/30 flex items-center overflow-hidden">
      <div className="flex-shrink-0 px-3 flex items-center gap-1.5 border-r border-border h-full bg-primary/10">
        <Radio className="w-3 h-3 text-primary animate-pulse" />
        <span className="text-[10px] font-medium text-primary uppercase tracking-wider">Live</span>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="animate-ticker flex items-center gap-8 whitespace-nowrap px-4">
          {MOCK_TICKER_ITEMS.map((item) => (
            <div key={item.id} className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground font-mono">[{item.time}]</span>
              <span className={getTypeStyle(item.type)}>{item.message}</span>
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {MOCK_TICKER_ITEMS.map((item) => (
            <div key={`dup-${item.id}`} className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground font-mono">[{item.time}]</span>
              <span className={getTypeStyle(item.type)}>{item.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}