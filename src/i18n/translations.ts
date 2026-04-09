export type Language = 'en' | 'th';

export const translations = {
  en: {
    // UI
    gameTitle:        'Doraemon Card Game',
    startGame:        'Start Game',
    rules:            'Rules',
    drawCard:         'Draw Card',
    drawNextCard:     'Draw Next Card',
    restartGame:      'Restart Game',
    playAgain:        'Play Again',
    cardsRemaining:   'Cards remaining',
    clickToDrawFirst: 'Click the button to draw your first card!',
    gameOver:         'Game Over!',
    allCardsDrawn:    'All cards have been drawn.',
    card:             'Card',
    king:             'K',

    // Rules modal
    rulesModalTitle:  'Game Rules',
    rulesModalIntro:  'Draw cards from a deck of 52. Each card has a rule you must follow!',
    cardRulesTitle:   'Card Rules',
    kingRulesTitle:   'King Rules (Special!)',
    kingRulesIntro:   'Kings have different rules based on the order they are drawn:',
    kingOrdinals:     ['1st', '2nd', '3rd', '4th'] as readonly string[],

    // Card rules (Rank → string)
    cardRules: {
      'A':  'Drink 1 shot',
      '2':  'Drink 2 shots',
      '3':  'Drink 3 shots',
      '4':  'Drink 4 shots',
      '5':  'Choose your buddy',
      '6':  'Play category game',
      '7':  'Play Seven Up game',
      '8':  'You can go to toilet once!',
      '9':  'Your left person drinks 1 shot',
      '10': 'Your right person drinks 1 shot',
      'J':  'Play copy-the-pose game',
      'Q':  'Everyone cannot talk to you TT',
      'K':  '',
    },

    // King rules (index = draw order 0–3)
    kingRules: [
      'Create the challenge: What to do?',
      'Create the challenge: When to do?',
      'Create the challenge: How to do it? / How long?',
      'Do the challenge!',
    ] as readonly string[],
  },

  th: {
    // UI
    gameTitle:        'เกมไพ่โดราเอมอน',
    startGame:        'เริ่มเกม',
    rules:            'กฎกติกา',
    drawCard:         'จั่วไพ่',
    drawNextCard:     'จั่วไพ่ถัดไป',
    restartGame:      'เริ่มเกมใหม่',
    playAgain:        'เล่นอีกครั้ง',
    cardsRemaining:   'ไพ่ที่เหลือ',
    clickToDrawFirst: 'กดปุ่มเพื่อจั่วไพ่ใบแรก!',
    gameOver:         'เกมจบแล้ว!',
    allCardsDrawn:    'ไพ่ทุกใบถูกจั่วแล้ว',
    card:             'ไพ่',
    king:             'K',

    // Rules modal
    rulesModalTitle:  'กฎกติกา',
    rulesModalIntro:  'จั่วไพ่จากสำรับ 52 ใบ ไพ่แต่ละใบมีกฎที่ต้องทำตาม!',
    cardRulesTitle:   'กฎของไพ่',
    kingRulesTitle:   'กฎของไพ่ K (พิเศษ!)',
    kingRulesIntro:   'ไพ่ K มีกฎต่างกันขึ้นอยู่กับลำดับที่จั่ว:',
    kingOrdinals:     ['ที่ 1', 'ที่ 2', 'ที่ 3', 'ที่ 4'] as readonly string[],

    // Card rules
    cardRules: {
      'A':  'ดื่ม 1 ช็อต',
      '2':  'ดื่ม 2 ช็อต',
      '3':  'ดื่ม 3 ช็อต',
      '4':  'ดื่ม 4 ช็อต',
      '5':  'เลือกคู่หูของคุณ',
      '6':  'เล่นเกมหมวดหมู่',
      '7':  'เล่นเกม Seven Up',
      '8':  'คุณสามารถไปห้องน้ำได้หนึ่งครั้ง!',
      '9':  'คนทางซ้ายของคุณดื่ม 1 ช็อต',
      '10': 'คนทางขวาของคุณดื่ม 1 ช็อต',
      'J':  'เล่นเกมเลียนแบบท่าทาง',
      'Q':  'ทุกคนห้ามพูดกับคุณ TT',
      'K':  '',
    },

    // King rules
    kingRules: [
      'สร้าง challenge: ทำอะไร?',
      'สร้าง challenge: ทำเมื่อไหร่?',
      'สร้าง challenge: ทำอย่างไร? / นานแค่ไหน?',
      'โดน challenge!',
    ] as readonly string[],
  },
} as const;
