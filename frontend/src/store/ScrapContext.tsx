import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient"
import { useAuth } from "./AuthContext"
import type { ScrapRow } from "../lib/database.types"

export interface ScrapItem {
  id: string
  type: "product" | "review"
  title: string
  subtitle: string
  /** product 타입: /result 로 돌아갈 때 쓸 검색어 */
  query?: string
  /** product 타입: AI 종합 별점 */
  rating?: number
  /** review 타입: 원문 링크 */
  url?: string
  /** review 타입: 출처 (블로그/유튜브/커뮤니티) */
  source?: "blog" | "youtube" | "community"
}

interface ScrapContextValue {
  items: ScrapItem[]
  isScrapped: (id: string) => boolean
  toggleScrap: (item: ScrapItem) => void
}

const ScrapContext = createContext<ScrapContextValue | null>(null)

function fromRow(row: ScrapRow): ScrapItem {
  return {
    id: row.ref_id,
    type: row.item_type,
    title: row.title,
    subtitle: row.subtitle ?? "",
    query: row.query ?? undefined,
    rating: row.rating ?? undefined,
    url: row.url ?? undefined,
    source: row.source ?? undefined,
  }
}

export function ScrapProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [items, setItems] = useState<ScrapItem[]>([])

  useEffect(() => {
    if (!user || !isSupabaseConfigured) {
      setItems([])
      return
    }

    let cancelled = false
    supabase
      .from("scraps")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (cancelled || !data) return
        setItems((data as ScrapRow[]).map(fromRow))
      })

    return () => {
      cancelled = true
    }
  }, [user])

  const isScrapped = (id: string) => items.some((i) => i.id === id)

  const toggleScrap = (item: ScrapItem) => {
    if (!user || !isSupabaseConfigured) return

    const currentlyScrapped = items.some((i) => i.id === item.id)

    if (currentlyScrapped) {
      setItems((prev) => prev.filter((i) => i.id !== item.id))
      supabase
        .from("scraps")
        .delete()
        .eq("user_id", user.id)
        .eq("ref_id", item.id)
        .then(undefined, (err: unknown) => console.error("scrap delete failed", err))
    } else {
      setItems((prev) => [item, ...prev])
      supabase
        .from("scraps")
        .insert({
          user_id: user.id,
          item_type: item.type,
          ref_id: item.id,
          title: item.title,
          subtitle: item.subtitle,
          query: item.query ?? null,
          rating: item.rating ?? null,
          url: item.url ?? null,
          source: item.source ?? null,
        })
        .then(undefined, (err: unknown) => console.error("scrap insert failed", err))
    }
  }

  return <ScrapContext.Provider value={{ items, isScrapped, toggleScrap }}>{children}</ScrapContext.Provider>
}

export function useScrap() {
  const ctx = useContext(ScrapContext)
  if (!ctx) throw new Error("useScrap must be used within ScrapProvider")
  return ctx
}
