export type Language = 'en' | 'th';

export const translations = {
  en: {
    // UI
    gameTitle:        'Doraemon Card Game',
    subtitle:         'Draw a card and drink!',
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
      '5':  'Choose your buddy, if you or your buddy drinks, the other one has to drink too!',
      '6':  'Play category game, loser drinks 1 shot',
      '7':  'Play Seven Up game, loser drinks 1 shot',
      '8':  'You can go to toilet once!',
      '9':  'Your left person drinks 1 shot',
      '10': 'Your right person drinks 1 shot',
      'J':  'Play copy-the-pose game, loser drinks 1 shot',
      'Q':  'Everyone cannot talk to you, who talks to you drink 1 shot',
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
    gameTitle:        'เกมไพ่โดเรม่อน',
    subtitle:         'เปิดไพ่แล้วดื่ม!',
    startGame:        'เริ่มเกม',
    rules:            'กติกา',
    drawCard:         'เปิดไพ่',
    drawNextCard:     'เปิดไพ่ถัดไป',
    restartGame:      'เริ่มเกมใหม่',
    playAgain:        'เล่นอีกครั้ง',
    cardsRemaining:   'ไพ่ที่เหลือ',
    clickToDrawFirst: 'กดปุ่มเพื่อเปิดไพ่ใบแรก!',
    gameOver:         'เกมจบแล้ว!',
    allCardsDrawn:    'ไพ่ทุกใบถูกเปิดครบแล้ว',
    card:             'ไพ่',
    king:             'K',

    // Rules modal
    rulesModalTitle:  'กติกา',
    rulesModalIntro:  'เปิดไพ่จากสำรับ 52 ใบ ไพ่แต่ละใบมีกฎที่ต้องทำตาม!',
    cardRulesTitle:   'กฎของไพ่',
    kingRulesTitle:   'กฎของไพ่ K (พิเศษ!)',
    kingRulesIntro:   'ไพ่ K มีกฎต่างกันขึ้นอยู่กับลำดับที่จั่ว:',
    kingOrdinals:     ['1st', '2nd', '3rd', '4th'] as readonly string[],

    // Card rules
    cardRules: {
      'A':  'ดื่ม 1 ช็อต',
      '2':  'ดื่ม 2 ช็อต',
      '3':  'ดื่ม 3 ช็อต',
      '4':  'ดื่ม 4 ช็อต',
      '5':  'เลือกบัดดี้ ถ้าเราหรือบัดดี้โดนดื่ม อีกคนก็ต้องดื่มด้วย!',
      '6':  'เล่นเกมหมวดหมู่ ใครแพ้ดื่ม 1 ช็อต',
      '7':  'เล่นเกม Seven Up ใครแพ้ดื่ม 1 ช็อต',
      '8':  'คุณสามารถไปห้องน้ำได้หนึ่งครั้ง!',
      '9':  'คนซ้ายดื่ม 1 ช็อต',
      '10': 'คนขวาดื่ม 1 ช็อต',
      'J':  'เล่นเกมเลียนแบบท่าทาง ใครแพ้ดื่ม 1 ช็อต',
      'Q':  'ทุกคนห้ามพูดกับคุณ ใครพูดด้วยต้องดื่ม 1 ช็อต',
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
