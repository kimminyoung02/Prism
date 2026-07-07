import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ScrapProvider } from './store/ScrapContext.tsx'
import { AuthProvider } from './store/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ScrapProvider>
          <App />
        </ScrapProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
