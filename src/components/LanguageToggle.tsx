import { useLanguage } from '../context/useLanguage';

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      className="language-toggle"
      onClick={toggleLanguage}
      aria-label={`Switch to ${language === 'en' ? 'Thai' : 'English'}`}
    >
      {language === 'en' ? 'TH' : 'EN'}
    </button>
  );
}
