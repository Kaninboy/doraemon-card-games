import { useState, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { CardDisplay } from './CardDisplay';
import type { GameState } from '../types';
import { 
  saveGameState, 
  loadGameState, 
  createInitialGameState, 
  drawCard,
  getCardRule,
  clearGameState
} from '../utils/gameState';

export function GamePage() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = loadGameState();
    return saved || createInitialGameState();
  });

  // Save game state whenever it changes
  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  const handleDrawCard = () => {
    if (gameState.deck.length === 0) return;
    const newState = drawCard(gameState);
    setGameState(newState);
  };

const handleResetGame = () => {
  clearGameState();  // Clear old state
  const newState = createInitialGameState();
  saveGameState(newState);  // Immediately save new state
  setGameState(newState);
};

  const { currentCard, deck, kingsDrawn, isGameOver } = gameState;
  const cardsRemaining = deck.length;

  // Get the rule for the current card
  const currentRule = currentCard ? getCardRule(currentCard, kingsDrawn) : '';

  return (
    <div className="page game-page">
      <ThemeToggle className="theme-toggle-corner" />
      
      <div className="game-header">
        <h1 className="game-title-small">Doraemon Card Game</h1>
        <div className="cards-remaining">
          Cards remaining: {cardsRemaining}
        </div>
      </div>

      <div className="game-content">
        {!currentCard && !isGameOver && (
          <div className="game-start">
            <p className="game-instruction">Click the button to draw your first card!</p>
            <button className="btn btn-primary btn-large" onClick={handleDrawCard}>
              Draw Card
            </button>
          </div>
        )}

        {currentCard && (
          <div className="card-section">
            <CardDisplay card={currentCard} />
            
            <div className="card-rule">
              <h3 className="rule-title">
                {currentCard.rank === 'K' 
                  ? `Card: K #${kingsDrawn}` 
                  : `Card: ${currentCard.rank}`}
              </h3>
              <p className="rule-text">
                {currentRule || 'Rule will be added here...'}
              </p>
            </div>
          </div>
        )}

        {isGameOver && (
          <div className="game-over">
            <h2 className="game-over-title">Game Over!</h2>
            <p className="game-over-text">All cards have been drawn.</p>
          </div>
        )}

        <div className="game-buttons">
          {!isGameOver && currentCard && (
            <button className="btn btn-primary" onClick={handleDrawCard}>
              Draw Next Card
            </button>
          )}
          
          {isGameOver ? (
            <button className="btn btn-primary btn-large" onClick={handleResetGame}>
              Play Again
            </button>
          ) : currentCard && (
            <button className="btn btn-secondary" onClick={handleResetGame}>
              Restart Game
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
