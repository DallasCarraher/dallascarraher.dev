import * as React from 'react'
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from 'remix'
import type { LinksFunction } from 'remix'
import setTheme from './utils/setTheme'
import useDarkMode from '~/hooks/useDarkMode'
import Switch, { links as switchLinks } from '~/components/Switch/Switch'
import HamburgerMenu, {
  links as hamburgerLinks,
} from './components/HamburgerMenu/HamburgerMenu'

import globalStylesUrl from '~/styles/global.css'
import useWindowSize from './hooks/useWindowSize'
import Portal from './components/Portal/Portal'

// https://remix.run/api/app#links
export const links: LinksFunction = () => {
  return [
    ...switchLinks(),
    ...hamburgerLinks(),
    { rel: 'stylesheet', href: globalStylesUrl },
  ]
}

export default function App() {
  return (
    <Document title="Dallas Carraher">
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  )
}

// https://remix.run/docs/en/v1/api/conventions#errorboundary
export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error)
  return (
    <Document title="Error!">
      <Layout>
        <div>
          <h1>There was an error</h1>
          <p>{error.message}</p>
          <hr />
          <p>
            Hey, developer, you should replace this with what you want your
            users to see.
          </p>
        </div>
      </Layout>
    </Document>
  )
}

// https://remix.run/docs/en/v1/api/conventions#catchboundary
export function CatchBoundary() {
  const caught = useCatch()

  let message
  switch (caught.status) {
    case 401:
      message = (
        <p>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </p>
      )
      break
    case 404:
      message = (
        <p>
          Oops! Looks like you tried to visit a page that does not exist or
          doesn't exist yet!
        </p>
      )
      break

    default:
      throw new Error(caught.data || caught.statusText)
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Layout>
        <h1>
          {caught.status}: {caught.statusText}
        </h1>
        {message}
      </Layout>
    </Document>
  )
}

function Document({
  children,
  title,
}: {
  children: React.ReactNode
  title?: string
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body>
        <div title="setTheme script" dangerouslySetInnerHTML={setTheme()} />
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  )
}

function Layout({ children }: { children: React.ReactNode }) {
  const { dark, setDark } = useDarkMode()
  const { width } = useWindowSize()
  const [hamMenu, setHamMenu] = React.useState(false)
  return (
    <div className="portfolio-app">
      <header className="max-width-wrapper header">
        <Link to="/" title="Dallas Carraher" className="header-home-link">
          <h1>Dallas Carraher</h1>
        </Link>
        {width > 760 && (
          <nav aria-label="Main navigation" className="header-nav">
            <ul>
              <li>
                <Link to="/posts">Posts</Link>
              </li>
              <li>
                <a
                  href="https://linkedin.com/in/dallascarraher/"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/dallascarraher"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              </li>
              <li>
                <Switch value={dark} toggleValue={setDark} />
              </li>
            </ul>
          </nav>
        )}
        {width > -1 && width <= 760 && (
          <HamburgerMenu active={hamMenu} setActive={setHamMenu} />
        )}
      </header>
      <main>{children}</main>
      {hamMenu && (
        <Portal el="mobile-nav">
          <div className="ham-menu-nav">
            <ul>
              <li onClick={() => setHamMenu(!hamMenu)}>
                <Link to="/">Home</Link>
              </li>
              <li onClick={() => setHamMenu(!hamMenu)}>
                <Link to="/posts">Posts</Link>
              </li>
              <li>
                <a
                  href="https://linkedin.com/in/dallascarraher/"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/dallascarraher"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              </li>
              <li>
                <button onClick={() => setDark(!dark)}>
                  {dark ? 'switch to light mode' : 'switch to dark mode'}
                </button>
              </li>
            </ul>
          </div>
        </Portal>
      )}
    </div>
  )
}
