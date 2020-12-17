import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import { default as DarkThemeIcon } from '@material-ui/icons/Brightness7'
import { default as LightThemeIcon } from '@material-ui/icons/Brightness4'
import styles from './Home.module.css'

export function NewHome({ toggleTheme, theme }) {
  return (
    <>
      <div className={styles.themeIcon}>
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
      </div>
      <h1>Re-writing my site right now, please bear with 😅</h1>
    </>
  )
}
