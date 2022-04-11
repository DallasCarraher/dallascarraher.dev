import * as React from 'react'
import CategoryPills, {
  links as categoryPillLinks,
} from '~/components/CategoryPills/CategoryPills'
import Box, { links as boxLinks } from '~/components/Box/Box'

import styles from '~/styles/snippets.css'

export function links() {
  return [
    ...categoryPillLinks(),
    ...boxLinks(),
    { rel: 'stylesheet', href: styles },
  ]
}

export default function Snippets() {
  const [filters, setFilters] = React.useState(['JavaScript', 'React', 'Hooks'])
  const showJavaScript = filters.includes('JavaScript')
  const showReact = filters.includes('React')
  const showHooks = filters.includes('Hooks')

  return (
    <section title="snippets">
      <CategoryPills
        filterNames={['JavaScript', 'React', 'Hooks']}
        active={filters}
        setChoices={setFilters}
      />
      <div className="snippets-grid">
        {/* JavaScript Snippets */}
        {showJavaScript && (
          <>
            <Box
              alt="by Lucas Sankey"
              link="/snippets/convertLinks"
              title="Converting Links in Plain Text"
              text="a short post on how to convert links in strings to anchor tags safely"
              img="https://images.unsplash.com/photo-1555101835-7271e43705ff?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
              categories={['JavaScript']}
            />
          </>
        )}
        {/* Hooks Snippets */}
        {showHooks && null}
        {/* React-specific Snippets */}
        {showReact && null}
      </div>
    </section>
  )
}
