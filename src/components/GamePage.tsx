import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { CardDisplay } from './CardDisplay';
import { RulesModal } from './RulesModal';
import type { GameState } from '../types';
import {
  saveGameState,
  loadGameState,
  createInitialGameState,
  drawCard,
  clearGameState
} from '../utils/gameState';
import { useLanguage } from '../context/useLanguage';
import { translations } from '../i18n/translations';

export function GamePage() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = loadGameState();
    return saved || createInitialGameState();
  });
  const [showRules, setShowRules] = useState(false);

  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  const handleDrawCard = () => {
    if (gameState.deck.length === 0) return;
    const newState = drawCard(gameState);
    setGameState(newState);
  };

  const handleResetGame = () => {
    clearGameState();
    const newState = createInitialGameState();
    saveGameState(newState);
    setGameState(newState);
  };

  const { currentCard, deck, kingsDrawn, isGameOver } = gameState;
  const cardsRemaining = deck.length;

  const currentRule = currentCard
    ? currentCard.rank === 'K'
      ? t.kingRules[kingsDrawn - 1] ?? ''
      : t.cardRules[currentCard.rank]
    : '';

  return (
    <div className="page game-page">
      <div className="controls-corner">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      <div className="game-header">
        <h1 className="game-title-small">{t.gameTitle}</h1>
        <div className="game-header-row">
          <button className="rules-btn" onClick={() => setShowRules(true)}>
            <BookOpen size={14} color="var(--accent-color)" strokeWidth={2.5} />
            {t.rules}
          </button>
          <div className="cards-remaining">
            {t.cardsRemaining}: {cardsRemaining}
          </div>
        </div>
      </div>

      <div className="game-content">
        {!currentCard && !isGameOver && (
          <div className="game-start fade-in-up">
            <p className="game-instruction">{t.clickToDrawFirst}</p>
            <button className="btn btn-primary btn-large" onClick={handleDrawCard}>
              {t.drawCard}
            </button>
          </div>
        )}

        {currentCard && (
          <div key={currentCard.id} className="card-section fade-in-up">
            <CardDisplay card={currentCard} />

            <div className="card-rule">
              <h3 className="rule-title">
                {currentCard.rank === 'K'
                  ? `${t.card}: ${t.king} #${kingsDrawn}`
                  : `${t.card}: ${currentCard.rank}`}
              </h3>
              <p className="rule-text">
                {currentRule || ''}
              </p>
            </div>
          </div>
        )}

        {isGameOver && (
          <div className="game-over fade-in-up">
            <h2 className="game-over-title">{t.gameOver}</h2>
            <p className="game-over-text">{t.allCardsDrawn}</p>
          </div>
        )}

        <div className="game-buttons">
          {!isGameOver && currentCard && (
            <button className="btn btn-primary" onClick={handleDrawCard}>
              {t.drawNextCard}
            </button>
          )}

          {isGameOver ? (
            <button className="btn btn-primary btn-large" onClick={handleResetGame}>
              {t.playAgain}
            </button>
          ) : currentCard && (
            <button className="btn btn-secondary" onClick={handleResetGame}>
              {t.restartGame}
            </button>
          )}
        </div>
      </div>

      {showRules && (
        <RulesModal onClose={() => setShowRules(false)} showStartButton={false} />
      )}
    </div>
  );
}
