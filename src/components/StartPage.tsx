import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { RulesModal } from './RulesModal';
import { useLanguage } from '../context/useLanguage';
import { translations } from '../i18n/translations';

interface StartPageProps {
  onStartGame: () => void;
}

export function StartPage({ onStartGame }: StartPageProps) {
  const [showRules, setShowRules] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="page start-page">
      <div className="controls-corner">
        <LanguageToggle />
        <ThemeToggle />
      </div>
      <div className="start-content">
        <h1 className="game-title">{t.gameTitle}</h1>
        <button
          className="btn btn-primary btn-large"
          onClick={() => setShowRules(true)}
        >
          {t.startGame}
        </button>
      </div>
      {showRules && (
        <RulesModal
          onClose={() => setShowRules(false)}
          onStartGame={onStartGame}
        />
      )}
    </div>
  );
}
