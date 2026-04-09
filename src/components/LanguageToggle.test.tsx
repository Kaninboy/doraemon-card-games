import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LanguageProvider } from '../context/LanguageContext'
import { LanguageToggle } from './LanguageToggle'

beforeEach(() => {
  localStorage.clear()
})

test('shows TH when language is en', () => {
  render(
    <LanguageProvider>
      <LanguageToggle />
    </LanguageProvider>
  )
  expect(screen.getByRole('button')).toHaveTextContent('TH')
})

test('shows EN when language is th', () => {
  localStorage.setItem('doraemon-card-game-language', 'th')
  render(
    <LanguageProvider>
      <LanguageToggle />
    </LanguageProvider>
  )
  expect(screen.getByRole('button')).toHaveTextContent('EN')
})

test('toggles language on click', async () => {
  const user = userEvent.setup()
  render(
    <LanguageProvider>
      <LanguageToggle />
    </LanguageProvider>
  )
  await user.click(screen.getByRole('button'))
  expect(screen.getByRole('button')).toHaveTextContent('EN')
})

test('renders with language-toggle class', () => {
  render(
    <LanguageProvider>
      <LanguageToggle />
    </LanguageProvider>
  )
  expect(screen.getByRole('button')).toHaveClass('language-toggle')
})
