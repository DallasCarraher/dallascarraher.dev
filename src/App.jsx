import React from 'react'
import { ThemeProvider } from 'styled-components'
import { GlobalStyles, darkTheme, lightTheme, useTheme } from './theme'
import { Router } from '@reach/router'
import { NewHome } from 'Views/components'

function App() {
  document.title = 'Dallas Carraher'

  const [state, dispatch] = useTheme()
  const { theme } = state

  const toggleTheme = () =>
    theme === 'light' ? dispatch('dark') : dispatch('light')

  React.useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <GlobalStyles />
      <Router>
        <NewHome path="/" toggleTheme={toggleTheme} theme={theme} />
      </Router>
    </ThemeProvider>
  )
}

export default App
