import React from 'react'
import { render, screen } from '@testing-library/react'
import { ThemeStateProvider } from 'theme'
import App from '../App'

const TestComponent = () => {
  return (
    <ThemeStateProvider>
      <App />
    </ThemeStateProvider>
  )
}

describe('App', () => {
  test('renders', () => {
    render(<TestComponent />)
    const myName = screen.getByText(/Dallas Carraher/)
    expect(myName).toBeInTheDocument()
  })
})
