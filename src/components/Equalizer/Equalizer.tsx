import styles from './Equalizer.module.css'

export const Equalizer = () => {
  return (
    <div className={styles['container']}>
      <div className={styles['box']}>
        <div className={styles['line1']}></div>
        <div className={styles['line2']}></div>
        <div className={styles['line3']}></div>
        <div className={styles['line4']}></div>
        <div className={styles['line5']}></div>
      </div>
    </div>
  )
}
