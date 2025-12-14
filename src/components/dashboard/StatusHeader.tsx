import { useState, useEffect } from 'react';
import { Activity, Cloud, AlertTriangle, Wifi } from 'lucide-react';

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

// 시스템 상태 타입
type SystemStatus = 'online' | 'warning' | 'offline';

interface SystemService {
  name: string;
  status: SystemStatus;
  latency?: number;
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

  // 모의 데이터
  const weatherData = {
    temp: -3,
    condition: '맑음',
    warning: '한파주의보'
  };

  const summaryData = {
    avgRiskScore: 32,
    trainingUnits: 12,
    alerts24h: 3
  };

  const systemServices: SystemService[] = [
    { name: 'Server', status: 'online', latency: 24 },
    { name: 'DB', status: 'online', latency: 12 },
    { name: 'API', status: 'online', latency: 45 },
    { name: 'AI', status: 'online', latency: 156 },
  ];

  const getStatusDot = (status: SystemStatus) => {
    switch (status) {
      case 'online':
        return <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />;
      case 'warning':
        return <span className="w-1.5 h-1.5 rounded-full bg-status-warning" />;
      case 'offline':
        return <span className="w-1.5 h-1.5 rounded-full bg-status-error" />;
    }
  };

  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-status-success';
    if (score < 60) return 'text-status-warning';
    return 'text-status-error';
  };

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-2 text-xs">
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

      {/* 현황 요약 */}
      <div className="flex items-center gap-4 px-3 border-l border-border">
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">전군 위험도</span>
          <span className={`font-semibold tabular-nums ${getRiskColor(summaryData.avgRiskScore)}`}>
            {summaryData.avgRiskScore}%
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">금일 훈련</span>
          <span className="font-medium text-foreground">{summaryData.trainingUnits}개</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">24h 알림</span>
          <span className="font-medium text-status-warning">{summaryData.alerts24h}</span>
        </div>
      </div>

      {/* 시스템 상태 */}
      <div className="flex items-center gap-3 px-3 border-l border-border">
        <Wifi className="w-3.5 h-3.5 text-status-success" />
        <div className="flex items-center gap-2">
          {systemServices.map((service) => (
            <div key={service.name} className="flex items-center gap-1">
              {getStatusDot(service.status)}
              <span className="text-muted-foreground">{service.name}</span>
              {service.latency && (
                <span className="text-muted-foreground/60 tabular-nums">{service.latency}ms</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}