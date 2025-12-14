import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface MapViewProps {
  className?: string;
  onMarkerClick?: (unitId: string) => void;
}

// Simulated unit data
const UNITS = [
  { id: '1', name: '제1사단', lat: 37.9, lng: 127.0, risk: 45 },
  { id: '2', name: '제2사단', lat: 37.7, lng: 127.1, risk: 32 },
  { id: '3', name: '제3사단', lat: 37.5, lng: 126.9, risk: 68 },
  { id: '4', name: '제5사단', lat: 37.6, lng: 127.2, risk: 22 },
  { id: '5', name: '제6사단', lat: 38.0, lng: 127.3, risk: 55 },
  { id: '6', name: '제7사단', lat: 37.8, lng: 127.5, risk: 78 },
];

export function MapView({ className, onMarkerClick }: MapViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
      draw();
    };

    const getRiskColor = (risk: number) => {
      if (risk < 25) return 'hsl(142, 76%, 36%)';
      if (risk < 50) return 'hsl(45, 93%, 47%)';
      if (risk < 75) return 'hsl(25, 95%, 53%)';
      return 'hsl(0, 84%, 60%)';
    };

    const draw = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      // Dark map background
      ctx.fillStyle = 'hsl(150, 40%, 10%)';
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = 'hsl(150, 30%, 18%)';
      ctx.lineWidth = 1;
      const gridSize = 50;

      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Simulated Korea outline
      ctx.beginPath();
      ctx.strokeStyle = 'hsl(150, 45%, 35%)';
      ctx.lineWidth = 2;
      
      // Simplified peninsula shape
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const scale = Math.min(width, height) * 0.35;

      ctx.moveTo(centerX - scale * 0.3, centerY - scale * 0.8);
      ctx.quadraticCurveTo(centerX + scale * 0.5, centerY - scale * 0.6, centerX + scale * 0.4, centerY);
      ctx.quadraticCurveTo(centerX + scale * 0.5, centerY + scale * 0.5, centerX + scale * 0.2, centerY + scale * 0.8);
      ctx.quadraticCurveTo(centerX - scale * 0.2, centerY + scale * 0.9, centerX - scale * 0.4, centerY + scale * 0.5);
      ctx.quadraticCurveTo(centerX - scale * 0.5, centerY, centerX - scale * 0.3, centerY - scale * 0.8);
      ctx.stroke();

      // Draw heatmap overlay (simplified)
      UNITS.forEach((unit, index) => {
        const x = centerX + (index % 3 - 1) * scale * 0.5;
        const y = centerY + (Math.floor(index / 3) - 1) * scale * 0.4;
        const radius = 40 + unit.risk * 0.5;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        const color = getRiskColor(unit.risk);
        gradient.addColorStop(0, color.replace(')', ', 0.4)').replace('hsl', 'hsla'));
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw unit markers
      UNITS.forEach((unit, index) => {
        const x = centerX + (index % 3 - 1) * scale * 0.5;
        const y = centerY + (Math.floor(index / 3) - 1) * scale * 0.4;

        // Marker glow
        ctx.shadowColor = getRiskColor(unit.risk);
        ctx.shadowBlur = 10;

        // Marker circle
        ctx.fillStyle = getRiskColor(unit.risk);
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();

        // Inner dot
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;

        // Label
        ctx.fillStyle = 'hsl(210, 40%, 98%)';
        ctx.font = '11px "Noto Sans KR", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(unit.name, x, y + 20);
      });
    };

    window.addEventListener('resize', resize);
    resize();

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const scale = Math.min(width, height) * 0.35;

      UNITS.forEach((unit, index) => {
        const ux = centerX + (index % 3 - 1) * scale * 0.5;
        const uy = centerY + (Math.floor(index / 3) - 1) * scale * 0.4;
        const distance = Math.sqrt((x - ux) ** 2 + (y - uy) ** 2);

        if (distance < 20) {
          onMarkerClick?.(unit.id);
        }
      });
    };

    canvas.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('click', handleClick);
    };
  }, [onMarkerClick]);

  return (
    <div className={cn('relative rounded-xl overflow-hidden', className)}>
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer"
      />
      
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 floating-panel p-3">
        <p className="text-xs font-medium text-foreground mb-2">위험도</p>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-risk-safe" />
            <span className="text-muted-foreground">안전</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-risk-caution" />
            <span className="text-muted-foreground">관심</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-risk-warning" />
            <span className="text-muted-foreground">주의</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-risk-danger" />
            <span className="text-muted-foreground">경고</span>
          </div>
        </div>
      </div>

      {/* Coordinates */}
      <div className="absolute top-4 right-4 floating-panel px-3 py-2">
        <p className="text-xs font-mono text-muted-foreground">
          37.5665° N, 126.9780° E
        </p>
      </div>
    </div>
  );
}
