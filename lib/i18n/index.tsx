"use client";
import { createContext, useContext, useEffect, useState } from 'react';

export type Translations = Record<string, unknown>;
export type Language = 'eo' | 'en' | 'es' | 'fr' | 'de';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  tRaw: (key: string) => unknown;
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string;
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

// ✅ Formatea fecha según el idioma actual
export const formatDate = (date: Date, language: Language, options?: Intl.DateTimeFormatOptions): string => {
  const localeMap = {
    'eo': 'eo-EO',
    'en': 'en-US',
    'es': 'es-ES',
    'fr': 'fr-FR',
    'de': 'de-DE'
  };

  const locale = localeMap[language] || 'eo-EO';

  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  };

  return date.toLocaleDateString(locale, defaultOptions);
};

export function I18nProvider({ children, initialLanguage = 'eo', onTranslationsLoaded }: {
  children: React.ReactNode;
  initialLanguage?: Language;
  onTranslationsLoaded?: () => void;
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
        onTranslationsLoaded?.();
      }
    };
    loadLang();
  }, [language, onTranslationsLoaded]);

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

  // No mostrar pantalla de carga aquí - LanguageLoader se encarga de todo

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, tRaw, formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => formatDate(date, language, options), isLoading }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within an I18nProvider');
  return context;
}

export type UseTranslationReturn = {
  t: (key: string) => string;
  tRaw: (key: string) => unknown;
  language: Language;
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string;
};

export function useTranslation(): UseTranslationReturn {
  const { t, tRaw, language } = useI18n();
  return { t, tRaw, language, formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => formatDate(date, language, options) };
}

export const availableLanguages: { code: Language; name: string }[] = [
  { code: 'eo', name: 'Esperanto' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' }
];