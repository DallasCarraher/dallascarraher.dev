import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import { PrismaClient } from '@prisma/client'
import './main.css'

import { PrismaClientProvider } from './PrismaClientProvider'
import { Index } from './views/Index'

const queryClient = new QueryClient()
const prismaClient = new PrismaClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <PrismaClientProvider client={prismaClient}>
        <Index />
      </PrismaClientProvider>
    </QueryClientProvider>
  </StrictMode>
)
