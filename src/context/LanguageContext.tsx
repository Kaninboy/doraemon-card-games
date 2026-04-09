import { useState, type ReactNode } from 'react';
import { LanguageContext } from './LanguageContextDef';
import type { Language } from '../i18n/translations';

const LANGUAGE_STORAGE_KEY = 'doraemon-card-game-language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return (saved as Language) || 'en';
  });

  const toggleLanguage = () => {
    const next: Language = language === 'en' ? 'th' : 'en';
    localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
    setLanguage(next);
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
