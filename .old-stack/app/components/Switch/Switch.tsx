import styles from './styles.css'

export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}

type Props = {
  value: boolean
  toggleValue: React.Dispatch<React.SetStateAction<boolean>>
  label?: string
}

export default function Switch({ value, toggleValue, label }: Props) {
  return (
    <div className="toggle-switch" id="toggle-switch">
      {label && <label htmlFor="switch">{label}</label>}
      <input
        id="switch"
        type="checkbox"
        checked={value}
        onChange={(e) => toggleValue(e.target.checked)}
      />
      <span></span>
    </div>
  )
}
