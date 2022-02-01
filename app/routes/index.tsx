import type { MetaFunction, LoaderFunction } from 'remix'
import { useLoaderData, json, Link } from 'remix'
import picture from '~/assets/avatar.jpg'
import styles from '~/styles/index.css'

export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}

type IndexData = {
  resources: Array<{ name: string; url: string }>
  demos: Array<{ name: string; to: string }>
}

// Loaders provide data to components and are only ever called on the server, so
// you can connect to a database or run any server side code you want right next
// to the component that renders it.
// https://remix.run/api/conventions#loader
export let loader: LoaderFunction = () => {
  let data: IndexData = {
    resources: [
      {
        name: 'Remix Docs',
        url: 'https://remix.run/docs',
      },
      {
        name: 'React Router Docs',
        url: 'https://reactrouter.com/docs',
      },
      {
        name: 'Remix Discord',
        url: 'https://discord.gg/VBePs6d',
      },
    ],
    demos: [
      {
        to: 'demos/actions',
        name: 'Actions',
      },
      {
        to: 'demos/about',
        name: 'Nested Routes, CSS loading/unloading',
      },
      {
        to: 'demos/params',
        name: 'URL Params and Error Boundaries',
      },
    ],
  }

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
  let data = useLoaderData<IndexData>()

  return (
    <>
      <div className="portfolio-app__intro">
        <img src={picture} className="avatar" />
        <div>
          <h1 className="greeting">
            Hi, my name is Dallas! Thanks for stopping by 👋
          </h1>
          <h3 className="skills">
            This will hopefully be a cool place to learn things soon and
            collaborate
          </h3>
        </div>
      </div>
      <div className="portfolio-app__grid">
        <section className="portfolio-app__posts">
          <h1>Posts</h1>
          <div className="post">
            <h3>Post example</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nisi
              modi magni pariatur repellat nemo, animi molestiae at iure.
              Pariatur suscipit, vel laudantium animi tempora ullam
              exercitationem nemo aliquid, quidem, ratione temporibus
              perferendis reprehenderit magnam! Ex, enim quidem? Eaque vero
              facilis praesentium odit sunt doloribus ipsum deleniti
              consequuntur natus quo reprehenderit, sequi ducimus sit quis non
              corporis ea ipsa dolor, fugiat nulla assumenda aut laboriosam, a
              at.
            </p>
          </div>
          <div className="post">
            <h3>Post example</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nisi
              modi magni pariatur repellat nemo, animi molestiae at iure.
              Pariatur suscipit, vel laudantium animi tempora ullam
              exercitationem nemo aliquid, quidem, ratione temporibus
              perferendis reprehenderit magnam! Ex, enim quidem? Eaque vero
              facilis praesentium odit sunt doloribus ipsum deleniti
              consequuntur natus quo reprehenderit, sequi ducimus sit quis non
              corporis ea ipsa dolor, fugiat nulla assumenda aut laboriosam, a
              at. Incidunt aliquid soluta sequi a recusandae veniam voluptas
              vitae ipsum? Repudiandae quos voluptatem nesciunt at numquam
              explicabo nihil tenetur minus. Sed quod dolorem enim.
            </p>
          </div>
        </section>
        <section className="portfolio-app__categories">
          <h2>Categories</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam
            doloremque temporibus nesciunt corrupti maiores. Omnis magnam sed
            id. Nihil quod laudantium officiis minima dolores culpa suscipit
            dignissimos, amet perferendis architecto?
          </p>
        </section>
        <section className="portfolio-app__popular">
          <h2>Popular</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus
            excepturi dolorem fugit dolor voluptate veniam nostrum dicta eius,
            neque dignissimos aliquid sunt quas consectetur quia eveniet odit
            fugiat ullam perspiciatis.
          </p>
        </section>
      </div>
    </>
  )
}
