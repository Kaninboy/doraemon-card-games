# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React + TypeScript + Vite web app for a Doraemon-themed drinking card game. Players draw cards from a standard 52-card deck and follow the rule shown for each card. The game is card-only (no player tracking). Kings have a special 4-step challenge system based on draw order (1st–4th King each has a different rule).

**Tech stack:** React 19, TypeScript 5.9, Vite 7, pure CSS with CSS variables, localStorage for persistence, lucide-react for icons. No backend, no authentication.

---

## Commands

```bash
npm run dev       # Start dev server (Vite)
npm run build     # TypeScript check + production build
npm run lint      # ESLint
npm run preview   # Preview production build
npm test          # Run Vitest tests
```

Run tests with `npm test` (Vitest). Place test files next to source files as `*.test.ts` or `*.test.tsx`.

## Architecture

```
src/
  components/     # One component per file
    StartPage.tsx       # Welcome screen with title and start button
    GamePage.tsx        # Main game — draws cards, shows rules, tracks state
    CardDisplay.tsx     # Renders a poker-style playing card (suit, rank, corners)
    RulesModal.tsx      # Modal overlay showing all card rules
    ThemeToggle.tsx     # Light/dark mode toggle (Sun/Moon icons from lucide-react)
    LanguageToggle.tsx  # EN/TH language toggle (Globe icon from lucide-react)
  context/
    ThemeContextDef.ts      # Theme type + context creation
    ThemeContext.tsx         # ThemeProvider — reads/writes localStorage, sets data-theme
    useTheme.ts             # Hook to consume ThemeContext
    LanguageContextDef.ts   # Language type + context creation
    LanguageContext.tsx      # LanguageProvider — reads/writes localStorage
    useLanguage.ts           # Hook to consume LanguageContext
  i18n/
    translations.ts     # All EN + TH strings: UI labels, card rules, king rules, modal text
  types/
    index.ts            # Card, GameState, Rank, Suit, Page types
  utils/
    deck.ts             # createDeck, shuffleDeck, drawRandomCard, getSuitSymbol, getSuitColor
    gameState.ts        # saveGameState, loadGameState, clearGameState, createInitialGameState, drawCard
  test/
    setup.ts            # Vitest setup — imports @testing-library/jest-dom matchers
  index.css             # ALL styles — global layout, components, themes, responsive breakpoints
  App.tsx               # Root component — manages page state (start/game), wraps ThemeProvider + LanguageProvider
  main.tsx              # Entry point
```

### Key Patterns

- **Context pattern (ThemeContext / LanguageContext):** Three files each — `*ContextDef.ts` defines the type and creates the context, `*Context.tsx` provides it, `use*.ts` consumes it. Follow this pattern for any new context.
- **localStorage keys:** `doraemon-card-game-theme` (theme), `doraemon-card-game-state` (game state), `doraemon-card-game-language` (language, `'en' | 'th'`, default `'en'`).
- **CSS variables:** Defined in `index.css` using `[data-theme="light"]` and `[data-theme="dark"]` selectors. Variables include `--bg-color`, `--text-color`, `--card-bg`, `--button-bg`, `--button-hover`, `--modal-bg`, `--shadow-color`, `--border-color`, `--badge-bg`, `--badge-text`.
- **Page navigation:** App.tsx uses `useState<'start' | 'game'>` — no router.
- **Translations:** All UI strings and card rules live in `src/i18n/translations.ts`. Components read the current locale with `const { language } = useLanguage(); const t = translations[language];` then use `t.someKey`, `t.cardRules[rank]`, `t.kingRules[kingsDrawn - 1]`. No wrapper function needed.
- **Icons:** Use `lucide-react` for all icons. Current usage: `Sun`, `Moon` (ThemeToggle), `Globe` (LanguageToggle), `BookOpen` (rules button in GamePage & StartPage) — all at `size={20}`.

## Coding Conventions

- Follow the existing file/folder structure — don't reorganize unless asked
- All styles go in `src/index.css` using CSS variables — no CSS modules, no styled-components, no Tailwind
- Types go in `src/types/index.ts`
- Utility logic goes in `src/utils/`
- One component per file in `src/components/`
- Keep it dependency-free — no new dependencies unless explicitly approved (see below)

## Dependencies

- **No new dependencies** unless explicitly requested
- **Installed:** `lucide-react` — use for all icons
- **Forbidden patterns:** No Tailwind, no CSS-in-JS, no component libraries (MUI, Chakra, etc.), no i18n libraries, no animation libraries

