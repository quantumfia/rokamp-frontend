import { useState, useEffect } from 'react';

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
    { name: '서버', status: 'online', latency: 24 },
    { name: 'DB', status: 'online', latency: 12 },
    { name: 'API', status: 'online', latency: 45 },
    { name: 'AI', status: 'online', latency: 156 },
  ];

  const getStatusDot = (status: SystemStatus) => {
    switch (status) {
      case 'online':
        return <span className="w-1.5 h-1.5 rounded-full bg-risk-safe" />;
      case 'warning':
        return <span className="w-1.5 h-1.5 rounded-full bg-risk-caution" />;
      case 'offline':
        return <span className="w-1.5 h-1.5 rounded-full bg-risk-danger" />;
    }
  };

  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-risk-safe';
    if (score < 60) return 'text-risk-caution';
    return 'text-risk-danger';
  };

  return (
    <div className="flex items-center justify-between gap-6 p-3 rounded-lg border border-border bg-card text-sm">
      {/* 날짜/시간 */}
      <div className="flex items-center gap-2 pr-6 border-r border-border">
        <span className="text-muted-foreground">{date}</span>
        <span className="font-mono font-medium text-foreground">{time}</span>
      </div>

      {/* 기상 정보 */}
      <div className="flex items-center gap-4 pr-6 border-r border-border">
        <span className="text-muted-foreground">{weatherData.condition}</span>
        <span className="font-medium">{weatherData.temp}°C</span>
        {weatherData.warning && (
          <span className="text-risk-caution">{weatherData.warning}</span>
        )}
      </div>

      {/* 현황 요약 */}
      <div className="flex items-center gap-6 pr-6 border-r border-border">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">전군 위험도</span>
          <span className={`font-semibold ${getRiskColor(summaryData.avgRiskScore)}`}>
            {summaryData.avgRiskScore}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">금일 훈련</span>
          <span className="font-semibold text-foreground">{summaryData.trainingUnits}개 부대</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">24h 알림</span>
          <span className="font-semibold text-risk-caution">{summaryData.alerts24h}건</span>
        </div>
      </div>

      {/* 시스템 상태 */}
      <div className="flex items-center gap-4">
        <span className="text-muted-foreground">시스템</span>
        <div className="flex items-center gap-3">
          {systemServices.map((service) => (
            <div key={service.name} className="flex items-center gap-1.5">
              {getStatusDot(service.status)}
              <span className="text-muted-foreground">{service.name}</span>
              {service.latency && (
                <span className="text-muted-foreground/60">{service.latency}ms</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
