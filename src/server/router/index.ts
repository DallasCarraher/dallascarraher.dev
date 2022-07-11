// src/server/router/index.ts
import { createRouter } from './context'
import superjson from 'superjson'

import { postsRouter } from './posts'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('posts.', postsRouter)

// export type definition of API
export type AppRouter = typeof appRouter
