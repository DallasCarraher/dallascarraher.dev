import { Link, useLoaderData } from 'remix'
import { getPosts } from './post'
import type { Post } from './post'
import styles from '~/styles/global.css'

export const links = () => [{ rel: 'stylesheet', href: styles }]

export const loader = () => {
  return getPosts()
}

export default function Posts() {
  const posts = useLoaderData<Post[]>()
  return (
    <>
      <section className="main">
        <h1>Posts</h1>
        <Link to="/posts/new" className="button">
          New Post
        </Link>
      </section>
      <main className="blog-app__main">
        <ul className="posts-list">
          {posts.map((post) => (
            <article key={post.id} className="post">
              <a href={`/posts/${post.id}`}>
                <h3>{post.title}</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nisi
                  modi magni pariatur repellat nemo, animi molestiae at iure.
                  Pariatur suscipit, vel laudantium animi tempora ullam
                  exercitationem nemo aliquid, quidem, ratione temporibus
                  perferendis reprehenderit magnam!
                </p>
              </a>
              <Link to="/posts">see more</Link>
            </article>
          ))}
        </ul>
      </main>
    </>
  )
}
