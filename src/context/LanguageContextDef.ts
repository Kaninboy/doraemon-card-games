import { createContext } from 'react';
import type { Language } from '../i18n/translations';

export type { Language };

export interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
