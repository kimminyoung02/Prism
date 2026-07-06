import { createContext, useContext, useMemo, useState, type ReactNode } from "react"

export interface ScrapItem {
  id: string
  type: "product" | "review"
  title: string
  subtitle: string
  /** product 타입: /result 로 돌아갈 때 쓸 검색어 */
  query?: string
  /** review 타입: 원문 링크 */
  url?: string
}

interface ScrapContextValue {
  items: ScrapItem[]
  isScrapped: (id: string) => boolean
  toggleScrap: (item: ScrapItem) => void
}

const ScrapContext = createContext<ScrapContextValue | null>(null)

export function ScrapProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ScrapItem[]>([])

  const toggleScrap = (item: ScrapItem) => {
    setItems((prev) => (prev.some((i) => i.id === item.id) ? prev.filter((i) => i.id !== item.id) : [item, ...prev]))
  }

  const isScrapped = (id: string) => items.some((i) => i.id === id)

  const value = useMemo(() => ({ items, isScrapped, toggleScrap }), [items])

  return <ScrapContext.Provider value={value}>{children}</ScrapContext.Provider>
}

export function useScrap() {
  const ctx = useContext(ScrapContext)
  if (!ctx) throw new Error("useScrap must be used within ScrapProvider")
  return ctx
}
