export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  suit: Suit;
  rank: Rank;
  id: string;
}

export interface GameState {
  deck: Card[];
  currentCard: Card | null;
  kingsDrawn: number;
  isGameOver: boolean;
}

export type Page = 'start' | 'rules' | 'game';

// Card rules - same for all suits with same number
export const cardRules: Record<Rank, string> = {
  'A': 'Drink 1 shot', // Add your rule here
  '2': 'Drink 2 shots', // Add your rule here
  '3': 'Drink 3 shots', // Add your rule here
  '4': 'Drink 4 shots', // Add your rule here
  '5': 'Choose your buddy', // Add your rule here
  '6': 'Play category game', // Add your rule here
  '7': 'Play Seven Up game', // Add your rule here
  '8': 'You can go to toilet once!', // Add your rule here
  '9': 'Your left person drinks 1 shot', // Add your rule here
  '10': 'Your right person drinks 1 shot', // Add your rule here
  'J': 'Play copy-the-pose game', // Add your rule here
  'Q': 'Everyone cannot talk to you TT', // Add your rule here
  'K': '', // Special handling - rules depend on order drawn
};

// King rules - different based on the order drawn (1st, 2nd, 3rd, 4th)
export const kingRules: string[] = [
  'Create the challenge: What to do?', // 1st King rule - Add your rule here
  'Create the challenge: When to do?', // 2nd King rule - Add your rule here
  'Create the challenge: How to do it? / How long?', // 3rd King rule - Add your rule here
  'Do the challenge!', // 4th King rule - Add your rule here
];
