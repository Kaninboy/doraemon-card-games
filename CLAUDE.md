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
- **Icons:** Use `lucide-react` for all icons. Current usage: `Sun`, `Moon` (ThemeToggle), `Globe` (LanguageToggle) — all at `size={20}`.

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

## Feature Guide: UX Redesign

### Task List
- Add deck illustration to Start Page
- Add short subtitle on the Start Page
- Move rules to a secondary button on the Start Page
- Add a rules button to show RulesModal on the Game Page
- Click "Start Game" goes to Game Page immediately (no modal first)
- Fix button being shorter than rule box on mobile Game Page

### Design Principles
- **Mobile-first:** Game is primarily played on phones — min 44px tap targets, optimize spacing and font sizes for small screens
- **Game-like feel:** Bold, fun, not minimal/corporate. CardDisplay should feel like a real playing card (better typography, proportions, suit rendering)
- **Rule display:** Visually prominent, easy to read at a glance — large text, strong contrast
- **Animations:** CSS-only card flip/reveal animation on draw — no animation libraries
- **Buttons:** Tactile, game-appropriate styling
- **Theming:** Extend existing CSS variables (`--bg-color`, etc.) — don't replace them. Maintain full dark/light mode support.
- **Responsive:** Ensure everything works across mobile, tablet, and desktop breakpoints

## Key Files Reference

| File | What it contains |
|------|-----------------|
| `src/i18n/translations.ts` | All EN + TH strings — UI labels, card rules, king rules, modal text |
| `src/types/index.ts` | Card, GameState, Rank, Suit, Page types |
| `src/index.css` | ALL styles including CSS variables, responsive breakpoints |
| `src/utils/gameState.ts` | Game logic: draw, save/load state |
| `src/utils/deck.ts` | Deck creation, shuffle, suit helpers |
| `src/App.tsx` | Root component, page routing, ThemeProvider + LanguageProvider wrapper |
| `src/components/GamePage.tsx` | Main game state management and UI |
| `src/components/CardDisplay.tsx` | Playing card visual rendering |
| `src/context/ThemeContext.tsx` | ThemeProvider — three-file context pattern (Def / Provider / Hook) |
| `src/context/LanguageContext.tsx` | LanguageProvider — same three-file pattern as ThemeContext |
