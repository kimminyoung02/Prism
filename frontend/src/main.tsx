import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ScrapProvider } from './store/ScrapContext.tsx'
import { AuthProvider } from './store/AuthContext.tsx'
import { ProfileProvider } from './store/ProfileContext.tsx'
import { ThemeProvider } from './store/ThemeContext.tsx'
import { LanguageProvider } from './store/LanguageContext.tsx'
import { ActivityProvider } from './store/ActivityContext.tsx'
import { NotificationSettingsProvider } from './store/NotificationSettingsContext.tsx'
import { ProductImageProvider } from './store/ProductImageContext.tsx'
import { EngagementProvider } from './store/EngagementContext.tsx'
import { CommunityProvider } from './store/CommunityContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <ProfileProvider>
              <ScrapProvider>
                <ActivityProvider>
                  <NotificationSettingsProvider>
                    <ProductImageProvider>
                      <EngagementProvider>
                        <CommunityProvider>
                          <App />
                        </CommunityProvider>
                      </EngagementProvider>
                    </ProductImageProvider>
                  </NotificationSettingsProvider>
                </ActivityProvider>
              </ScrapProvider>
            </ProfileProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
