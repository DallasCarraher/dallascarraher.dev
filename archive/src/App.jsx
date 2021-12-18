import React from 'react'
import { ThemeProvider } from 'styled-components'
import { GlobalStyles, darkTheme, lightTheme, useTheme } from './theme'
import { Router } from '@reach/router'
import { Home } from 'components'

function App() {
  document.title = 'Dallas Carraher'

  const [state] = useTheme()
  const { theme } = state

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <GlobalStyles />
      <Router>
        <Home path="/" />
      </Router>
    </ThemeProvider>
  )
}

export default App
