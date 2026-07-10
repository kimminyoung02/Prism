import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface ThemeContextValue {
  isDark: boolean
  toggleDark: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = "prism-theme-override"

function getSystemPrefersDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

function getStoredOverride(): boolean | null {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === "dark") return true
  if (stored === "light") return false
  return null
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(() => getStoredOverride() ?? getSystemPrefersDark())

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  // 사용자가 명시적으로 선택한 적이 없으면, 시스템 다크모드 설정 변경을 실시간으로 따라감
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e: MediaQueryListEvent) => {
      if (getStoredOverride() === null) setIsDark(e.matches)
    }
    media.addEventListener("change", handleChange)
    return () => media.removeEventListener("change", handleChange)
  }, [])

  const toggleDark = () => {
    setIsDark((prev) => {
      const next = !prev
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light")
      return next
    })
  }

  return <ThemeContext.Provider value={{ isDark, toggleDark }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}
