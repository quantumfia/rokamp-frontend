import { useState, useEffect } from 'react';
import { Cloud, AlertTriangle } from 'lucide-react';

// 현재 날짜/시간 포맷
function formatDateTime(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[date.getDay()];
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return {
    date: `${year}.${month}.${day} (${weekday})`,
    time: `${hours}:${minutes}:${seconds}`
  };
}


export function StatusHeader() {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // 실시간 시계
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { date, time } = formatDateTime(currentTime);

  // 기상 데이터
  const weatherData = {
    temp: -3,
    condition: '맑음',
    warning: '한파주의보'
  };

  return (
    <div className="flex items-center gap-4 px-4 py-2 text-xs">
      {/* 날짜/시간 */}
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground">{date}</span>
        <span className="font-mono font-medium text-foreground tabular-nums">{time}</span>
      </div>

      {/* 기상 정보 */}
      <div className="flex items-center gap-3 px-3 border-l border-border">
        <Cloud className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-muted-foreground">{weatherData.condition}</span>
        <span className="font-medium text-foreground">{weatherData.temp}°C</span>
        {weatherData.warning && (
          <span className="flex items-center gap-1 text-status-warning">
            <AlertTriangle className="w-3 h-3" />
            {weatherData.warning}
          </span>
        )}
      </div>
    </div>
  );
}