import { AlertCircle, Radio } from 'lucide-react';

interface TickerItem {
  id: string;
  message: string;
  type: 'alert' | 'info' | 'warning';
  time: string;
}

const MOCK_TICKER_ITEMS: TickerItem[] = [
  { id: '1', message: '제3보병사단 보급로 빙판 미끄러짐 사고 - 운전병 경상, 차량 파손', type: 'alert', time: '08:45' },
  { id: '2', message: '기상청 한파경보 발령 - 전 부대 동파 예방 및 한랭질환 주의', type: 'warning', time: '07:00' },
  { id: '3', message: '제22보병사단 GOP 동상 환자 발생 - 의무대 후송 치료 중', type: 'alert', time: '06:20' },
  { id: '4', message: '제1기갑여단 생활관 전열기 과부하 - 연기 발생 후 조기 진화', type: 'warning', time: '22:15' },
  { id: '5', message: '제5보병사단 혹한기 훈련 안전점검 정상 완료', type: 'info', time: '18:30' },
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