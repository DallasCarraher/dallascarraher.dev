import React from 'react'
import { ThemeProvider } from 'styled-components'
import { GlobalStyles, darkTheme, lightTheme } from './theme'
import { Router } from '@reach/router'
import { NewHome } from 'Views/components'
// import { ThemeProvider } from "utils";

function App() {
  document.title = 'Dallas Carraher'
  const [theme, setTheme] = React.useState(() => localStorage.getItem('theme'))

  const toggleTheme = () =>
    theme === 'light' ? setTheme('dark') : setTheme('light')

  React.useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <GlobalStyles />
      <Router>
        <NewHome path="/" toggleTheme={toggleTheme} />
        {/* <Home path="/" /> */}
        {/* <Resume path="/resume" /> */}
        {/* <Blog path="/blog" /> */}
      </Router>
    </ThemeProvider>
  )
}

export default App
