"use client";
import { useState, useEffect, createContext, useContext } from 'react';

export type Translations = Record<string, unknown>;
export type Language = 'eo' | 'en' | 'es' | 'fr' | 'de';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  tRaw: (key: string) => unknown;  // 👈 agregado
  isLoading: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const loadTranslations = async (lang: Language): Promise<Translations> => {
  try {
    const translations = await import(`./locales/${lang}.json`);
    return translations.default;
  } catch {
    console.warn(`Translations for ${lang} not found, falling back to Esperanto`);
    const fallback = await import('./locales/eo.json');
    return fallback.default;
  }
};

// ✅ Retorna el valor raw sin forzar string
const getNestedValue = (obj: Translations, path: string): unknown => {
  const keys = path.split('.');
  let current: unknown = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && !Array.isArray(current) && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  
  return current; // 👈 retorna lo que sea: string, array, objeto
};

export function I18nProvider({ children, initialLanguage = 'eo' }: { 
  children: React.ReactNode; 
  initialLanguage?: Language;
}) {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [translations, setTranslations] = useState<Translations>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLang = async () => {
      setIsLoading(true);
      try {
        const loaded = await loadTranslations(language);
        setTranslations(loaded);
      } catch {
        const fallback = await loadTranslations('eo');
        setTranslations(fallback);
      } finally {
        setIsLoading(false);
      }
    };
    loadLang();
  }, [language]);

  // Solo para strings
  const t = (key: string): string => {
    if (Object.keys(translations).length === 0) return key;
    const value = getNestedValue(translations, key);
    return typeof value === 'string' ? value : key;
  };

  // Para arrays y objetos
  const tRaw = (key: string): unknown => {
    if (Object.keys(translations).length === 0) return undefined;
    return getNestedValue(translations, key);
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, tRaw, isLoading }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within an I18nProvider');
  return context;
}

export function useTranslation() {
  const { t, tRaw } = useI18n();
  return { t, tRaw };  // 👈 exportar tRaw también
}

export const availableLanguages: { code: Language; name: string }[] = [
  { code: 'eo', name: 'Esperanto' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' }
];