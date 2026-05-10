'use client'
import { LoadingSpinner } from "./loading-spinner";
import { useState, useEffect } from "react";

interface LanguageLoadingScreenProps {
  language?: string;
  isFadingOut?: boolean;
}

export function LanguageLoadingScreen({ language = "eo", isFadingOut = false }: LanguageLoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isFadingOut) {
      const timer = setTimeout(() => setIsVisible(false), 250); // 250ms para fade out
      return () => clearTimeout(timer);
    }
  }, [isFadingOut]);
  // Translations for loading screen - hardcoded to avoid dependency on i18n system
  const translations = {
    eo: {
      title: "Ŝargante lingvajn agordojn...",
      subtitle: "Bonvolu atendi dum ni ŝargas viajn lingvajn preferojn."
    },
    es: {
      title: "Cargando configuración de idioma...",
      subtitle: "Por favor espera mientras cargamos tus preferencias de idioma."
    },
    en: {
      title: "Loading language settings...",
      subtitle: "Please wait while we load your language preferences."
    },
    fr: {
      title: "Chargement des paramètres de langue...",
      subtitle: "Veuillez patienter pendant que nous chargeons vos préférences de langue."
    },
    de: {
      title: "Spracheinstellungen werden geladen...",
      subtitle: "Bitte warten Sie, während wir Ihre Spracheinstellungen laden."
    }
  };

  const { title, subtitle } = translations[language as keyof typeof translations] || translations.eo;

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
        <h2 className="font-display text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="font-sans-dm text-white/50 text-sm max-w-md mx-auto">{subtitle}</p>
      </div>
    </div>
  );
}
