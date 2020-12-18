import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import { default as DarkThemeIcon } from '@material-ui/icons/Brightness7'
import { default as LightThemeIcon } from '@material-ui/icons/Brightness4'
import { useTheme } from 'theme'

export function ThemeIconButton() {
  const [state, dispatch] = useTheme()
  const { theme } = state

  function toggleTheme() {
    theme === 'light' ? dispatch('dark') : dispatch('light')
  }

  return (
    <IconButton
      aria-label="toggle light/dark mode"
      component="span"
      onClick={toggleTheme}
    >
      {theme === 'light' ? (
        <DarkThemeIcon style={{ color: 'black' }} />
      ) : (
        <LightThemeIcon style={{ color: 'white' }} />
      )}
    </IconButton>
  )
}
