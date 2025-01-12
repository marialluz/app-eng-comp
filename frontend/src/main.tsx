import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CompFlow from './CompFlow.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CompFlow />
  </StrictMode>,
)
