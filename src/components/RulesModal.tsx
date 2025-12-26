import { cardRules, kingRules, type Rank } from '../types';

interface RulesModalProps {
  onClose: () => void;
  onStartGame: () => void;
}

export function RulesModal({ onClose, onStartGame }: RulesModalProps) {
  const regularCards: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q'];

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <h2 className="modal-title">Game Rules</h2>
        <div className="modal-content">
          <p className="rules-intro">
            Draw cards from a deck of 52. Each card has a rule you must follow!
          </p>
          
          <div className="rules-section">
            <h3 className="rules-section-title">Card Rules</h3>
            <ul className="rules-list">
              {regularCards.map((rank) => (
                <li key={rank} className="rule-item">
                  <span className="rule-card">{rank}</span>
                  <span className="rule-text">{cardRules[rank]}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rules-section">
            <h3 className="rules-section-title">👑 King Rules (Special!)</h3>
            <p className="king-intro">
              Kings have different rules based on the order they are drawn:
            </p>
            <ul className="rules-list king-rules">
              {kingRules.map((rule, index) => (
                <li key={index} className="rule-item king-item">
                  <span className="rule-card king-order">
                    {index + 1}{index === 0 ? 'st' : index === 1 ? 'nd' : index === 2 ? 'rd' : 'th'} K
                  </span>
                  <span className="rule-text">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button className="btn btn-primary" onClick={onStartGame}>
          Start Game
        </button>
      </div>
    </div>
  );
}
