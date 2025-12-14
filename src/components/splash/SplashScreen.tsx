import { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Logo appears
    setTimeout(() => setShowLogo(true), 300);
    
    // Text appears
    setTimeout(() => setShowText(true), 800);
    
    // Progress bar appears
    setTimeout(() => setShowProgress(true), 1200);
    
    // Start loading progress
    setTimeout(() => setLoadingProgress(100), 1400);

    // Start fade out
    setTimeout(() => setFadeOut(true), 3200);

    // Complete splash
    setTimeout(() => onComplete(), 3700);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 bg-background flex flex-col items-center justify-center z-50 transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center justify-center">
        {/* Logo with smooth entrance */}
        <div 
          className={`relative transition-all duration-1000 ease-out ${
            showLogo 
              ? 'opacity-100 scale-100 translate-y-0' 
              : 'opacity-0 scale-75 translate-y-8'
          }`}
        >
          <div className={`absolute -inset-12 bg-primary/5 rounded-full blur-3xl transition-opacity duration-1000 ${
            showLogo ? 'opacity-100' : 'opacity-0'
          }`} />
          <Shield className="w-24 h-24 text-primary relative" strokeWidth={1.5} />
        </div>

        {/* Title with delayed entrance */}
        <div className={`transition-all duration-700 ease-out delay-100 ${
          showText 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4'
        }`}>
          <h1 className="mt-8 text-4xl font-bold text-foreground tracking-widest text-center">
            ROKA-SAPS
          </h1>
        </div>

        {/* Subtitle */}
        <div className={`transition-all duration-700 ease-out delay-200 ${
          showText 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4'
        }`}>
          <p className="mt-3 text-primary/80 text-sm tracking-widest">
            Safety Accident Prediction System
          </p>
          <p className="mt-1 text-muted-foreground text-xs tracking-wider text-center">
            육군 안전사고 예측 시스템
          </p>
        </div>
        
        {/* Progress bar */}
        <div className={`mt-12 transition-all duration-500 ease-out ${
          showProgress 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-2'
        }`}>
          <div className="w-48 h-0.5 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary/60 rounded-full transition-all duration-1500 ease-out"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
