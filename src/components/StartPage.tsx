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
        <h1 className="game-title">🍺 {t.gameTitle} 🍺</h1>
        <p className="game-subtitle">{t.subtitle}</p>
        <div className="card-stack-wrapper">
          <div className="card-stack-card"><span className="card-stack-icon">🍺</span></div>
          <div className="card-stack-card"><span className="card-stack-icon">🍺</span></div>
          <div className="card-stack-card"><span className="card-stack-icon">🍺</span></div>
        </div>
        <button className="btn btn-primary btn-large" onClick={onStartGame}>
          {t.startGame}
        </button>
        <button className="btn btn-secondary" onClick={() => setShowRules(true)}>
          📖 {t.rules}
        </button>
      </div>
      {showRules && (
        <RulesModal
          onClose={() => setShowRules(false)}
          showStartButton={false}
        />
      )}
    </div>
  );
}
