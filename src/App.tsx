import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { StartPage } from './components/StartPage';
import { GamePage } from './components/GamePage';
import type { Page } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('start');

  const handleStartGame = () => {
    setCurrentPage('game');
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        {currentPage === 'start' && (
          <StartPage onStartGame={handleStartGame} />
        )}
        {currentPage === 'game' && (
          <GamePage />
        )}
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
