import Box, { links as boxLinks } from '~/components/Box/Box'
import styles from '~/styles/snippets.css'

export function links() {
  return [...boxLinks(), { rel: 'stylesheet', href: styles }]
}

export default function Snippets() {
  return (
    <main>
      <div className="snippets-grid">
        <Box
          link="/snippets/convertLinks"
          title="Converting Links in Plain Text"
          text="a short post on how to convert links in strings to anchor tags safely"
          img="https://unsplash.com/photos/1i7RLrsEcZo/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjQ4NTIxMTM4&force=true"
        />
      </div>
    </main>
  )
}
