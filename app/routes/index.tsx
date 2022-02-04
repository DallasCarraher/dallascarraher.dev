import type { MetaFunction, LoaderFunction } from 'remix'
import { useLoaderData, json, Link } from 'remix'
import picture from '~/assets/avatar.jpg'
import { CategoryPill } from '~/components/CategoryPill/CategoryPill'
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
  let posts = useLoaderData<Post[]>()
  const filters = ['React', 'TypeScript', 'Vue', 'Webpack']

  return (
    <>
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
      <main className="home-grid">
        <div className="posts">
          <h2 className="section-header">Recent</h2>
          <div className="post-link">
            <Link to="#">
              <h3>Blog Posts incoming!</h3>
              <p>
                I'll have some blog posts here soon that I'm really excited to
                start working on{' '}
                <span role="img" aria-label="dancing">
                  🕺
                </span>
              </p>
              {/* <span>Continue Reading</span> */}
            </Link>
          </div>
          {/* {posts.map((post) => (
            <div className="post-link">
              <Link to={`/posts/${post.id}`}>
                <h3>{post.title}</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nisi
                  modi magni pariatur repellat nemo, animi molestiae at iure.
                  Pariatur suscipit, vel laudantium animi tempora ullam
                  exercitationem nemo aliquid, quidem, ratione temporibus
                  perferendis reprehenderit magnam!
                </p>
                <span>Continue Reading</span>
              </Link>
            </div>
          ))} */}
        </div>
        <div className="categories">
          <h2 className="section-header">Categories</h2>
          {/* categories of posts will be here */}
          {/* <ul className="">
            {filters.map((filter) => (
              <li>
                <CategoryPill filter={filter} />
              </li>
            ))}
          </ul> */}
          N/A
        </div>
        <div className="popular">
          <h2 className="section-header">Popular</h2>
          {/* popular posts will be listed here */}
          <p>N/A</p>
        </div>
      </main>
    </>
  )
}
