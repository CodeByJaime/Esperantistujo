"use client";
import { useState, useEffect } from "react";
import { I18nProvider } from "@/lib/i18n";
import { useUserStore } from "@/lib/store";
import { settingsOperations } from "@/lib/supabase";
import type { Language } from "@/lib/i18n";

interface LanguageLoaderProps {
  children: React.ReactNode;
}

// LanguageLoader.tsx
export function LanguageLoader({ children }: LanguageLoaderProps) {
  const { user } = useUserStore();
  const [userLanguage, setUserLanguage] = useState<Language>("eo");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserLanguage = async () => {
      if (!user?.id) {
        setIsLoading(false);
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-esperanto-verda" />
      </div>
    );
  }

  // Cada vez que userLanguage cambia, I18nProvider se remonta con el idioma correcto
  return (
    <I18nProvider key={userLanguage} initialLanguage={userLanguage}>
      {children}
    </I18nProvider>
  );
}