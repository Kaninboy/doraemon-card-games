import type { GameState, Card } from '../types';
import { cardRules, kingRules } from '../types';
import { createDeck, shuffleDeck } from './deck';

const STORAGE_KEY = 'doraemon-card-game-state';

export function saveGameState(state: GameState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadGameState(): GameState | null {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;
  
  try {
    return JSON.parse(saved) as GameState;
  } catch {
    return null;
  }
}

export function clearGameState(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function createInitialGameState(): GameState {
  return {
    deck: shuffleDeck(createDeck()),
    currentCard: null,
    kingsDrawn: 0,
    isGameOver: false
  };
}

export function drawCard(state: GameState): GameState {
  if (state.deck.length === 0) {
    return { ...state, isGameOver: true };
  }

  const randomIndex = Math.floor(Math.random() * state.deck.length);
  const card = state.deck[randomIndex];
  const remainingDeck = [
    ...state.deck.slice(0, randomIndex),
    ...state.deck.slice(randomIndex + 1)
  ];

  const newKingsDrawn = card.rank === 'K' ? state.kingsDrawn + 1 : state.kingsDrawn;
  const isGameOver = remainingDeck.length === 0;

  return {
    deck: remainingDeck,
    currentCard: card,
    kingsDrawn: newKingsDrawn,
    isGameOver
  };
}

export function getCardRule(card: Card, kingsDrawn: number): string {
  if (card.rank === 'K') {
    // kingsDrawn is already incremented when this is called, so use kingsDrawn - 1 for 0-based index
    return kingRules[kingsDrawn - 1] || '';
  }
  
  return cardRules[card.rank] || '';
}
