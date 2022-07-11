import { createContext, ReactNode, useContext } from 'react'
import { PrismaClient, Prisma } from '@prisma/client'

const PrismaClientContext = createContext({})

interface IPrismaClientProvider {
  children: string | ReactNode
  client: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >
}

/**
 * Provides the component tree the prisma client
 */
export function PrismaClientProvider({
  children,
  client,
}: IPrismaClientProvider) {
  return (
    <PrismaClientContext.Provider value={client}>
      {children}
    </PrismaClientContext.Provider>
  )
}

/**
 * Hook that returns the prisma client from context
 */
export function usePrisma() {
  const context = useContext(PrismaClientContext)
  if (context === undefined) {
    throw new Error('usePrisma  must be used within a CountProvider')
  }
  return context
}
