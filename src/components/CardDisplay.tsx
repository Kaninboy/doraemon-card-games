import { useState, useEffect } from 'react';
import type { Card } from '../types';
import { getSuitSymbol, getSuitColor } from '../utils/deck';

interface CardDisplayProps {
  card: Card;
}

export function CardDisplay({ card }: CardDisplayProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const suitSymbol = getSuitSymbol(card.suit);
  const suitColor = getSuitColor(card.suit);
  const isKing = card.rank === 'K';

  useEffect(() => {
    setIsFlipped(false);
    const timer = setTimeout(() => setIsFlipped(true), 80);
    return () => clearTimeout(timer);
  }, [card.id]);

  return (
    <div className="card-flip-container">
      <div className={`card-flip-inner${isFlipped ? ' is-flipped' : ''}`}>
        {/* Card Back */}
        <div className="card-back-side">
          <div className="card-back-corner card-back-corner-tl">♠︎<br />♥︎</div>
          <span className="card-back-icon">🍺</span>
          <div className="card-back-corner card-back-corner-br">♣︎<br />♦︎</div>
        </div>
        {/* Card Face */}
        <div className={`card-face-side card-display card-${suitColor}${isKing ? ' card-king' : ''}`}>
          <div className="card-corner card-corner-top">
            <span className="card-rank">{card.rank}</span>
            <span className="card-suit">{suitSymbol}</span>
          </div>
          <div className="card-center">
            <span className="card-suit-large">{suitSymbol}</span>
          </div>
          <div className="card-corner card-corner-bottom">
            <span className="card-rank">{card.rank}</span>
            <span className="card-suit">{suitSymbol}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
