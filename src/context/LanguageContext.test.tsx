import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LanguageProvider } from './LanguageContext'
import { useLanguage } from './useLanguage'

function TestConsumer() {
  const { language, toggleLanguage } = useLanguage()
  return (
    <>
      <span data-testid="lang">{language}</span>
      <button onClick={toggleLanguage}>toggle</button>
    </>
  )
}

beforeEach(() => {
  localStorage.clear()
})

test('defaults to en', () => {
  render(<LanguageProvider><TestConsumer /></LanguageProvider>)
  expect(screen.getByTestId('lang')).toHaveTextContent('en')
})

test('toggles from en to th', async () => {
  const user = userEvent.setup()
  render(<LanguageProvider><TestConsumer /></LanguageProvider>)
  await user.click(screen.getByText('toggle'))
  expect(screen.getByTestId('lang')).toHaveTextContent('th')
})

test('toggles from th back to en', async () => {
  const user = userEvent.setup()
  render(<LanguageProvider><TestConsumer /></LanguageProvider>)
  await user.click(screen.getByText('toggle'))
  await user.click(screen.getByText('toggle'))
  expect(screen.getByTestId('lang')).toHaveTextContent('en')
})

test('persists language to localStorage on toggle', async () => {
  const user = userEvent.setup()
  render(<LanguageProvider><TestConsumer /></LanguageProvider>)
  await user.click(screen.getByText('toggle'))
  expect(localStorage.getItem('doraemon-card-game-language')).toBe('th')
})

test('reads language from localStorage on init', () => {
  localStorage.setItem('doraemon-card-game-language', 'th')
  render(<LanguageProvider><TestConsumer /></LanguageProvider>)
  expect(screen.getByTestId('lang')).toHaveTextContent('th')
})

test('useLanguage throws when used outside LanguageProvider', () => {
  const originalError = console.error
  console.error = () => {}
  expect(() => render(<TestConsumer />)).toThrow(
    'useLanguage must be used within a LanguageProvider'
  )
  console.error = originalError
})
