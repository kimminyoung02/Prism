import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ScrapProvider } from './store/ScrapContext.tsx'
import { AuthProvider } from './store/AuthContext.tsx'
import { ProfileProvider } from './store/ProfileContext.tsx'
import { ThemeProvider } from './store/ThemeContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ProfileProvider>
            <ScrapProvider>
              <App />
            </ScrapProvider>
          </ProfileProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
