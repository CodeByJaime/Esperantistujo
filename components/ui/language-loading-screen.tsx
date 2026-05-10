'use client'
import { LoadingSpinner } from "./loading-spinner";
import { useState, useEffect } from "react";

interface LanguageLoadingScreenProps {
  isFadingOut?: boolean;
}

export function LanguageLoadingScreen({ isFadingOut = false }: LanguageLoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isFadingOut) {
      const timer = setTimeout(() => setIsVisible(false), 250); // 250ms para fade out
      return () => clearTimeout(timer);
    }
  }, [isFadingOut]);

  if (!isVisible) return null;

  return (
    <div 
      className={`flex items-center justify-center min-h-screen bg-[#0a0a0a] transition-opacity duration-300 ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-esperanto-verda/15 border border-esperanto-verda/30 flex items-center justify-center mx-auto mb-4">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    </div>
  );
}
