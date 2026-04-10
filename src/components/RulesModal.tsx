import type { Rank } from '../types';
import { useLanguage } from '../context/useLanguage';
import { translations } from '../i18n/translations';

interface RulesModalProps {
  onClose: () => void;
  onStartGame?: () => void;
  showStartButton?: boolean;
}

export function RulesModal({ onClose, onStartGame, showStartButton = false }: RulesModalProps) {
  const { language } = useLanguage();
  const t = translations[language];

  const regularCards: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q'];

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <h2 className="modal-title">{t.rulesModalTitle}</h2>
        <div className="modal-content">
          <p className="rules-intro">{t.rulesModalIntro}</p>

          <div className="rules-section">
            <h3 className="rules-section-title">{t.cardRulesTitle}</h3>
            <ul className="rules-list">
              {regularCards.map((rank) => (
                <li key={rank} className="rule-item">
                  <span className="rule-card">{rank}</span>
                  <span className="rule-text">{t.cardRules[rank]}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rules-section">
            <h3 className="rules-section-title">👑 {t.kingRulesTitle}</h3>
            <p className="king-intro">{t.kingRulesIntro}</p>
            <ul className="rules-list king-rules">
              {t.kingRules.map((rule, index) => (
                <li key={index} className="rule-item king-item">
                  <span className="rule-card king-order">
                    {t.kingOrdinals[index]} K
                  </span>
                  <span className="rule-text">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {showStartButton && onStartGame && (
          <button className="btn btn-primary" onClick={onStartGame}>
            {t.startGame}
          </button>
        )}
      </div>
    </div>
  );
}
