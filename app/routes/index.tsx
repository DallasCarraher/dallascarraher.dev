import type { MetaFunction, LoaderFunction } from 'remix'
import { useLoaderData, json, Link } from 'remix'
import picture from '~/assets/avatar.jpg'
import useWindowSize from '~/hooks/useWindowSize'
// import { CategoryPill } from '~/components/CategoryPill/CategoryPill'
import styles from '~/styles/index.css'
import { getPosts, Post } from './posts/post'

export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}

// https://remix.run/api/conventions#loader
export let loader: LoaderFunction = () => {
  let data = getPosts()

  // https://remix.run/api/remix#json
  return json(data)
}

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
  return {
    title: 'DallasCarraher.dev',
    description: 'Welcome to my site!',
  }
}

// https://remix.run/guides/routing#index-routes
export default function Index() {
  // let posts = useLoaderData<Post[]>()
  // const filters = ['React', 'TypeScript', 'Vue', 'Webpack']
  const { width } = useWindowSize()

  return (
    <main className="max-width-wrapper main">
      <section className="intro">
        <img src={picture} className="avatar" />
        <div>
          <h1 className="greeting">
            Hi, my name is Dallas! Thanks for stopping by 👋
          </h1>
          <h3 className="greeting-2">
            This will hopefully be a cool place to learn things soon and maybe
            even collaborate
          </h3>
        </div>
      </section>
      <section className="home-grid">
        <div className="posts">
          <h2 className="section-header">Recent</h2>
          <div className="post-link">
            <Link to="/snippets">
              <h3>Snippets!</h3>
              <p>
                I've gone ahead and added my first snippet! Check it out by
                clicking here.
              </p>
            </Link>
          </div>
        </div>
        {width > 1024 && (
          <div className="categories">
            <h2 className="section-header">Categories</h2>
            {/* <ul className="">
            {filters.map((filter) => (
              <li>
                <CategoryPill filter={filter} />
              </li>
            ))}
          </ul> */}
            N/A
          </div>
        )}
      </section>
    </main>
  )
}
