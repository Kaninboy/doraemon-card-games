import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { StartPage } from './components/StartPage';
import { GamePage } from './components/GamePage';
import type { Page } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('start');

  const handleStartGame = () => {
    setCurrentPage('game');
  };

  const handleRestart = () => {
    setCurrentPage('start');
  };

  return (
    <ThemeProvider>
      {currentPage === 'start' && (
        <StartPage onStartGame={handleStartGame} />
      )}
      {currentPage === 'game' && (
        <GamePage onRestart={handleRestart} />
      )}
    </ThemeProvider>
  );
}

export default App;
