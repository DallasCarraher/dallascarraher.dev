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
      style={{ backgroundColor: 'transparent' }}
      aria-label="toggle light/dark mode"
      component="span"
      disableRipple
      onClick={toggleTheme}
    >
      {theme === 'light' ? (
        <DarkThemeIcon style={{ color: '#363537' }} />
      ) : (
        <LightThemeIcon style={{ color: '#FAFAFA' }} />
      )}
    </IconButton>
  )
}
