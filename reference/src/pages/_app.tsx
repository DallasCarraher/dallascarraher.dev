import { useEffect } from 'react'
import { UserProvider } from '@auth0/nextjs-auth0'
import { withTRPC } from '@trpc/next'
import superjson from 'superjson'
import { atom, useAtom } from 'jotai'

import '../styles/globals.css'

import type { AppRouter } from '../server/router'
import type { AppType } from 'next/dist/shared/lib/utils'
import { trpc } from '../utils/trpc'
import { IAccessCode } from '../server/router/spotify'

// const twentyFourHours = 24 * 60 * 60 * 1000

export const SpotifyToken = atom('')

const MyApp: AppType = ({ Component, pageProps }) => {
  const [, setToken] = useAtom(SpotifyToken)
  const spotifyTokens = trpc.useQuery(['spotify.getNewToken'], {
    staleTime: Infinity,
  })

  // once the token is fetched, set it in the atom
  useEffect(() => {
    if (spotifyTokens.data) {
      setToken(spotifyTokens.data.access_token)
    }
  }, [setToken, spotifyTokens.data])

  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  )
}

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return ''
  }
  if (process.browser) return '' // Browser should use current path
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}` // SSR should use vercel url

  return `http://localhost:${process.env.PORT ?? 3000}` // dev SSR should use localhost
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`

    return {
      url,
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    }
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(MyApp)
