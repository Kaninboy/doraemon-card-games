import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { RulesModal } from './RulesModal';

interface StartPageProps {
  onStartGame: () => void;
}

export function StartPage({ onStartGame }: StartPageProps) {
  const [showRules, setShowRules] = useState(false);

  return (
    <div className="page start-page">
      <ThemeToggle className="theme-toggle-corner" />
      <div className="start-content">
        <h1 className="game-title">Doraemon Card Game</h1>
        <button 
          className="btn btn-primary btn-large"
          onClick={() => setShowRules(true)}
        >
          Start
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
