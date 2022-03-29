import styles from './styles.css'

export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}

type Props = {
  code: string
}

export default function CodeSnippet({ code }: Props) {
  return (
    <pre>
      <span className="code-snippet">{`${code}`}</span>
    </pre>
  )
}
