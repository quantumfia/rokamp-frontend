// Critical images to preload
import landingHero from '@/assets/landing-hero.png';
import rokaLogo from '@/assets/roka-logo.svg';

const criticalImages = [landingHero, rokaLogo];

export function preloadCriticalImages(): Promise<void[]> {
  return Promise.all(
    criticalImages.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve(); // Resolve even on error to not block
          img.src = src;
        })
    )
  );
}

// Preload immediately when this module is imported
preloadCriticalImages();
