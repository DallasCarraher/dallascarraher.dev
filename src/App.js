import React from 'react'
// import { Router } from '@reach/router'
// import { ThemeProvider } from "utils";
import { ThemeProvider } from 'styled-components'
import { darkTheme, lightTheme } from './theme'
import { GlobalStyles } from './global'
// import { Home, Resume, Blog } from 'components'

function App() {
  document.title = 'Dallas Carraher'
  const [theme, setTheme] = React.useState(() => localStorage.getItem('theme'))

  React.useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () =>
    theme === 'light' ? setTheme('dark') : setTheme('light')

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <>
        <GlobalStyles />
        <button onClick={toggleTheme}>Toggle theme</button>
        <h1>
          {theme === 'light'
            ? "It's a light theme! 🌞"
            : "It's a dark theme 🌚"}
        </h1>
        <footer></footer>
      </>
    </ThemeProvider>
    // <ThemeProvider>
    //   <Router>
    //     <Home path="/" />
    //     <Resume path="/resume" />
    //     <Blog path="/blog" />
    //   </Router>
    // </ThemeProvider>
  )
}

export default App
