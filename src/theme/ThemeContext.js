import React from 'react'

const ThemeContext = React.createContext()

const themes = {
  LIGHT: 'light',
  DARK: 'dark',
}

const { LIGHT, DARK } = themes
const savedTheme = { theme: localStorage.getItem('theme') || LIGHT }

function themeReducer(state, theme) {
  switch (theme) {
    case LIGHT: {
      localStorage.setItem('theme', LIGHT)
      return { theme: LIGHT }
    }
    case DARK: {
      localStorage.setItem('theme', DARK)
      return { theme: DARK }
    }
    default: {
      throw new Error(`unhandled theme action: ${theme.value}`)
    }
  }
}

function ThemeStateProvider({ children }) {
  const [state, dispatch] = React.useReducer(themeReducer, savedTheme)
  return (
    <ThemeContext.Provider value={[state, dispatch]}>
      {children}
    </ThemeContext.Provider>
  )
}

function useTheme() {
  const context = React.useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useThemeState must be used within a themeProvider')
  }
  return context
}

export { ThemeStateProvider, useTheme, themes }
