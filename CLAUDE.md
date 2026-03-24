# CLAUDE.md — Doraemon Card Game

## Project Overview

A React + TypeScript + Vite web app for a Doraemon-themed drinking card game. Players draw cards from a standard 52-card deck and follow the rule shown for each card. The game is card-only (no player tracking). Kings have a special 4-step challenge system based on draw order (1st–4th King each has a different rule).

**Tech stack:** React 19, TypeScript 5.9, Vite 7, pure CSS with CSS variables, localStorage for persistence. No backend, no authentication.

## Commands

```bash
npm run dev       # Start dev server (Vite)
npm run build     # TypeScript check + production build
npm run lint      # ESLint
npm run preview   # Preview production build
```

There are no tests yet. When adding tests, use Vitest (compatible with the Vite setup). Place test files next to source files as `*.test.ts` or `*.test.tsx`.

## Architecture

```
src/
  components/     # One component per file
    StartPage.tsx       # Welcome screen with title and start button
    GamePage.tsx        # Main game — draws cards, shows rules, tracks state
    CardDisplay.tsx     # Renders a poker-style playing card (suit, rank, corners)
    RulesModal.tsx      # Modal overlay showing all card rules
    ThemeToggle.tsx     # Light/dark mode toggle button
  context/
    ThemeContextDef.ts  # Theme type + context creation
    ThemeContext.tsx     # ThemeProvider — reads/writes localStorage, sets data-theme
    useTheme.ts         # Hook to consume ThemeContext
  types/
    index.ts            # Card, GameState, Rank, Suit, Page types + cardRules + kingRules
  utils/
    deck.ts             # createDeck, shuffleDeck, drawRandomCard, getSuitSymbol, getSuitColor
    gameState.ts        # saveGameState, loadGameState, clearGameState, createInitialGameState, drawCard, getCardRule
  index.css             # ALL styles — global layout, components, themes, responsive breakpoints
  App.tsx               # Root component — manages page state (start/game), wraps with ThemeProvider
  main.tsx              # Entry point
```

### Key Patterns

- **ThemeContext pattern:** `ThemeContextDef.ts` defines the type and creates the context, `ThemeContext.tsx` provides it, `useTheme.ts` consumes it. Theme is persisted to localStorage under key `doraemon-card-game-theme`. The provider sets `data-theme` attribute on `document.documentElement` for CSS variable switching.
- **localStorage keys:** `doraemon-card-game-theme` (theme), `doraemon-card-game-state` (game state)
- **CSS variables:** Defined in `index.css` using `[data-theme="light"]` and `[data-theme="dark"]` selectors. Variables include `--bg-color`, `--text-color`, `--card-bg`, `--button-bg`, `--button-hover`, `--modal-bg`, `--shadow-color`, `--border-color`, `--badge-bg`, `--badge-text`.
- **Page navigation:** App.tsx uses `useState<'start' | 'game'>` — no router.
- **Card rules:** Defined as maps in `src/types/index.ts`. Regular cards use `cardRules` (Record<Rank, string>), Kings use `kingRules` (string array indexed by draw order).

## Coding Conventions

- Follow the existing file/folder structure — don't reorganize unless asked
- All styles go in `src/index.css` using CSS variables — no CSS modules, no styled-components, no Tailwind
- Types go in `src/types/index.ts`
- Utility logic goes in `src/utils/`
- One component per file in `src/components/`
- Keep it dependency-free — no new dependencies unless explicitly approved (see below)

## Dependencies

- **No new dependencies** unless explicitly requested
- **Approved:** `lucide-react` — use for all icons (replacing emoji-based icons like the current theme toggle)
- **Forbidden patterns:** No Tailwind, no CSS-in-JS, no component libraries (MUI, Chakra, etc.), no i18n libraries, no animation libraries

## Feature Guide: Thai Language Support

Add English/Thai language toggle following the existing ThemeContext pattern:

1. Create `src/i18n/translations.ts` with a translations object:
   ```ts
   export const translations = {
     en: { drawCard: "Draw Card", cardsRemaining: "Cards remaining", ... },
     th: { drawCard: "จั่วไพ่", cardsRemaining: "ไพ่ที่เหลือ", ... }
   }
   ```
2. Create `src/context/LanguageContextDef.ts`, `LanguageContext.tsx`, `useLanguage.ts` — mirror the ThemeContext structure exactly
3. Store language preference in localStorage (key: `doraemon-card-game-language`)
4. Add a language toggle (EN/TH) near the theme toggle
5. Card rules (`cardRules`, `kingRules`) need Thai versions — extend the translations object to include them
6. Wrap the app with `LanguageProvider` alongside `ThemeProvider` in `App.tsx`

## Feature Guide: UX Redesign

### Task List
- Add deck illustration to Start Page
- Add short subtitle on the Start Page
- Move rules to a secondary button on the Start Page
- Add a rules button to show RulesModal on the Game Page
- Click "Start Game" goes to Game Page immediately (no modal first)
- Fix button being shorter than rule box on mobile Game Page
- Replace emoji icons with `lucide-react` icons

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
| `src/types/index.ts` | All types + `cardRules` map + `kingRules` array |
| `src/index.css` | ALL styles including CSS variables, responsive breakpoints |
| `src/utils/gameState.ts` | Game logic: draw, save/load, card rule lookup |
| `src/utils/deck.ts` | Deck creation, shuffle, suit helpers |
| `src/App.tsx` | Root component, page routing, ThemeProvider wrapper |
| `src/components/GamePage.tsx` | Main game state management and UI |
| `src/components/CardDisplay.tsx` | Playing card visual rendering |
| `src/context/ThemeContext.tsx` | ThemeProvider — pattern to follow for LanguageContext |
