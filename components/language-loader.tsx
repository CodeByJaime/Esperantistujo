"use client";
import { useState, useEffect, createContext, useContext } from "react";
import { I18nProvider } from "@/lib/i18n";
import { useUserStore } from "@/lib/store";
import { settingsOperations } from "@/lib/supabase";
import { LanguageLoadingScreen } from "@/components/ui";
import type { Language } from "@/lib/i18n";

interface LanguageContextType {
  isLoading: boolean;
  detectedLanguage: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguageLoader() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguageLoader must be used within LanguageLoader');
  return context;
}

interface LanguageLoaderProps {
  children: React.ReactNode;
}

// LanguageLoader.tsx
export function LanguageLoader({ children }: LanguageLoaderProps) {
  const { user } = useUserStore();
  const [userLanguage, setUserLanguage] = useState<Language>("eo");
  const [isLoading, setIsLoading] = useState(true);
  const [detectedLanguage, setDetectedLanguage] = useState<string>("eo");
  const [translationsLoaded, setTranslationsLoaded] = useState(false);

  // Detect browser language on mount
  useEffect(() => {
    const browserLang = navigator.language.split('-')[0];
    const supportedLanguages: Language[] = ['eo', 'en', 'es', 'fr', 'de'];
    const detected = supportedLanguages.includes(browserLang as Language) ? browserLang : 'eo';
    setDetectedLanguage(detected);
  }, []);

  useEffect(() => {
    const loadUserLanguage = async () => {
      if (!user?.id) {
        setIsLoading(false);
        setTranslationsLoaded(true);
        return;
      }
      try {
        const settings = await settingsOperations.getSettings(user.id);
        setUserLanguage(settings?.interface_language || "eo");
      } catch {
        setUserLanguage("eo");
      } finally {
        setIsLoading(false);
      }
    };
    loadUserLanguage();
  }, [user?.id]);

  const isFullyLoaded = !isLoading && translationsLoaded;

  // Estados para controlar la transición
  const [showContent, setShowContent] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  
  useEffect(() => {
    if (isFullyLoaded) {
      // Esperar 30ms después de cargar configuración del usuario
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true); // Iniciar fade out
      }, 30);
      
      // Esperar 280ms total (30ms + 250ms fade) antes de mostrar contenido
      // Reducimos el tiempo para evitar pantalla negra
      const contentTimer = setTimeout(() => {
        setShowContent(true);
      }, 280);
      
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(contentTimer);
      };
    } else {
      setShowContent(false);
      setIsFadingOut(false);
    }
  }, [isFullyLoaded]);

  if (!showContent) {
    return <LanguageLoadingScreen isFadingOut={isFadingOut} />;
  }

  // Cada vez que userLanguage cambia, I18nProvider se remonta con el idioma correcto
  return (
    <LanguageContext.Provider value={{ isLoading: false, detectedLanguage }}>
      <I18nProvider 
        key={userLanguage} 
        initialLanguage={userLanguage}
        onTranslationsLoaded={() => setTranslationsLoaded(true)}
      >
        <div className="animate-fade-in">
          {children}
        </div>
      </I18nProvider>
    </LanguageContext.Provider>
  );
}