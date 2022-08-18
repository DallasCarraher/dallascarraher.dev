import { createRouter } from './context'
import superjson from 'superjson'

import { postsRouter } from './posts'
import { spotifyRouter } from './spotify'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('posts.', postsRouter)
  .merge('spotify.', spotifyRouter)

// export type definition of API
export type AppRouter = typeof appRouter
