import React from 'react'
import { render } from '@testing-library/react'
import { ThemeProvider } from 'utils'
import Navigation from './Navigation'

test.skip('renders navigation', () => {
  const { getByText } = render(
    <ThemeProvider>
      <Navigation />
    </ThemeProvider>
  )
  const appBarTitle = getByText(/Dallas Carraher/i)
  const navbarHomeButton = getByText(/Home/i)
  const navbarResumeButton = getByText(/Resumé/i)
  expect(
    appBarTitle && navbarHomeButton && navbarResumeButton
  ).toBeInTheDocument()
})
