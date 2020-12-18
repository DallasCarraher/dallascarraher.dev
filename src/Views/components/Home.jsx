import React from 'react'
import { Header } from './Header'
import styles from './Home.module.css'

export function Home() {
  return (
    <>
      <Header />
      <h1 className={styles.message}>
        Re-writing my site right now, please bear with 😅
      </h1>
    </>
  )
}
