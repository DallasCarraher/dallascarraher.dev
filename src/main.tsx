import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './main.css'

import { Index } from './views/Index'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Index />
  </StrictMode>
)
