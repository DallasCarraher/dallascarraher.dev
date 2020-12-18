import React from 'react'
import styles from './Home.module.css'
import { Header } from '../Header'
import { ThemeIconButton } from 'components/ThemeIconButton'

export function Home() {
  return (
    <>
      <Header />
      <div className={styles.themeIcon}>
        <ThemeIconButton />
      </div>
      <h1>Re-writing my site right now, please bear with 😅</h1>
    </>
  )
}
