import * as React from 'react'
import CategoryPills, {
  links as categoryPillLinks,
} from '~/components/CategoryPills/CategoryPills'
import Box, { links as boxLinks } from '~/components/Box/Box'

import styles from '~/styles/posts.css'

export function links() {
  return [
    ...categoryPillLinks(),
    ...boxLinks(),
    { rel: 'stylesheet', href: styles },
  ]
}

export default function Posts() {
  const [filters, setFilters] = React.useState(['JavaScript', 'React', 'Hooks'])
  const showJavaScript = filters.includes('JavaScript')
  const showReact = filters.includes('React')
  const showHooks = filters.includes('Hooks')

  return (
    <section title="posts">
      <CategoryPills
        filterNames={['JavaScript', 'React', 'Hooks']}
        active={filters}
        setChoices={setFilters}
      />
      <div className="posts-grid">
        {/* JavaScript Posts */}
        {showJavaScript && (
          <>
            <Box
              alt="by Lucas Sankey"
              link="/posts/convertLinks"
              title="Converting Links in Plain Text"
              text="a short post on how to convert links in strings to anchor tags safely"
              img="https://images.unsplash.com/photo-1555101835-7271e43705ff?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
              categories={['JavaScript']}
            />
          </>
        )}
        {/* Hooks Posts */}
        {showHooks && null}
        {/* React-specific Posts */}
        {showReact && null}
      </div>
    </section>
  )
}
