import styles from './styles.css'
import * as React from 'react'

export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}

type Props = {
  active: boolean
  setActive: React.Dispatch<React.SetStateAction<boolean>>
}

export default function HamburgerMenu({ active, setActive }: Props) {
  return (
    <div
      className={active ? 'hamburger ripple is-active' : 'hamburger ripple'}
      id="hamburger-1"
      onClick={() => setActive(!active)}
    >
      <span className="line"></span>
      <span className="line"></span>
      <span className="line"></span>
    </div>
  )
}
