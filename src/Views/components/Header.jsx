import React from 'react'
import { ThemeIconButton } from 'components/ThemeIconButton'
import styles from './Header.module.css'

export function Header() {
  return (
    <header className={styles.flexParent}>
      <h1 className={styles.flexChild}>Dallas Carraher</h1>
      <ThemeIconButton className={styles.flexChild} />
    </header>
  )
}
