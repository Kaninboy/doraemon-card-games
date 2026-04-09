import { Globe } from 'lucide-react';
import { useLanguage } from '../context/useLanguage';

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      className="language-toggle"
      onClick={toggleLanguage}
      aria-label={`Switch to ${language === 'en' ? 'Thai' : 'English'}`}
    >
      <Globe size={20} />
      {language === 'en' ? 'TH' : 'EN'}
    </button>
  );
}
