// src/server/router/index.ts
import { createRouter } from './context'
import superjson from 'superjson'

import { postsRouter } from './posts'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('example.', postsRouter)

// export type definition of API
export type AppRouter = typeof appRouter
