import { createContext, useContext, useState, type ReactNode } from "react"

export type NotificationKey = "push" | "analysisDone" | "recommend"

interface NotificationSettingsValue {
  toggles: Record<NotificationKey, boolean>
  setToggle: (key: NotificationKey, value: boolean) => void
}

const NotificationSettingsContext = createContext<NotificationSettingsValue | null>(null)

export function NotificationSettingsProvider({ children }: { children: ReactNode }) {
  const [toggles, setToggles] = useState<Record<NotificationKey, boolean>>({
    push: true,
    analysisDone: true,
    recommend: true,
  })

  const setToggle = (key: NotificationKey, value: boolean) => {
    setToggles((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <NotificationSettingsContext.Provider value={{ toggles, setToggle }}>
      {children}
    </NotificationSettingsContext.Provider>
  )
}

export function useNotificationSettings() {
  const ctx = useContext(NotificationSettingsContext)
  if (!ctx) throw new Error("useNotificationSettings must be used within NotificationSettingsProvider")
  return ctx
}
